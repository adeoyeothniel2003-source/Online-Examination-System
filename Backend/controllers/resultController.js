
const db = require('../config/db');


// =========================================
// START EXAM
// =========================================

async function startExam(req, res) {

    const connection =
        await db.getConnection();

    try {

        const studentId =
            req.user.id;

        const { examId } =
            req.params;


        // =========================================
        // CHECK STUDENT REGISTRATION
        // =========================================

        const [registrations] =
            await connection.query(
                `SELECT
                    id,
                    status
                 FROM exam_registrations
                 WHERE student_id = ?
                 AND exam_id = ?`,
                [
                    studentId,
                    examId
                ]
            );


        if (
            registrations.length === 0
        ) {

            return res.status(403).json({
                message:
                    'You are not registered for this exam'
            });
        }


        // =========================================
        // CHECK REGISTRATION STATUS
        // =========================================

        if (
            registrations[0].status ===
            'completed'
        ) {

            return res.status(409).json({
                message:
                    'You have already completed this exam'
            });
        }


        // =========================================
        // CHECK EXAM
        // =========================================

        const [exams] =
            await connection.query(
                `SELECT
                    id,
                    title,
                    duration_minutes,
                    status
                 FROM exams
                 WHERE id = ?`,
                [examId]
            );


        if (
            exams.length === 0
        ) {

            return res.status(404).json({
                message:
                    'Exam not found'
            });
        }


        const exam =
            exams[0];


        // =========================================
        // CHECK EXAM STATUS
        // =========================================

        if (
            exam.status !==
            'published'
        ) {

            return res.status(403).json({
                message:
                    'This exam is not currently available'
            });
        }


        // =========================================
        // CHECK FOR EXISTING ATTEMPT
        // =========================================

        const [existingAttempts] =
            await connection.query(
                `SELECT
                    id,
                    submitted_at
                 FROM exam_attempts
                 WHERE student_id = ?
                 AND exam_id = ?`,
                [
                    studentId,
                    examId
                ]
            );


        if (
            existingAttempts.length > 0
        ) {

            return res.status(409).json({
                message:
                    'You have already started or submitted this exam'
            });
        }


        // =========================================
        // CREATE EXAM ATTEMPT
        // =========================================

        const [attemptResult] =
            await connection.query(
                `INSERT INTO exam_attempts
                (
                    student_id,
                    exam_id,
                    score,
                    total_marks,
                    percentage,
                    status,
                    started_at,
                    submitted_at
                )
                VALUES (?, ?, 0, 0, 0, 'fail', NOW(), NULL)`,
                [
                    studentId,
                    examId
                ]
            );


        res.status(201).json({

            message:
                'Exam started successfully',

            attempt: {

                attempt_id:
                    attemptResult.insertId,

                exam_id:
                    Number(examId),

                started_at:
                    new Date(),

                duration_minutes:
                    exam.duration_minutes

            }

        });


    } catch (error) {

        console.error(
            'Start exam error:',
            error
        );


        res.status(500).json({
            message:
                'Server error while starting exam'
        });


    } finally {

        connection.release();

    }
}


// =========================================
// SUBMIT EXAM AND CALCULATE RESULT
// =========================================

async function submitExam(req, res) {

    const connection =
        await db.getConnection();


    try {

        const studentId =
            req.user.id;

        const { examId } =
            req.params;

        const { answers } =
            req.body;


        if (
            !Array.isArray(answers)
        ) {

            return res.status(400).json({
                message:
                    'Answers must be provided as an array'
            });
        }


        // =========================================
        // CHECK STUDENT REGISTRATION
        // =========================================

        const [registrations] =
            await connection.query(
                `SELECT
                    id,
                    status
                 FROM exam_registrations
                 WHERE student_id = ?
                 AND exam_id = ?`,
                [
                    studentId,
                    examId
                ]
            );


        if (
            registrations.length === 0
        ) {

            return res.status(403).json({
                message:
                    'You are not registered for this exam'
            });
        }


        // =========================================
        // CHECK EXISTING EXAM ATTEMPT
        // =========================================

        const [attempts] =
            await connection.query(
                `SELECT
                    id,
                    started_at,
                    submitted_at
                 FROM exam_attempts
                 WHERE student_id = ?
                 AND exam_id = ?`,
                [
                    studentId,
                    examId
                ]
            );


        if (
            attempts.length === 0
        ) {

            return res.status(400).json({
                message:
                    'Exam has not been started'
            });
        }


        const attempt =
            attempts[0];


        // =========================================
        // CHECK IF ALREADY SUBMITTED
        // =========================================

        if (
            attempt.submitted_at !== null
        ) {

            return res.status(409).json({
                message:
                    'You have already submitted this exam'
            });
        }


        // =========================================
        // GET EXAM QUESTIONS
        // =========================================

        const [questions] =
            await connection.query(
                `SELECT
                    id,
                    is_correct,
                    marks
                 FROM questions
                 WHERE exam_id = ?
                 ORDER BY id ASC`,
                [examId]
            );


        if (
            questions.length === 0
        ) {

            return res.status(400).json({
                message:
                    'This exam has no questions'
            });
        }


        await connection.beginTransaction();


        // =========================================
        // PREPARE ANSWERS
        // =========================================

        let score = 0;

        let totalMarks = 0;

        const answerMap = {};


        answers.forEach(
            function(answer) {

                answerMap[
                    answer.question_id
                ] =
                    answer.selected_answer;

            }
        );


        // =========================================
        // CALCULATE SCORE
        // =========================================

        for (
            const question of questions
        ) {

            totalMarks +=
                question.marks;


            const selectedAnswer =
                answerMap[
                    question.id
                ] || null;


            if (
                selectedAnswer ===
                question.is_correct
            ) {

                score +=
                    question.marks;
            }

        }


        // =========================================
        // CALCULATE PERCENTAGE
        // =========================================

        const percentage =
            totalMarks > 0
            ? (score / totalMarks) * 100
            : 0;


        // =========================================
        // DETERMINE PASS / FAIL
        // =========================================

        const status =
            percentage >= 50
            ? 'pass'
            : 'fail';


        // =========================================
        // UPDATE EXAM ATTEMPT
        // =========================================

        await connection.query(
            `UPDATE exam_attempts
             SET
                score = ?,
                total_marks = ?,
                percentage = ?,
                status = ?,
                submitted_at = NOW()
             WHERE id = ?
             AND student_id = ?
             AND exam_id = ?`,
            [
                score,
                totalMarks,
                percentage,
                status,
                attempt.id,
                studentId,
                examId
            ]
        );


        // =========================================
        // SAVE INDIVIDUAL ANSWERS
        // =========================================

        for (
            const question of questions
        ) {

            const selectedAnswer =
                answerMap[
                    question.id
                ] || null;


            const isCorrect =
                selectedAnswer ===
                question.is_correct;


            const marksAwarded =
                isCorrect
                ? question.marks
                : 0;


            await connection.query(
                `INSERT INTO result_answers
                (
                    attempt_id,
                    question_id,
                    selected_answer,
                    correct_answer,
                    is_correct,
                    marks_awarded
                )
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    attempt.id,
                    question.id,
                    selectedAnswer,
                    question.is_correct,
                    isCorrect,
                    marksAwarded
                ]
            );

        }


        // =========================================
        // MARK REGISTRATION AS COMPLETED
        // =========================================

        await connection.query(
            `UPDATE exam_registrations
             SET status = 'completed'
             WHERE student_id = ?
             AND exam_id = ?`,
            [
                studentId,
                examId
            ]
        );


        await connection.commit();


        // =========================================
        // SEND SUBMISSION RESPONSE
        // =========================================

        res.status(200).json({

            message:
                'Exam submitted successfully',

            result: {

                attempt_id:
                    attempt.id,

                exam_id:
                    Number(examId),

                score,

                total_marks:
                    totalMarks,

                percentage:
                    Number(
                        percentage.toFixed(2)
                    ),

                status

            }

        });


    } catch (error) {

        await connection.rollback();


        console.error(
            'Submit exam error:',
            error
        );


        res.status(500).json({
            message:
                'Server error while submitting exam'
        });


    } finally {

        connection.release();

    }
}


// =========================================
// GET STUDENT RESULTS
// =========================================
// Kept for now but not exposed through the
// student routes.

async function getMyResults(req, res) {

    try {

        const studentId =
            req.user.id;


        const [results] =
            await db.query(
                `SELECT
                    ea.id AS attempt_id,
                    e.id AS exam_id,
                    e.title,
                    ea.score,
                    ea.total_marks,
                    ea.percentage,
                    ea.status,
                    ea.submitted_at

                 FROM exam_attempts ea

                 INNER JOIN exams e
                    ON ea.exam_id = e.id

                 WHERE ea.student_id = ?

                 ORDER BY ea.submitted_at DESC`,
                [studentId]
            );


        res.status(200).json({

            count:
                results.length,

            results

        });


    } catch (error) {

        console.error(
            'Get student results error:',
            error
        );


        res.status(500).json({
            message:
                'Server error while getting results'
        });

    }
}


// =========================================
// GET ALL RESULTS
// =========================================

async function getAllResults(req, res) {

    try {

        const [results] =
            await db.query(
                `SELECT
                    ea.id AS attempt_id,

                    u.name AS student_name,

                    u.student_id,

                    e.title AS exam_title,

                    ea.score,

                    ea.total_marks,

                    ea.percentage,

                    ea.status,

                    ea.submitted_at

                 FROM exam_attempts ea

                 INNER JOIN users u
                    ON ea.student_id = u.id

                 INNER JOIN exams e
                    ON ea.exam_id = e.id

                 ORDER BY ea.submitted_at DESC`
            );


        res.status(200).json({

            count:
                results.length,

            results

        });


    } catch (error) {

        console.error(
            'Get all results error:',
            error
        );


        res.status(500).json({
            message:
                'Server error while getting results'
        });

    }
}


// =========================================
// GET ONE RESULT
// =========================================

async function getResultById(req, res) {

    try {

        const { id } =
            req.params;


        const [results] =
            await db.query(
                `SELECT
                    ea.id AS attempt_id,

                    u.name AS student_name,

                    u.student_id,

                    e.title AS exam_title,

                    ea.score,

                    ea.total_marks,

                    ea.percentage,

                    ea.status,

                    ea.started_at,

                    ea.submitted_at

                 FROM exam_attempts ea

                 INNER JOIN users u
                    ON ea.student_id = u.id

                 INNER JOIN exams e
                    ON ea.exam_id = e.id

                 WHERE ea.id = ?`,
                [id]
            );


        if (
            results.length === 0
        ) {

            return res.status(404).json({
                message:
                    'Result not found'
            });
        }


        const [answers] =
            await db.query(
                `SELECT
                    ra.question_id,
                    ra.selected_answer,
                    ra.correct_answer,
                    ra.is_correct,
                    ra.marks_awarded

                 FROM result_answers ra

                 WHERE ra.attempt_id = ?

                 ORDER BY ra.id ASC`,
                [id]
            );


        res.status(200).json({

            result:
                results[0],

            answers

        });


    } catch (error) {

        console.error(
            'Get result error:',
            error
        );


        res.status(500).json({
            message:
                'Server error while getting result'
        });

    }
}


// =========================================
// EXPORT CONTROLLERS
// =========================================

module.exports = {

    startExam,

    submitExam,

    getMyResults,

    getAllResults,

    getResultById

};

