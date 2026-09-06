const express = require('express');

const {
    submitExam,
    getMyResults,
    getAllResults,
    getResultById
} = require('../controllers/resultController');

const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();


// =========================================
// SUBMIT EXAM
// =========================================

router.post(
    '/exam/:examId/submit',
    protect,
    restrictTo('student'),
    submitExam
);


// =========================================
// GET MY RESULTS
// =========================================

router.get(
    '/my-results',
    protect,
    restrictTo('student'),
    getMyResults
);


// =========================================
// GET ALL RESULTS
// =========================================

router.get(
    '/',
    protect,
    restrictTo('admin'),
    getAllResults
);


// =========================================
// GET ONE RESULT
// =========================================

router.get(
    '/:id',
    protect,
    getResultById
);


module.exports = router;
