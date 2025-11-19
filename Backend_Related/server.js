const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const busRoutes = require('./routes/buses');
const driverRoutes = require('./routes/drivers');
const studentRoutes = require('./routes/students');
const routeRoutes = require('./routes/routes');
const assignmentRoutes = require('./routes/assignments');
const updateRoutes = require('./routes/updates');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});
