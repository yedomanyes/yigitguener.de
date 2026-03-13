const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) or local dev
        if (!origin || /localhost|127\.0\.0\.1/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'super-secure-secret-key-foerdercheckplus-admin-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Route Protection Middleware
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') return next();
    if (req.path.startsWith('/api/admin')) return res.status(401).json({ error: 'Unauthorized' });
    res.redirect('/anmelden.html');
};

// Protect admin HTML file before static middleware
app.use('/admin.html', requireAdmin);

// Serve static files
app.use(express.static(__dirname));

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for user: ${username}`);
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            console.warn(`User not found: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log(`Successful login for: ${username}`);
            req.session.userId = user.id;
            req.session.role = user.role;
            res.json({ success: true });
        } else {
            console.warn(`Password mismatch for: ${username}`);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// --- PUBLIC: Submit Contact Form ---
app.post('/api/contact', (req, res) => {
    const { firstName, lastName, email, subject, category, message } = req.body;
    console.log(`Contact form submission from: ${email}`);
    if (!firstName || !lastName || !email || !subject || !message) {
        console.warn('Missing required fields in contact form');
        return res.status(400).json({ error: 'All required fields must be filled.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.warn(`Invalid email in contact form: ${email}`);
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    db.run(
        'INSERT INTO contacts (firstName, lastName, email, subject, category, message) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, subject, category, message],
        function(err) {
            if (err) {
                console.error('Database error during contact submission:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log(`Contact message saved with ID: ${this.lastID}`);
            res.json({ success: true, id: this.lastID });
        }
    );
});

// --- PUBLIC: Newsletter Subscribe ---
app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    console.log(`Newsletter subscription attempt: ${email}`);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.warn(`Invalid newsletter email: ${email}`);
        return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
    }

    db.run(
        'INSERT INTO newsletter (email) VALUES (?)',
        [email],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    console.warn(`Newsletter email already exists: ${email}`);
                    return res.status(409).json({ error: 'Bereits abonniert.' });
                }
                console.error('Database error during newsletter signup:', err);
                return res.status(500).json({ error: 'Datenbankfehler.' });
            }
            console.log(`Newsletter signup successful for: ${email}`);
            res.json({ success: true, id: this.lastID });
        }
    );
});

// --- ADMIN: CONTACTS ---
app.get('/api/admin/contacts', requireAdmin, (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY createdAt DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.put('/api/admin/contacts/:id/status', requireAdmin, (req, res) => {
    db.run("UPDATE contacts SET status = ? WHERE id = ?", [req.body.status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
app.delete('/api/admin/contacts/:id', requireAdmin, (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- ADMIN: PROGRAMS (CRUD) ---

// Get all programs
app.get('/api/admin/programs', requireAdmin, (req, res) => {
    db.all("SELECT * FROM programs ORDER BY updatedAt DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse buttons JSON for each row
        rows = rows.map(r => ({ ...r, buttons: JSON.parse(r.buttons || '[]') }));
        res.json(rows);
    });
});

// Get single program
app.get('/api/admin/programs/:id', requireAdmin, (req, res) => {
    db.get("SELECT * FROM programs WHERE id = ?", [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Not found' });
        row.buttons = JSON.parse(row.buttons || '[]');
        res.json(row);
    });
});

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as total FROM programs", [], (err, r) => {
        stats.totalPrograms = r ? r.total : 0;
        db.get("SELECT COUNT(*) as total FROM programs WHERE status = 'Veröffentlicht'", [], (err2, r2) => {
            stats.publishedPrograms = r2 ? r2.total : 0;
            db.get("SELECT COUNT(*) as total FROM programs WHERE status = 'Entwurf'", [], (err3, r3) => {
                stats.draftPrograms = r3 ? r3.total : 0;
                db.get("SELECT COUNT(*) as total FROM contacts WHERE status = 'Neu'", [], (err4, r4) => {
                    stats.newContacts = r4 ? r4.total : 0;
                    db.get("SELECT COUNT(*) as total FROM newsletter", [], (errNewsletter, rNewsletter) => {
                        stats.newsletterCount = rNewsletter ? rNewsletter.total : 0;
                        db.all("SELECT * FROM programs ORDER BY updatedAt DESC LIMIT 5", [], (err5, recent) => {
                            stats.recentPrograms = (recent || []).map(p => ({ ...p, buttons: JSON.parse(p.buttons || '[]') }));
                            db.all("SELECT * FROM contacts ORDER BY createdAt DESC LIMIT 5", [], (err6, recentC) => {
                                stats.recentContacts = recentC || [];
                                res.json(stats);
                            });
                        });
                    });
                });
            });
        });
    });
});

// Create program
app.post('/api/admin/programs', requireAdmin, (req, res) => {
    const { title, shortDesc, content, category, region, fundingAmount, status, imageUrl, buttons, slug } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const generatedSlug = slug || title.toLowerCase().replace(/[äöü]/g, c => ({ä:'ae',ö:'oe',ü:'ue'}[c])).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const buttonsJson = JSON.stringify(buttons || []);

    db.run(
        `INSERT INTO programs (title, slug, shortDesc, content, category, region, fundingAmount, status, imageUrl, buttons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, generatedSlug, shortDesc, content, category, region, fundingAmount, status || 'Entwurf', imageUrl, buttonsJson],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID, slug: generatedSlug });
        }
    );
});

// Update program
app.put('/api/admin/programs/:id', requireAdmin, (req, res) => {
    const { title, shortDesc, content, category, region, fundingAmount, status, imageUrl, buttons, slug } = req.body;
    const buttonsJson = JSON.stringify(buttons || []);
    db.run(
        `UPDATE programs SET title=?, slug=?, shortDesc=?, content=?, category=?, region=?, fundingAmount=?, status=?, imageUrl=?, buttons=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?`,
        [title, slug, shortDesc, content, category, region, fundingAmount, status, imageUrl, buttonsJson, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// Delete program
app.delete('/api/admin/programs/:id', requireAdmin, (req, res) => {
    db.run("DELETE FROM programs WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- ADMIN: NEWSLETTER ---
app.get('/api/admin/newsletter', requireAdmin, (req, res) => {
    db.all("SELECT * FROM newsletter ORDER BY createdAt DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/admin/newsletter/:id', requireAdmin, (req, res) => {
    db.run("DELETE FROM newsletter WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Triggering restart
