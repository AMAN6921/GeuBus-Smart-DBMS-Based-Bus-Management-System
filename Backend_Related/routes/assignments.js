const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all active assignments
router.get('/', async (req, res) => {
    try {
        const [assignments] = await db.query(`
            SELECT a.*, d.name as driver_name, d.contact as driver_contact, 
                   b.number as bus_number, b.reg as bus_registration
            FROM assignments a
            JOIN drivers d ON a.driver_id = d.driver_id
            JOIN buses b ON a.bus_id = b.bus_id
            WHERE a.status IN ('assigned', 'departing', 'departed')
            ORDER BY a.created_at DESC
        `);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new assignment
router.post('/', async (req, res) => {
    try {
        const { driver_id, bus_id, route_name, route_description } = req.body;
        
        // Check if this driver-bus-route combination already has an active assignment
        const [existing] = await db.query(
            'SELECT * FROM assignments WHERE driver_id = ? AND bus_id = ? AND route_name = ? AND status IN ("assigned", "departing")',
            [driver_id, bus_id, route_name]
        );
        
        if (existing.length > 0) {
            return res.status(200).json({ 
                message: 'Assignment already exists',
                assignment_id: existing[0].assignment_id
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO assignments (driver_id, bus_id, route_name, route_description, status) VALUES (?, ?, ?, ?, ?)',
            [driver_id, bus_id, route_name, route_description, 'assigned']
        );
        res.status(201).json({ 
            message: 'Assignment created successfully',
            assignment_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update assignment status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, departure_time } = req.body;
        
        // Convert ISO string to MySQL datetime format (keep local time, not UTC)
        let mysqlDateTime = null;
        if (departure_time) {
            const date = new Date(departure_time);
            // Format as YYYY-MM-DD HH:MM:SS in local timezone
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            mysqlDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        
        await db.query(
            'UPDATE assignments SET status = ?, departure_time = ? WHERE assignment_id = ?',
            [status, mysqlDateTime, req.params.id]
        );
        res.json({ message: 'Assignment status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update bus location
router.post('/location', async (req, res) => {
    try {
        const { bus_id, latitude, longitude } = req.body;
        await db.query(
            'INSERT INTO bus_locations (bus_id, latitude, longitude) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, updated_at = NOW()',
            [bus_id, latitude, longitude, latitude, longitude]
        );
        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bus location
router.get('/location/:bus_id', async (req, res) => {
    try {
        const [locations] = await db.query(
            'SELECT * FROM bus_locations WHERE bus_id = ? ORDER BY updated_at DESC LIMIT 1',
            [req.params.bus_id]
        );
        if (locations.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }
        res.json(locations[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record student boarding
router.post('/board', async (req, res) => {
    try {
        const { student_id, assignment_id } = req.body;
        
        // Check if student has already boarded any bus today
        const [existingBoarding] = await db.query(
            'SELECT * FROM boarded_students WHERE student_id = ? AND DATE(boarded_at) = CURDATE()',
            [student_id]
        );
        
        if (existingBoarding.length > 0) {
            return res.status(400).json({ 
                error: 'Already boarded',
                message: 'You have already boarded a bus today. Cannot board multiple buses.' 
            });
        }
        
        // Check if student has already boarded this specific assignment
        const [duplicateCheck] = await db.query(
            'SELECT * FROM boarded_students WHERE student_id = ? AND assignment_id = ?',
            [student_id, assignment_id]
        );
        
        if (duplicateCheck.length > 0) {
            return res.status(400).json({ 
                error: 'Already boarded',
                message: 'You have already boarded this bus.' 
            });
        }
        
        // Record the boarding
        await db.query(
            'INSERT INTO boarded_students (student_id, assignment_id) VALUES (?, ?)',
            [student_id, assignment_id]
        );
        
        // Remove student from waiting requests (mark as fulfilled)
        await db.query(
            'UPDATE student_requests SET status = "fulfilled" WHERE student_id = ? AND status = "waiting"',
            [student_id]
        );
        
        res.json({ message: 'Boarding recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if student has boarded today
router.get('/boarded/check/:student_id', async (req, res) => {
    try {
        const [boarded] = await db.query(
            'SELECT * FROM boarded_students WHERE student_id = ? AND DATE(boarded_at) = CURDATE()',
            [req.params.student_id]
        );
        res.json({ 
            hasBoarded: boarded.length > 0,
            boarding: boarded.length > 0 ? boarded[0] : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get boarded students
router.get('/boarded', async (req, res) => {
    try {
        const [boarded] = await db.query(`
            SELECT bs.*, a.bus_id, b.number as bus_number, a.route_name
            FROM boarded_students bs
            JOIN assignments a ON bs.assignment_id = a.assignment_id
            JOIN buses b ON a.bus_id = b.bus_id
            ORDER BY bs.boarded_at DESC
        `);
        res.json(boarded);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End assignment
router.delete('/:id', async (req, res) => {
    try {
        // Start transaction to ensure both operations complete together
        await db.query('START TRANSACTION');
        
        // Delete all boarded students for this assignment
        await db.query('DELETE FROM boarded_students WHERE assignment_id = ?', [req.params.id]);
        
        // Update assignment status to completed
        await db.query('UPDATE assignments SET status = ? WHERE assignment_id = ?', ['completed', req.params.id]);
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ 
            message: 'Assignment ended successfully',
            note: 'Boarded students records have been cleared'
        });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
