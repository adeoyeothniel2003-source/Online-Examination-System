const jwt = require('jsonwebtoken');
const db = require('../config/db');


// =========================================
// PROTECT ROUTES
// =========================================

async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [users] = await db.query(
            `SELECT id, name, email, role, student_id,
                    department, level, status
             FROM users
             WHERE id = ?`,
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        const user = users[0];

        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Your account is inactive'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error('Authentication error:', error.message);

        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}


// =========================================
// RESTRICT ACCESS BY ROLE
// =========================================

function restrictTo(...roles) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
}


module.exports = {
    protect,
    restrictTo
};
