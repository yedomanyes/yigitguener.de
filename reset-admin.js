const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function resetAdmin() {
    const hash = await bcrypt.hash('Minosch20#20', 10);
    db.run("UPDATE users SET password = ? WHERE username = ?", [hash, 'admin'], function(err) {
        if (err) {
            console.error('Error resetting admin:', err.message);
        } else if (this.changes === 0) {
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hash, 'admin'], (insertErr) => {
                if (insertErr) console.error('Error creating admin:', insertErr.message);
                else console.log('Admin user created successfully with password: Minosch20#20');
            });
        } else {
            console.log('Admin password reset successfully to: Minosch20#20');
        }
    });
}

resetAdmin();
