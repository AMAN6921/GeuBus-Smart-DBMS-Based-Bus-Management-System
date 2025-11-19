const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all drivers
router.get('/', async (req, res) => {
    try {
        const [drivers] = await db.query('SELECT * FROM drivers ORDER BY name ASC');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
    try {
        const [drivers] = await db.query('SELECT * FROM drivers WHERE driver_id = ?', [req.params.id]);
        if (drivers.length === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(drivers[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new driver
router.post('/', async (req, res) => {
    try {
        const { name, contact_number } = req.body;
        const [result] = await db.query(
            'INSERT INTO drivers (name, contact, status) VALUES (?, ?, ?)',
            [name, contact_number, 'active']
        );
        res.status(201).json({ 
            message: 'Driver added successfully', 
            driver_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update driver
router.put('/:id', async (req, res) => {
    try {
        const { name, contact_number, status } = req.body;
        
        // Build update query dynamically based on provided fields
        let updateFields = [];
        let values = [];
        
        if (name !== undefined) {
            updateFields.push('name = ?');
            values.push(name);
        }
        if (contact_number !== undefined) {
            updateFields.push('contact = ?');
            values.push(contact_number);
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
            `UPDATE drivers SET ${updateFields.join(', ')} WHERE driver_id = ?`,
            values
        );
        res.json({ message: 'Driver updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete driver
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM drivers WHERE driver_id = ?', [req.params.id]);
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
