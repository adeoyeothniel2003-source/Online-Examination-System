CREATE DATABASE IF NOT EXISTS exam_system;

USE exam_system;

-- =========================================
-- USERS
-- Stores both administrators and students
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',

    student_id VARCHAR(50) UNIQUE NULL,

    department VARCHAR(150) NULL,

    level VARCHAR(20) NULL,

    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================
-- EXAMS
-- =========================================

CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    duration_minutes INT NOT NULL DEFAULT 30,

    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',

    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- =========================================
-- QUESTIONS
-- =========================================

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    exam_id INT NOT NULL,

    question_text TEXT NOT NULL,

    option_a TEXT NOT NULL,

    option_b TEXT NOT NULL,

    option_c TEXT NOT NULL,

    option_d TEXT NOT NULL,

    is_correct ENUM('A', 'B', 'C', 'D') NOT NULL,

    marks INT NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE CASCADE
);


-- =========================================
-- EXAM REGISTRATIONS
-- Connects students to exams
-- =========================================

CREATE TABLE IF NOT EXISTS exam_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    exam_id INT NOT NULL,

    status ENUM('registered', 'completed')
        NOT NULL DEFAULT 'registered',

    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_student_exam
        (student_id, exam_id)
);


-- =========================================
-- EXAM ATTEMPTS / RESULTS
-- =========================================

CREATE TABLE IF NOT EXISTS exam_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    exam_id INT NOT NULL,

    score INT NOT NULL DEFAULT 0,

    total_marks INT NOT NULL DEFAULT 0,

    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,

    status ENUM('pass', 'fail') NOT NULL DEFAULT 'fail',

    started_at DATETIME NULL,

    submitted_at DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_student_exam_attempt
        (student_id, exam_id)
);


-- =========================================
-- RESULT ANSWERS
-- =========================================

CREATE TABLE IF NOT EXISTS result_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    attempt_id INT NOT NULL,

    question_id INT NOT NULL,

    selected_answer ENUM('A', 'B', 'C', 'D') NULL,

    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,

    is_correct BOOLEAN NOT NULL DEFAULT FALSE,

    marks_awarded INT NOT NULL DEFAULT 0,

    FOREIGN KEY (attempt_id)
        REFERENCES exam_attempts(id)
        ON DELETE CASCADE,

    FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);


-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_student_id
ON users(student_id);

CREATE INDEX idx_exams_status
ON exams(status);

CREATE INDEX idx_questions_exam
ON questions(exam_id);

CREATE INDEX idx_registrations_student
ON exam_registrations(student_id);

CREATE INDEX idx_registrations_exam
ON exam_registrations(exam_id);

CREATE INDEX idx_attempts_student
ON exam_attempts(student_id);

CREATE INDEX idx_attempts_exam
ON exam_attempts(exam_id);
