import { pool } from '../config/db.js';

// Create a new refresh token for a user
export const create = async (userId, token, expiresAt) => {
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
};

// Find a refresh token by its value
export const findByToken = async (token) => {
  const [rows] = await pool.execute(
    'SELECT * FROM refresh_tokens WHERE token = ?',
    [token]
  );
  return rows[0] || null;
};

// Remove a refresh token by its value
export const removeByToken = async (token) => {
  await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
};

// Remove all refresh tokens for a user
export const removeAllForUser = async (userId) => {
  await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
};
