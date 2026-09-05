const db = require('../config/db');

// @route   POST /api/exams/:examId/questions
// @desc    Add a question to an exam
// @access  Private/Admin
const addQuestion = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, is_correct, marks } = req.body;

    const [exam] = await db.query('SELECT id FROM exams WHERE id = ?', [examId]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !is_correct) {
      return res.status(400).json({
        message: 'question_text, option_a-d, and is_correct are all required',
      });
    }

    if (!['A', 'B', 'C', 'D'].includes(is_correct.toUpperCase())) {
      return res.status(400).json({ message: "is_correct must be one of 'A', 'B', 'C', 'D'" });
    }

    const [result] = await db.query(
      `INSERT INTO questions
        (exam_id, question_text, option_a, option_b, option_c, option_d, is_correct, marks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        examId,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        is_correct.toUpperCase(),
        marks || 1,
      ]
    );

    const [rows] = await db.query('SELECT * FROM questions WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Question added successfully', question: rows[0] });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/exams/:examId/questions
// @desc    Get all questions for an exam.
//          Admins get the full question including is_correct.
//          Students get everything EXCEPT is_correct, so answers can't leak.
// @access  Private
const getQuestionsByExam = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const [exam] = await db.query('SELECT id FROM exams WHERE id = ?', [examId]);
    if (exam.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const [questions] = await db.query(
      'SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC',
      [examId]
    );

    if (req.user.role === 'admin') {
      return res.status(200).json({ count: questions.length, questions });
    }

    // Strip is_correct for non-admin users before sending the response.
    const sanitized = questions.map(({ is_correct, ...rest }) => rest);

    res.status(200).json({ count: sanitized.length, questions: sanitized });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private/Admin
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, is_correct, marks } = req.body;

    const [existing] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (is_correct && !['A', 'B', 'C', 'D'].includes(is_correct.toUpperCase())) {
      return res.status(400).json({ message: "is_correct must be one of 'A', 'B', 'C', 'D'" });
    }

    const fields = [];
    const values = [];

    const maybeUpdate = (column, value) => {
      if (value !== undefined) {
        fields.push(`${column} = ?`);
        values.push(value);
      }
    };

    maybeUpdate('question_text', question_text);
    maybeUpdate('option_a', option_a);
    maybeUpdate('option_b', option_b);
    maybeUpdate('option_c', option_c);
    maybeUpdate('option_d', option_d);
    maybeUpdate('is_correct', is_correct ? is_correct.toUpperCase() : undefined);
    maybeUpdate('marks', marks);

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    values.push(id);
    await db.query(`UPDATE questions SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await db.query('SELECT * FROM questions WHERE id = ?', [id]);
    res.status(200).json({ message: 'Question updated successfully', question: rows[0] });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private/Admin
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM questions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await db.query('DELETE FROM questions WHERE id = ?', [id]);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addQuestion, getQuestionsByExam, updateQuestion, deleteQuestion };
