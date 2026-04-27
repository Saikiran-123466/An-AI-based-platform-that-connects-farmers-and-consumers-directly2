const express = require('express');
const db = require('../db');

const router = express.Router();


// ✅ GET ALL PRODUCTS
router.get('/', (req, res) => {
<<<<<<< HEAD
    try {
        const rows = db.prepare(`
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
        `).all();

=======
    db.all(`
        SELECT products.*, users.name AS farmer_name, users.location AS farmer_location
        FROM products
        JOIN users ON products.farmer_id = users.id
    `, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
>>>>>>> ce5ecb8 (fix cart db error)
        res.json(rows);
    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ GET PRODUCTS BY FARMER
router.get('/farmer/:id', (req, res) => {
<<<<<<< HEAD
    try {
        const rows = db
            .prepare(`SELECT * FROM products WHERE farmer_id = ?`)
            .all(req.params.id);

        res.json(rows);
    } catch (err) {
        console.error("FARMER ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ ADD PRODUCT (FINAL WORKING VERSION)
router.post('/', (req, res) => {
    try {
        const data = req.body;

        console.log("DATA RECEIVED:", data);

        const stmt = db.prepare(`
            INSERT INTO products 
            (farmer_id, name, category, price, quantity, unit, image, organic, cultivated_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            data.farmer_id,
            data.name,
            data.category,
            data.price,
            data.quantity || 0,
            "kg",
            "",
            0,
            ""
        );

        res.json({
            success: true,
            id: result.lastInsertRowid
        });

    } catch (err) {
        console.error("POST ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ GET SINGLE PRODUCT
router.get('/:id', (req, res) => {
    try {
        const row = db.prepare(`
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
            WHERE p.id = ?
        `).get(req.params.id);

        if (!row) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.json(row);
    } catch (err) {
        console.error("GET ONE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ UPDATE PRODUCT
router.put('/:id', (req, res) => {
    try {
        const data = req.body;

        db.prepare(`
            UPDATE products 
            SET name=?, category=?, price=?, quantity=? 
            WHERE id=?
        `).run(
            data.name,
            data.category,
            data.price,
            data.quantity,
            req.params.id
        );

        res.json({ success: true });
    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
=======
    const farmerId = req.params.id;

    db.all(`SELECT * FROM products WHERE farmer_id = ?`, [farmerId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// ✅ ADD PRODUCT (THIS FIXES YOUR ERROR)
router.post('/', (req, res) => {
    const { name, category, price, quantity, unit, organic, farmer_id } = req.body;

    // 🔥 VALIDATION
    if (!name || !price || !quantity || !farmer_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        INSERT INTO products (name, category, price, quantity, unit, organic, farmer_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql,
        [
            name,
            category || 'general',
            price,
            quantity,
            unit || 'kg',
            organic ? 1 : 0,
            farmer_id
        ],
        function (err) {
            if (err) {
                console.error("DB ERROR:", err.message);
                return res.status(500).json({ error: 'Database insert failed' });
            }

            res.json({
                message: 'Product added successfully',
                productId: this.lastID
            });
        }
    );
});

module.exports = router;
>>>>>>> ce5ecb8 (fix cart db error)
