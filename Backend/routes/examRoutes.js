const express = require('express');

const {
    getExams,
    getExamById,
    createExam,
    updateExam,
    updateExamStatus,
    deleteExam
} = require('../controllers/examController');

const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();


// =========================================
// GET ALL EXAMS
// =========================================

router.get(
    '/',
    protect,
    getExams
);


// =========================================
// GET ONE EXAM
// =========================================

router.get(
    '/:id',
    protect,
    getExamById
);


// =========================================
// CREATE EXAM
// =========================================

router.post(
    '/',
    protect,
    restrictTo('admin'),
    createExam
);


// =========================================
// UPDATE EXAM
// =========================================

router.put(
    '/:id',
    protect,
    restrictTo('admin'),
    updateExam
);


// =========================================
// PUBLISH / UNPUBLISH EXAM
// =========================================

router.patch(
    '/:id/status',
    protect,
    restrictTo('admin'),
    updateExamStatus
);


// =========================================
// DELETE EXAM
// =========================================

router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    deleteExam
);


module.exports = router;
