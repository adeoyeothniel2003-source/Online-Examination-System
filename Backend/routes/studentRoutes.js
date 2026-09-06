const express = require('express');

const {
    getStudents,
    getStudentById,
    updateStudent,
    updateStudentStatus,
    deleteStudent
} = require('../controllers/studentController');

const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();


// =========================================
// GET ALL STUDENTS
// =========================================

router.get(
    '/',
    protect,
    restrictTo('admin'),
    getStudents
);


// =========================================
// GET ONE STUDENT
// =========================================

router.get(
    '/:id',
    protect,
    restrictTo('admin'),
    getStudentById
);


// =========================================
// UPDATE STUDENT
// =========================================

router.put(
    '/:id',
    protect,
    restrictTo('admin'),
    updateStudent
);


// =========================================
// ACTIVATE / DEACTIVATE STUDENT
// =========================================

router.patch(
    '/:id/status',
    protect,
    restrictTo('admin'),
    updateStudentStatus
);


// =========================================
// DELETE STUDENT
// =========================================

router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    deleteStudent
);


module.exports = router;
