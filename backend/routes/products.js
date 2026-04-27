const express = require('express');
const db = require('../db');

const router = express.Router();


// ✅ GET ALL PRODUCTS
router.get('/', (req, res) => {
    try {
        let query = `
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
        `;
        const params = [];

        if (req.query.category) {
            query += ` WHERE p.category = ?`;
            params.push(req.query.category);
        }

        if (req.query.organic) {
            query += params.length > 0 ? ` AND` : ` WHERE`;
            query += ` p.organic = ?`;
            params.push(req.query.organic === 'true' ? 1 : 0);
        }

        const rows = db.prepare(query).all(...params);
        res.json(rows);

    } catch (err) {
        console.error("GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ GET PRODUCTS BY FARMER
router.get('/farmer/:id', (req, res) => {
    try {
        const farmerId = req.params.id;

        const rows = db
            .prepare(`SELECT * FROM products WHERE farmer_id = ?`)
            .all(farmerId);

        res.json(rows);

    } catch (err) {
        console.error("FARMER GET ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ ADD PRODUCT (FIXED FOR better-sqlite3)
router.post('/', (req, res) => {
    try {
        console.log("POST BODY:", req.body);

        const {
            farmer_id,
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic,
            cultivated_date
        } = req.body;

        if (!farmer_id || !name || !category || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const stmt = db.prepare(`
            INSERT INTO products 
            (farmer_id, name, category, price, quantity, unit, image, organic, cultivated_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            farmer_id,
            name,
            category,
            price,
            quantity || 0,
            unit || 'kg',
            image || '',
            organic ? 1 : 0,
            cultivated_date || ''
        );

        res.status(201).json({
            message: 'Product added successfully',
            productId: result.lastInsertRowid
        });

    } catch (err) {
        console.error("POST ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// ✅ GET SINGLE PRODUCT
router.get('/:id', (req, res) => {
    try {
        const productId = req.params.id;

        const row = db.prepare(`
            SELECT p.*, u.name as farmer_name, u.location as farmer_location 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id
            WHERE p.id = ?
        `).get(productId);

        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
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
        const productId = req.params.id;

        const {
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic,
            cultivated_date
        } = req.body;

        db.prepare(`
            UPDATE products 
            SET name=?, category=?, price=?, quantity=?, unit=?, image=?, organic=?, cultivated_date=? 
            WHERE id=?
        `).run(
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic ? 1 : 0,
            cultivated_date || '',
            productId
        );

        res.json({ message: 'Product updated successfully' });

    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
