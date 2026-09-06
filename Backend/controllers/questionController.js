const db = require('../config/db');


// =========================================
// GET ALL QUESTIONS FOR AN EXAM
// =========================================

async function getQuestions(req, res) {
    try {
        const { examId } = req.params;

        const [questions] = await db.query(
            `SELECT
                id,
                exam_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                marks,
                created_at
             FROM questions
             WHERE exam_id = ?
             ORDER BY id ASC`,
            [examId]
        );

        res.status(200).json({
            count: questions.length,
            questions
        });

    } catch (error) {
        console.error('Get questions error:', error);

        res.status(500).json({
            message: 'Server error while getting questions'
        });
    }
}


// =========================================
// GET ONE QUESTION
// =========================================

async function getQuestionById(req, res) {
    try {
        const { id } = req.params;

        const [questions] = await db.query(
            `SELECT
                id,
                exam_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                marks,
                created_at
             FROM questions
             WHERE id = ?`,
            [id]
        );

        if (questions.length === 0) {
            return res.status(404).json({
                message: 'Question not found'
            });
        }

        res.status(200).json({
            question: questions[0]
        });

    } catch (error) {
        console.error('Get question error:', error);

        res.status(500).json({
            message: 'Server error while getting question'
        });
    }
}


// =========================================
// CREATE QUESTION
// =========================================

async function createQuestion(req, res) {
    try {
        const { examId } = req.params;

        const {
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            is_correct,
            marks
        } = req.body;

        if (
            !question_text ||
            !option_a ||
            !option_b ||
            !option_c ||
            !option_d ||
            !is_correct
        ) {
            return res.status(400).json({
                message: 'Question, all options and correct answer are required'
            });
        }

        if (!['A', 'B', 'C', 'D'].includes(is_correct)) {
            return res.status(400).json({
                message: 'Correct answer must be A, B, C or D'
            });
        }

        const [exams] = await db.query(
            `SELECT id
             FROM exams
             WHERE id = ?`,
            [examId]
        );

        if (exams.length === 0) {
            return res.status(404).json({
                message: 'Exam not found'
            });
        }

        const [result] = await db.query(
            `INSERT INTO questions
            (
                exam_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                is_correct,
                marks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                examId,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                is_correct,
                marks || 1
            ]
        );

        res.status(201).json({
            message: 'Question created successfully',

            question: {
                id: result.insertId,
                exam_id: examId,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                is_correct,
                marks: marks || 1
            }
        });

    } catch (error) {
        console.error('Create question error:', error);

        res.status(500).json({
            message: 'Server error while creating question'
        });
    }
}


// =========================================
// UPDATE QUESTION
// =========================================

async function updateQuestion(req, res) {
    try {
        const { id } = req.params;

        const {
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            is_correct,
            marks
        } = req.body;

        if (
            !question_text ||
            !option_a ||
            !option_b ||
            !option_c ||
            !option_d ||
            !is_correct
        ) {
            return res.status(400).json({
                message: 'Question, all options and correct answer are required'
            });
        }

        if (!['A', 'B', 'C', 'D'].includes(is_correct)) {
            return res.status(400).json({
                message: 'Correct answer must be A, B, C or D'
            });
        }

        const [result] = await db.query(
            `UPDATE questions
             SET
                question_text = ?,
                option_a = ?,
                option_b = ?,
                option_c = ?,
                option_d = ?,
                is_correct = ?,
                marks = ?
             WHERE id = ?`,
            [
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                is_correct,
                marks || 1,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Question not found'
            });
        }

        res.status(200).json({
            message: 'Question updated successfully'
        });

    } catch (error) {
        console.error('Update question error:', error);

        res.status(500).json({
            message: 'Server error while updating question'
        });
    }
}


// =========================================
// DELETE QUESTION
// =========================================

async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM questions
             WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Question not found'
            });
        }

        res.status(200).json({
            message: 'Question deleted successfully'
        });

    } catch (error) {
        console.error('Delete question error:', error);

        res.status(500).json({
            message: 'Server error while deleting question'
        });
    }
}


module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
