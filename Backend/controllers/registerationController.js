const db = require('../config/db');


// =========================================
// REGISTER STUDENT FOR EXAM
// =========================================

async function registerForExam(req, res) {
    try {
        const { student_id, exam_id } = req.body;

        if (!student_id || !exam_id) {
            return res.status(400).json({
                message: 'Student ID and exam ID are required'
            });
        }

        // Check that the student exists and is active
        const [students] = await db.query(
            `SELECT id, name, student_id
             FROM users
             WHERE id = ?
             AND role = 'student'
             AND status = 'active'`,
            [student_id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: 'Active student not found'
            });
        }

        // Check that the exam exists and is published
        const [exams] = await db.query(
            `SELECT id, title
             FROM exams
             WHERE id = ?
             AND status = 'published'`,
            [exam_id]
        );

        if (exams.length === 0) {
            return res.status(404).json({
                message: 'Published exam not found'
            });
        }

        // Check for an existing registration
        const [existingRegistration] = await db.query(
            `SELECT id
             FROM exam_registrations
             WHERE student_id = ?
             AND exam_id = ?`,
            [student_id, exam_id]
        );

        if (existingRegistration.length > 0) {
            return res.status(409).json({
                message: 'Student is already registered for this exam'
            });
        }

        // Create registration
        const [result] = await db.query(
            `INSERT INTO exam_registrations
            (
                student_id,
                exam_id,
                status
            )
            VALUES (?, ?, 'registered')`,
            [student_id, exam_id]
        );

        res.status(201).json({
            message: 'Student registered for exam successfully',

            registration: {
                id: result.insertId,
                student_id,
                exam_id,
                status: 'registered'
            }
        });

    } catch (error) {
        console.error('Exam registration error:', error);

        res.status(500).json({
            message: 'Server error while registering student for exam'
        });
    }
}


// =========================================
// GET ALL EXAM REGISTRATIONS
// =========================================

async function getRegistrations(req, res) {
    try {
        const [registrations] = await db.query(
            `SELECT
                er.id,
                er.status,
                er.registered_at,

                u.id AS student_id,
                u.name AS student_name,
                u.student_id AS student_number,

                e.id AS exam_id,
                e.title AS exam_title

             FROM exam_registrations er

             INNER JOIN users u
                ON er.student_id = u.id

             INNER JOIN exams e
                ON er.exam_id = e.id

             ORDER BY er.registered_at DESC`
        );

        res.status(200).json({
            count: registrations.length,
            registrations
        });

    } catch (error) {
        console.error('Get registrations error:', error);

        res.status(500).json({
            message: 'Server error while getting registrations'
        });
    }
}


// =========================================
// GET STUDENT'S REGISTERED EXAMS
// =========================================

async function getStudentRegistrations(req, res) {
    try {
        const studentId = req.user.id;

        const [registrations] = await db.query(
            `SELECT
                er.id AS registration_id,
                er.status AS registration_status,
                er.registered_at,

                e.id AS exam_id,
                e.title,
                e.description,
                e.duration_minutes,
                e.status AS exam_status

             FROM exam_registrations er

             INNER JOIN exams e
                ON er.exam_id = e.id

             WHERE er.student_id = ?

             ORDER BY er.registered_at DESC`,
            [studentId]
        );

        res.status(200).json({
            count: registrations.length,
            registrations
        });

    } catch (error) {
        console.error('Get student registrations error:', error);

        res.status(500).json({
            message: 'Server error while getting student exams'
        });
    }
}


// =========================================
// REMOVE STUDENT FROM EXAM
// =========================================

async function removeRegistration(req, res) {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM exam_registrations
             WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Exam registration not found'
            });
        }

        res.status(200).json({
            message: 'Student removed from exam successfully'
        });

    } catch (error) {
        console.error('Remove registration error:', error);

        res.status(500).json({
            message: 'Server error while removing registration'
        });
    }
}


module.exports = {
    registerForExam,
    getRegistrations,
    getStudentRegistrations,
    removeRegistration
};
