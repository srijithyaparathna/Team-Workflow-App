// library for hashing passwords 
import bcrypt from 'bcryptjs';
// library for generating random bytes for reset tokens
import crypto from 'crypto';
import * as tokenModel from '../models/token.model.js';

// Import the signAccessToken and signRefreshToken functions from the jwt.util.js file
import { signAccessToken, signRefreshToken } from '../utils/jwt.util.js';

// Hashes a password using bcrypt
export const hashPassword = (password) => bcrypt.hash(password, 10);

// Compares a password with a hashed password using bcrypt
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

// Generates a random reset token using crypto
export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

// Generate Access Token and Refresh Token for a user
export const issueTokens = async (user) => {
  const payload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await tokenModel.create(user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken };
};
