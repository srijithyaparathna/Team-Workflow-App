import { pool } from '../config/db.js';

// Create a new user
export const create = async ({ name, email, password_hash, otp, otp_expires }) => {
  const [r] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, otp_code, otp_expires)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password_hash, otp, otp_expires]
  );
  return r.insertId;
};

// Find a user by their email
export const findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

// Find a user by their ID
export const findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};
// find all (admin only)  
export const findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, is_verified, created_at FROM users'
  );
  return rows;
};
// mark a user as verified
export const markVerified = async (id) => {
  await pool.execute(
    'UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expires = NULL WHERE id = ?',
    [id]
  );
};

// set OTP for a user
export const setOtp = async (id, otp, otp_expires) => {
  await pool.execute(
    'UPDATE users SET otp_code = ?, otp_expires = ? WHERE id = ?',
    [otp, otp_expires, id]
  );
};

// set reset token and expiration for a user
export const setResetToken = async (id, reset_token, reset_expires) => {
  await pool.execute(
    'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
    [reset_token, reset_expires, id]
  );
};

// Find a user by their reset token
export const findByResetToken = async (reset_token) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE reset_token = ?',
    [reset_token]
  );
  return rows[0] || null;
};

// Reset a user's password and clear the reset token and expiration
export const resetPassword = async (id, password_hash) => {
  await pool.execute(
    'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
    [password_hash, id]
  );
};
