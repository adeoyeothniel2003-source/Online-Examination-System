const bcrypt = require('bcryptjs');
const db = require('../config/db');

// @route   GET /api/users/profile
// @desc    Get the logged-in user's full profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, bio, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: rows[0] });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/users/profile
// @desc    Update the logged-in user's name, bio, or password
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, password } = req.body;

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }

    if (bio !== undefined) {
      fields.push('bio = ?');
      values.push(bio);
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      fields.push('password_hash = ?');
      values.push(passwordHash);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    values.push(req.user.id);

    await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await db.query(
      'SELECT id, name, email, role, bio, created_at, updated_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json({ message: 'Profile updated successfully', user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
