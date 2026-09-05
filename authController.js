const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

// @route   POST /api/auth/register
// @desc    Register a new user (student by default)
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Only allow 'admin' role to be set by another admin, never by the public endpoint.
    const finalRole = role === 'admin' ? 'student' : (role || 'student');

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, finalRole]
    );

    const token = generateToken({ id: result.insertId, role: finalRole });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email, role: finalRole },
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
// @desc    Get the currently authenticated user
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user was already attached by the `protect` middleware
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout current user
// @access  Private
// NOTE: JWTs are stateless, so "logout" can't truly invalidate a token
// server-side without a blacklist/store (e.g. Redis). For this system,
// logout simply confirms the action; the client is responsible for
// deleting the stored token. If a real blacklist is needed later, plug
// it in here before responding.
const logout = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, logout };
