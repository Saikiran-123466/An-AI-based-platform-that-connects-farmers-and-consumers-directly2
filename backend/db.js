const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'agrilink.db');
const db = new Database(dbPath);

console.log('Connected to the SQLite database.');

try {
    // Users Table
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('farmer', 'consumer')),
        location TEXT,
        rating REAL DEFAULT 0
    )`).run();

    // Products Table
    db.prepare(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmer_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT NOT NULL,
        image TEXT,
        organic BOOLEAN DEFAULT 0,
        cultivated_date TEXT,
        FOREIGN KEY(farmer_id) REFERENCES users(id)
    )`).run();

    // Orders Table
    db.prepare(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consumer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(consumer_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    )`).run();

    console.log('Database tables created or already exist.');

} catch (err) {
    console.error('Database error:', err.message);
}
module.exports = db;