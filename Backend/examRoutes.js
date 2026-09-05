const express = require('express');
const router = express.Router();
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
} = require('../controllers/examController');
const { protect, restrictTo } = require('../middleware/auth');

// Questions nested under exams (e.g. POST/GET /api/exams/:examId/questions)
// are handled by questionRoutes.js and mounted separately in server.js.

router.get('/', protect, getExams);
router.get('/:id', protect, getExamById);
router.post('/', protect, restrictTo('admin'), createExam);
router.put('/:id', protect, restrictTo('admin'), updateExam);
router.delete('/:id', protect, restrictTo('admin'), deleteExam);
router.patch('/:id/status', protect, restrictTo('admin'), updateExamStatus);

module.exports = router;
