const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initDB();
    }
});

function initDB() {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`, (err) => {
        if (!err) {
            setupAdmin();
        }
    });

    // Create contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        category TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'Neu',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create programs/articles table
    db.run(`CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        shortDesc TEXT,
        content TEXT,
        category TEXT,
        region TEXT,
        fundingAmount TEXT,
        status TEXT DEFAULT 'Entwurf',
        imageUrl TEXT,
        buttons TEXT DEFAULT '[]',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create newsletter table
    db.run(`CREATE TABLE IF NOT EXISTS newsletter (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

async function setupAdmin() {
    db.get("SELECT id FROM users WHERE username = ?", ['admin'], async (err, row) => {
        if (!row) {
            const hash = await bcrypt.hash('Minosch20#20', 10);
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hash, 'admin'], (insertErr) => {
                if (!insertErr) {
                    console.log('Default admin user created.');
                }
            });
        }
    });
}

module.exports = db;
