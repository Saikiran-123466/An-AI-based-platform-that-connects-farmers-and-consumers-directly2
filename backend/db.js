const Database = require('better-sqlite3');
const path = require('path');

// ✅ FIX: absolute path (important for Render)
const dbPath = path.join(__dirname, 'agrilink.db');

// ✅ OPEN DATABASE
const db = new Database(dbPath);

console.log('✅ Connected to SQLite database');

try {
    // USERS TABLE
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('farmer', 'consumer')),
            location TEXT,
            rating REAL DEFAULT 0
        )
    `).run();

    // PRODUCTS TABLE
    db.prepare(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farmer_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL DEFAULT 'kg',
            image TEXT DEFAULT '',
            organic INTEGER DEFAULT 0,
            cultivated_date TEXT DEFAULT '',
            FOREIGN KEY(farmer_id) REFERENCES users(id)
        )
    `).run();

    // ORDERS TABLE
    db.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            consumer_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(consumer_id) REFERENCES users(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `).run();

    console.log('✅ Tables ready');

} catch (err) {
    console.error('❌ Database error:', err.message);
}

module.exports = db;
