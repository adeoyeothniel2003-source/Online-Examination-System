const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

app.use(express.json());


// =========================================
// HEALTH CHECK
// =========================================

app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.status(200).json({
            status: 'ok',
            message: 'Online Examination System backend is running',
            database: 'connected'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Backend is running but database connection failed'
        });
    }
});


// =========================================
// TEST ROUTE
// =========================================

app.get('/', (req, res) => {
    res.json({
        message: 'Online Examination System API'
    });
});


// =========================================
// ROUTES
// =========================================

app.use('/api/auth', authRoutes);

app.use('/api/students', studentRoutes);

// Exam routes will be added here
// Question routes will be added here
// Registration routes will be added here
// Result routes will be added here


// =========================================
// 404 HANDLER
// =========================================

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});


// =========================================
// ERROR HANDLER
// =========================================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: 'Internal server error'
    });
});


// =========================================
// START SERVER
// =========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
