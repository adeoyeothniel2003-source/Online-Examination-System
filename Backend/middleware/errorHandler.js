const { validationResult } = require('express-validator');


// =========================================
// 404 - ROUTE NOT FOUND
// =========================================

function notFound(req, res) {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
}


// =========================================
// VALIDATION ERROR HANDLER
// =========================================

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    next();
}


// =========================================
// GENERAL ERROR HANDLER
// =========================================

function errorHandler(err, req, res, next) {
    console.error('Server error:', err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || 'Internal server error'
    });
}


module.exports = {
    notFound,
    handleValidationErrors,
    errorHandler
};
