const express = require('express');

const {
    startExam,
    submitExam,
    getMyResults,
    getAllResults,
    getResultById
} = require('../controllers/resultController');

const {
    protect,
    restrictTo
} = require('../middleware/auth');

const router = express.Router();


// =========================================
// START EXAM
// =========================================
// Students must start the exam before submitting.
// This records the actual server-side start time.

router.post(
    '/exam/:examId/start',
    protect,
    restrictTo('student'),
    startExam
);


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
// STUDENT RESULTS
// =========================================
// Students are NOT allowed to access results.
// This route intentionally remains disabled.


// router.get(
//     '/my-results',
//     protect,
//     restrictTo('student'),
//     getMyResults
// );


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
    restrictTo('admin'),
    getResultById
);


module.exports = router;
