// Import the verifyAccessToken function from the jwt.util.js file
import { verifyAccessToken } from '../utils/jwt.util.js';

// Middleware function to protect routes by verifying the access token
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
