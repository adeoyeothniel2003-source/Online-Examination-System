const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/db'); // initializes the MySQL pool + connection check

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const { examQuestionRouter, questionRouter } = require('./routes/questionRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Health check — useful for confirming the server is up before wiring the frontend.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exams/:examId/questions', examQuestionRouter); // POST/GET nested under an exam
app.use('/api/questions', questionRouter); // PUT/DELETE by question id

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
