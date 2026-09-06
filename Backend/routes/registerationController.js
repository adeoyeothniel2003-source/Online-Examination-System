const express = require('express');

const {
    registerForExam,
    getRegistrations,
    getStudentRegistrations,
    removeRegistration
} = require('../controllers/registrationController');

const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();


// =========================================
// REGISTER STUDENT FOR EXAM
// =========================================

router.post(
    '/',
    protect,
    restrictTo('admin'),
    registerForExam
);


// =========================================
// GET ALL REGISTRATIONS
// =========================================

router.get(
    '/',
    protect,
    restrictTo('admin'),
    getRegistrations
);


// =========================================
// GET CURRENT STUDENT'S EXAMS
// =========================================

router.get(
    '/my-exams',
    protect,
    restrictTo('student'),
    getStudentRegistrations
);


// =========================================
// REMOVE STUDENT FROM EXAM
// =========================================

router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    removeRegistration
);


module.exports = router;
