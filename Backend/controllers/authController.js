const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// =========================================
// GENERATE JWT TOKEN
// =========================================

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
}


// =========================================
// LOGIN
// =========================================

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const [users] = await db.query(
            `SELECT *
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Your account is inactive'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                student_id: user.student_id,
                department: user.department,
                level: user.level
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Server error during login'
        });
    }
}


// =========================================
// REGISTER STUDENT
// =========================================

async function registerStudent(req, res) {
    try {
        const {
            name,
            email,
            password,
            student_id,
            department,
            level
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !student_id ||
            !department ||
            !level
        ) {
            return res.status(400).json({
                message: 'All student information is required'
            });
        }

        const [existingUsers] = await db.query(
            `SELECT id
             FROM users
             WHERE email = ?
             OR student_id = ?`,
            [email, student_id]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: 'A student with this email or student ID already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const [result] = await db.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                role,
                student_id,
                department,
                level,
                status
            )
            VALUES (?, ?, ?, 'student', ?, ?, ?, 'active')`,
            [
                name,
                email,
                hashedPassword,
                student_id,
                department,
                level
            ]
        );

        res.status(201).json({
            message: 'Student registered successfully',

            student: {
                id: result.insertId,
                name,
                email,
                student_id,
                department,
                level,
                status: 'active'
            }
        });

    } catch (error) {
        console.error('Student registration error:', error);

        res.status(500).json({
            message: 'Server error during student registration'
        });
    }
}


// =========================================
// GET CURRENT USER
// =========================================

async function getMe(req, res) {
    try {
        const [users] = await db.query(
            `SELECT
                id,
                name,
                email,
                role,
                student_id,
                department,
                level,
                status,
                created_at
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            user: users[0]
        });

    } catch (error) {
        console.error('Get user error:', error);

        res.status(500).json({
            message: 'Server error'
        });
    }
}


// =========================================
// LOGOUT
// =========================================

async function logout(req, res) {
    res.status(200).json({
        message: 'Logout successful'
    });
}


module.exports = {
    login,
    registerStudent,
    getMe,
    logout
};
