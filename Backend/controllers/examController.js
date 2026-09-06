const db = require('../config/db');


// =========================================
// GET ALL EXAMS
// =========================================

async function getExams(req, res) {
    try {
        const [exams] = await db.query(
            `SELECT
                id,
                title,
                description,
                duration_minutes,
                status,
                created_by,
                created_at
             FROM exams
             ORDER BY created_at DESC`
        );

        res.status(200).json({
            count: exams.length,
            exams
        });

    } catch (error) {
        console.error('Get exams error:', error);

        res.status(500).json({
            message: 'Server error while getting exams'
        });
    }
}


// =========================================
// GET ONE EXAM
// =========================================

async function getExamById(req, res) {
    try {
        const { id } = req.params;

        const [exams] = await db.query(
            `SELECT
                id,
                title,
                description,
                duration_minutes,
                status,
                created_by,
                created_at
             FROM exams
             WHERE id = ?`,
            [id]
        );

        if (exams.length === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            exam: exams[0]
        });

    } catch (error) {
        console.error('Get exam error:', error);

        res.status(500).json({
            message: 'Server error while getting exam'
        });
    }
}


// =========================================
// CREATE EXAM
// =========================================

async function createExam(req, res) {
    try {
        const {
            title,
            description,
            duration_minutes
        } = req.body;

        if (!title || !duration_minutes) {
            return res.status(400).json({
                message: 'Exam title and duration are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO exams
            (
                title,
                description,
                duration_minutes,
                status,
                created_by
            )
            VALUES (?, ?, ?, 'draft', ?)`,
            [
                title,
                description || '',
                duration_minutes,
                req.user.id
            ]
        );

        res.status(201).json({
            message: 'Exam created successfully',

            exam: {
                id: result.insertId,
                title,
                description: description || '',
                duration_minutes,
                status: 'draft',
                created_by: req.user.id
            }
        });

    } catch (error) {
        console.error('Create exam error:', error);

        res.status(500).json({
            message: 'Server error while creating exam'
        });
    }
}


// =========================================
// UPDATE EXAM
// =========================================

async function updateExam(req, res) {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            duration_minutes
        } = req.body;

        if (!title || !duration_minutes) {
            return res.status(400).json({
                message: 'Exam title and duration are required'
            });
        }

        const [result] = await db.query(
            `UPDATE exams
             SET
                title = ?,
                description = ?,
                duration_minutes = ?
             WHERE id = ?`,
            [
                title,
                description || '',
                duration_minutes,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            message: 'Exam updated successfully'
        });

    } catch (error) {
        console.error('Update exam error:', error);

        res.status(500).json({
            message: 'Server error while updating exam'
        });
    }
}


// =========================================
// PUBLISH / UNPUBLISH EXAM
// =========================================

async function updateExamStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be draft or published'
            });
        }

        const [result] = await db.query(
            `UPDATE exams
             SET status = ?
             WHERE id = ?`,
            [
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            message: `Exam ${status === 'published' ? 'published' : 'unpublished'} successfully`
        });

    } catch (error) {
        console.error('Update exam status error:', error);

        res.status(500).json({
            message: 'Server error while updating exam status'
        });
    }
}


// =========================================
// DELETE EXAM
// =========================================

async function deleteExam(req, res) {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM exams
             WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        res.status(200).json({
            message: 'Exam deleted successfully'
        });

    } catch (error) {
        console.error('Delete exam error:', error);

        res.status(500).json({
            message: 'Server error while deleting exam'
        });
    }
}


module.exports = {
    getExams,
    getExamById,
    createExam,
    updateExam,
    updateExamStatus,
    deleteExam
};
