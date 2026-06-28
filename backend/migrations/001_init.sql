CREATE DATABASE IF NOT EXISTS taskapp;
USE taskapp;

CREATE TABLE users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('user','admin') DEFAULT 'user',
  is_verified     BOOLEAN DEFAULT FALSE,
  otp_code        VARCHAR(6),
  otp_expires     TIMESTAMP NULL,
  reset_token     VARCHAR(255),
  reset_expires   TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  priority    ENUM('low','medium','high') DEFAULT 'medium',
  status      ENUM('open','in_progress','testing','done') DEFAULT 'open',
  due_date    DATETIME,
  created_by  INT NOT NULL,
  assigned_to INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE refresh_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password_hash, role, is_verified)
VALUES ('Admin', 'admin@example.com', '$2b$10$PLACEHOLDER_HASH', 'admin', TRUE);
