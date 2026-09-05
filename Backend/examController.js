const db = require('../config/db');

// @route   GET /api/exams
// @desc    List exams — admins see all exams, students only see published ones
// @access  Private
const getExams = async (req, res, next) => {
  try {
    let query = 'SELECT * FROM exams';
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE status = ?';
      params.push('published');
    }

    query += ' ORDER BY created_at DESC';

    const [exams] = await db.query(query, params);
    res.status(200).json({ count: exams.length, exams });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/exams/:id
// @desc    Get a single exam's details
// @access  Private
const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM exams WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const exam = rows[0];

    // Students can't view exams that aren't published yet.
    if (req.user.role !== 'admin' && exam.status !== 'published') {
      return res.status(403).json({ message: 'This exam is not available' });
    }

    res.status(200).json({ exam });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/exams
// @desc    Create a new exam
// @access  Private/Admin
const createExam = async (req, res, next) => {
  try {
    const { title, description, duration_minutes } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Exam title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO exams (title, description, duration_minutes, created_by) VALUES (?, ?, ?, ?)',
      [title, description || null, duration_minutes || 30, req.user.id]
    );

    const [rows] = await db.query('SELECT * FROM exams WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Exam created successfully', exam: rows[0] });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/exams/:id
// @desc    Update an exam's details
// @access  Private/Admin
const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, duration_minutes } = req.body;

    const [existing] = await db.query('SELECT * FROM exams WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    if (duration_minutes) {
      fields.push('duration_minutes = ?');
      values.push(duration_minutes);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    values.push(id);
    await db.query(`UPDATE exams SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await db.query('SELECT * FROM exams WHERE id = ?', [id]);
    res.status(200).json({ message: 'Exam updated successfully', exam: rows[0] });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/exams/:id
// @desc    Delete an exam
// @access  Private/Admin
const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM exams WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await db.query('DELETE FROM exams WHERE id = ?', [id]);
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   PATCH /api/exams/:id/status
// @desc    Publish or unpublish an exam
// @access  Private/Admin
const updateExamStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'draft' or 'published'" });
    }

    const [existing] = await db.query('SELECT id FROM exams WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    await db.query('UPDATE exams SET status = ? WHERE id = ?', [status, id]);

    const [rows] = await db.query('SELECT * FROM exams WHERE id = ?', [id]);
    res.status(200).json({ message: `Exam ${status} successfully`, exam: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  updateExamStatus,
};
