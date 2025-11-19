const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Clear all live monitoring data
router.delete('/clear-live-data', async (req, res) => {
    try {
        // Start a transaction to ensure all deletions happen together
        await db.query('START TRANSACTION');
        
        // Clear all assignments (set status to completed instead of deleting for history)
        await db.query('UPDATE assignments SET status = "completed" WHERE status IN ("assigned", "departing", "departed")');
        
        // Clear all student requests
        await db.query('DELETE FROM student_requests');
        
        // Clear all boarded students records
        await db.query('DELETE FROM boarded_students');
        
        // Clear all bus locations
        await db.query('DELETE FROM bus_locations');
        
        // Commit the transaction
        await db.query('COMMIT');
        
        res.json({ 
            message: 'All live monitoring data cleared successfully',
            cleared: {
                assignments: 'completed',
                student_requests: 'deleted',
                boarded_students: 'deleted',
                bus_locations: 'deleted'
            }
        });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
