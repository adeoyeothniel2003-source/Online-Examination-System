-- ============================================
-- Online Examination System - Database Schema
-- Covers: Users, Exams, Questions
-- (Attempts/Answers tables are owned by another
--  team member's module and are NOT created here.
--  If your teammate's script hasn't run yet, exams
--  and questions will still work standalone.)
-- ============================================

CREATE DATABASE IF NOT EXISTS exam_system;
USE exam_system;

-- ---------------- USERS ----------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    bio VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------- EXAMS ----------------
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------- QUESTIONS ----------------
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    is_correct ENUM('A', 'B', 'C', 'D') NOT NULL,
    marks INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- ---------------- SEED ADMIN (optional) ----------------
-- Password below is a bcrypt hash for the plaintext "Admin123!"
-- Feel free to remove this or change the email once the schema is loaded.
-- INSERT INTO users (name, email, password_hash, role)
-- VALUES ('System Admin', 'admin@examsystem.com', '$2a$10$C7t1J1i1qU8y0yZ0m8yJdOQxJt2m2r2z2r2z2r2z2r2z2r2z2r2z2', 'admin');
