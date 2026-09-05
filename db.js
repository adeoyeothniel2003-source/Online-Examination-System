const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'exam_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick sanity check on startup so connection issues fail loudly and early.
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully.');
    conn.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
})();

module.exports = pool;
