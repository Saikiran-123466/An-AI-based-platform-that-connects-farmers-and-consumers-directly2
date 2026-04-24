const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key_change_in_production';


// ✅ REGISTER (FIXED)
router.post('/register', async (req, res) => {
    const { name, email, password, role, location } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare(`
            INSERT INTO users (name, email, password, role, location)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(name, email, hashedPassword, role, location);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.lastInsertRowid
        });

    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


// ✅ LOGIN (FIXED)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
        const user = stmt.get(email);

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                location: user.location
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;