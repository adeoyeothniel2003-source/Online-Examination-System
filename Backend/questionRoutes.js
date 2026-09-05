const express = require('express');
const {
  addQuestion,
  getQuestionsByExam,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, restrictTo } = require('../middleware/auth');

// Mounted at /api/exams/:examId/questions in server.js
// mergeParams: true lets this router read :examId from the parent router.
const examQuestionRouter = express.Router({ mergeParams: true });
examQuestionRouter.post('/', protect, restrictTo('admin'), addQuestion);
examQuestionRouter.get('/', protect, getQuestionsByExam);

// Mounted at /api/questions in server.js
const questionRouter = express.Router();
questionRouter.put('/:id', protect, restrictTo('admin'), updateQuestion);
questionRouter.delete('/:id', protect, restrictTo('admin'), deleteQuestion);

module.exports = { examQuestionRouter, questionRouter };
