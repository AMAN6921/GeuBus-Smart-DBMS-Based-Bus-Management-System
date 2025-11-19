const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Student login
router.post('/student/login', async (req, res) => {
    try {
        const { student_id, password } = req.body;
        
        const [students] = await db.query(
            'SELECT * FROM students WHERE id = ?',
            [student_id]
        );
        
        if (students.length === 0) {
            return res.status(401).json({ error: 'Student ID not found' });
        }
        
        const student = students[0];
        
        if (student.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        if (student.status !== 'active') {
            return res.status(403).json({ error: 'Account is inactive. Please contact admin.' });
        }
        
        res.json({ 
            success: true, 
            student: {
                id: student.id,
                name: student.name,
                status: student.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Driver login
router.post('/driver/login', async (req, res) => {
    try {
        const { contact, password } = req.body;
        
        const [drivers] = await db.query(
            'SELECT * FROM drivers WHERE contact = ?',
            [contact]
        );
        
        if (drivers.length === 0) {
            return res.status(401).json({ error: 'Driver not found' });
        }
        
        const driver = drivers[0];
        
        if (driver.password !== password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        if (driver.status !== 'active') {
            return res.status(403).json({ error: 'Account is inactive. Please contact admin.' });
        }
        
        res.json({ 
            success: true, 
            driver: {
                driver_id: driver.driver_id,
                name: driver.name,
                contact: driver.contact,
                status: driver.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin login
router.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Simple admin authentication (you can enhance this with a database table)
        if (username === 'admin' && password === 'admin123') {
            res.json({ 
                success: true,
                admin: {
                    username: 'admin',
                    role: 'administrator'
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
