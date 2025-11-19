const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all routes
router.get('/', async (req, res) => {
    try {
        const [routes] = await db.query('SELECT * FROM routes ORDER BY route_id ASC');
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get route by ID
router.get('/:id', async (req, res) => {
    try {
        const [routes] = await db.query('SELECT * FROM routes WHERE route_id = ?', [req.params.id]);
        if (routes.length === 0) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.json(routes[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new route
router.post('/', async (req, res) => {
    try {
        const { route_name, route_description, starting_point, ending_point } = req.body;
        const [result] = await db.query(
            'INSERT INTO routes (route_name, route_description, starting_point, ending_point) VALUES (?, ?, ?, ?)',
            [route_name, route_description, starting_point, ending_point]
        );
        res.status(201).json({ 
            message: 'Route added successfully', 
            route_id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update route
router.put('/:id', async (req, res) => {
    try {
        const { route_name, route_description, starting_point, ending_point } = req.body;
        
        // Build update query dynamically based on provided fields
        let updateFields = [];
        let values = [];
        
        if (route_name !== undefined) {
            updateFields.push('route_name = ?');
            values.push(route_name);
        }
        if (route_description !== undefined) {
            updateFields.push('route_description = ?');
            values.push(route_description);
        }
        if (starting_point !== undefined) {
            updateFields.push('starting_point = ?');
            values.push(starting_point);
        }
        if (ending_point !== undefined) {
            updateFields.push('ending_point = ?');
            values.push(ending_point);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(req.params.id);
        
        await db.query(
            `UPDATE routes SET ${updateFields.join(', ')} WHERE route_id = ?`,
            values
        );
        res.json({ message: 'Route updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete route
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM routes WHERE route_id = ?', [req.params.id]);
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
