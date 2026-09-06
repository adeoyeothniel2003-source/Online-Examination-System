const db = require('../config/db');


// =========================================
// GET ALL STUDENTS
// =========================================

async function getStudents(req, res) {
    try {
        const search = req.query.search || '';

        const searchValue = `%${search}%`;

        const [students] = await db.query(
            `SELECT
                id,
                name,
                email,
                student_id,
                department,
                level,
                status,
                created_at
             FROM users
             WHERE role = 'student'
             AND (
                 name LIKE ?
                 OR email LIKE ?
                 OR student_id LIKE ?
                 OR department LIKE ?
             )
             ORDER BY created_at DESC`,
            [
                searchValue,
                searchValue,
                searchValue,
                searchValue
            ]
        );

        res.status(200).json({
            count: students.length,
            students
        });

    } catch (error) {
        console.error('Get students error:', error);

        res.status(500).json({
            message: 'Server error while getting students'
        });
    }
}


// =========================================
// GET ONE STUDENT
// =========================================

async function getStudentById(req, res) {
    try {
        const { id } = req.params;

        const [students] = await db.query(
            `SELECT
                id,
                name,
                email,
                student_id,
                department,
                level,
                status,
                created_at
             FROM users
             WHERE id = ?
             AND role = 'student'`,
            [id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json({
            student: students[0]
        });

    } catch (error) {
        console.error('Get student error:', error);

        res.status(500).json({
            message: 'Server error while getting student'
        });
    }
}


// =========================================
// UPDATE STUDENT
// =========================================

async function updateStudent(req, res) {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            student_id,
            department,
            level
        } = req.body;

        if (
            !name ||
            !email ||
            !student_id ||
            !department ||
            !level
        ) {
            return res.status(400).json({
                message: 'All student information is required'
            });
        }

        const [students] = await db.query(
            `SELECT id
             FROM users
             WHERE id = ?
             AND role = 'student'`,
            [id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const [duplicate] = await db.query(
            `SELECT id
             FROM users
             WHERE (email = ? OR student_id = ?)
             AND id != ?`,
            [
                email,
                student_id,
                id
            ]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                message: 'Email or student ID is already in use'
            });
        }

        await db.query(
            `UPDATE users
             SET
                name = ?,
                email = ?,
                student_id = ?,
                department = ?,
                level = ?
             WHERE id = ?
             AND role = 'student'`,
            [
                name,
                email,
                student_id,
                department,
                level,
                id
            ]
        );

        res.status(200).json({
            message: 'Student updated successfully'
        });

    } catch (error) {
        console.error('Update student error:', error);

        res.status(500).json({
            message: 'Server error while updating student'
        });
    }
}


// =========================================
// ACTIVATE / DEACTIVATE STUDENT
// =========================================

async function updateStudentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be active or inactive'
            });
        }

        const [result] = await db.query(
            `UPDATE users
             SET status = ?
             WHERE id = ?
             AND role = 'student'`,
            [
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json({
            message: `Student ${status === 'active' ? 'activated' : 'deactivated'} successfully`
        });

    } catch (error) {
        console.error('Update student status error:', error);

        res.status(500).json({
            message: 'Server error while updating student status'
        });
    }
}


// =========================================
// DELETE STUDENT
// =========================================

async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM users
             WHERE id = ?
             AND role = 'student'`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json({
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);

        res.status(500).json({
            message: 'Server error while deleting student'
        });
    }
}


module.exports = {
    getStudents,
    getStudentById,
    updateStudent,
    updateStudentStatus,
    deleteStudent
};
