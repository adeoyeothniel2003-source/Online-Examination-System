```javascript
const express = require('express');

const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController');

const {
    protect,
    restrictTo
} = require('../middleware/auth');

const router = express.Router();


// =========================================
// GET ALL QUESTIONS FOR AN EXAM
// =========================================
// Students can load exam questions.
// Admins can also load questions and will
// receive the correct answer.

router.get(
    '/exam/:examId',
    protect,
    getQuestions
);


// =========================================
// GET ONE QUESTION
// =========================================
// Used by admin when editing a question.

router.get(
    '/:id',
    protect,
    restrictTo('admin'),
    getQuestionById
);


// =========================================
// CREATE QUESTION
// =========================================

router.post(
    '/exam/:examId',
    protect,
    restrictTo('admin'),
    createQuestion
);


// =========================================
// UPDATE QUESTION
// =========================================

router.put(
    '/:id',
    protect,
    restrictTo('admin'),
    updateQuestion
);


// =========================================
// DELETE QUESTION
// =========================================

router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    deleteQuestion
);


module.exports = router;
```
