const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all updates
router.get('/', async (req, res) => {
    try {
        const { target } = req.query;
        let query = 'SELECT * FROM updates ORDER BY created_at DESC';
        let params = [];
        
        if (target) {
            query = 'SELECT * FROM updates WHERE target IN (?, "all") ORDER BY created_at DESC';
            params = [target];
        }
        
        const [updates] = await db.query(query, params);
        res.json(updates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new update
router.post('/', async (req, res) => {
    try {
        const { title, message, target } = req.body;
        const [result] = await db.query(
            'INSERT INTO updates (title, message, target) VALUES (?, ?, ?)',
            [title, message, target]
        );
        res.status(201).json({ 
            message: 'Update created successfully',
            update_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an update
router.put('/:id', async (req, res) => {
    try {
        const { title, message, target } = req.body;
        await db.query(
            'UPDATE updates SET title = ?, message = ?, target = ? WHERE update_id = ?',
            [title, message, target, req.params.id]
        );
        res.json({ message: 'Update modified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete update
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM updates WHERE update_id = ?', [req.params.id]);
        res.json({ message: 'Update deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
