const express = require('express');
const db = require('../db');

const router = express.Router();


// ✅ GET ALL PRODUCTS (Marketplace)
router.get('/', (req, res) => {
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

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// ✅ GET PRODUCTS BY FARMER
router.get('/farmer/:id', (req, res) => {
    const farmerId = req.params.id;

    db.all(`SELECT * FROM products WHERE farmer_id = ?`, [farmerId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// ✅ ADD PRODUCT (FIXED)
router.post('/', (req, res) => {
    const { farmer_id, name, category, price, quantity, unit, image, organic, cultivated_date } = req.body;

    // 🔥 VALIDATION
    if (!farmer_id || !name || !category || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO products 
        (farmer_id, name, category, price, quantity, unit, image, organic, cultivated_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            farmer_id,
            name,
            category,
            price,
            quantity || 0,
            unit || 'kg',
            image || '',
            organic ? 1 : 0,
            cultivated_date || ''
        ],
        function (err) {
            if (err) {
                console.error("DB ERROR:", err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            res.status(201).json({
                message: 'Product added successfully',
                productId: this.lastID
            });
        }
    );
});


// ✅ GET SINGLE PRODUCT
router.get('/:id', (req, res) => {
    const productId = req.params.id;

    const query = `
        SELECT p.*, u.name as farmer_name, u.location as farmer_location 
        FROM products p 
        JOIN users u ON p.farmer_id = u.id
        WHERE p.id = ?
    `;

    db.get(query, [productId], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(row);
    });
});


// ✅ UPDATE PRODUCT
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { name, category, price, quantity, unit, image, organic, cultivated_date } = req.body;

    const query = `
        UPDATE products 
        SET name=?, category=?, price=?, quantity=?, unit=?, image=?, organic=?, cultivated_date=? 
        WHERE id=?
    `;

    db.run(
        query,
        [
            name,
            category,
            price,
            quantity,
            unit,
            image,
            organic ? 1 : 0,
            cultivated_date || '',
            productId
        ],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error', details: err.message });
            }

            res.json({ message: 'Product updated successfully' });
        }
    );
});


module.exports = router;
