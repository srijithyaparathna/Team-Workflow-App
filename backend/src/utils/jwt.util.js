// Jsonwebtoken library for signing and verifying JWT tokens
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

// Sign and verify JWT tokens for access and refresh tokens
export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '15m' });

// Sign and verify JWT tokens for access and refresh tokens
export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: '7d' });

// Verify JWT tokens for access and refresh tokens
export const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

// Verify JWT tokens for access and refresh tokens
export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.jwtRefreshSecret);
