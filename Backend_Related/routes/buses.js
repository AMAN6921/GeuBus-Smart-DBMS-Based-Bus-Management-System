const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all buses
router.get('/', async (req, res) => {
    try {
        const [buses] = await db.query('SELECT * FROM buses ORDER BY number ASC');
        res.json(buses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bus by ID
router.get('/:id', async (req, res) => {
    try {
        const [buses] = await db.query('SELECT * FROM buses WHERE bus_id = ?', [req.params.id]);
        if (buses.length === 0) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json(buses[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new bus
router.post('/', async (req, res) => {
    try {
        const { number, registration_number } = req.body;
        const [result] = await db.query(
            'INSERT INTO buses (number, reg, status) VALUES (?, ?, ?)',
            [number, registration_number, 'active']
        );
        res.status(201).json({ 
            message: 'Bus added successfully', 
            bus_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update bus
router.put('/:id', async (req, res) => {
    try {
        const { number, registration_number, status } = req.body;
        
        // Build update query dynamically based on provided fields
        let updateFields = [];
        let values = [];
        
        if (number !== undefined) {
            updateFields.push('number = ?');
            values.push(number);
        }
        if (registration_number !== undefined) {
            updateFields.push('reg = ?');
            values.push(registration_number);
        }
        if (status !== undefined) {
            updateFields.push('status = ?');
            values.push(status);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(req.params.id);
        
        await db.query(
            `UPDATE buses SET ${updateFields.join(', ')} WHERE bus_id = ?`,
            values
        );
        res.json({ message: 'Bus updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete bus
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM buses WHERE bus_id = ?', [req.params.id]);
        res.json({ message: 'Bus deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
