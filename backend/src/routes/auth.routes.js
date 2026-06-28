import { Router } from 'express';
import { body } from 'express-validator';
import * as auth from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  auth.register
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  validate,
  auth.verifyOtp
);

router.post('/resend-otp', [body('email').isEmail()], validate, auth.resendOtp);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  auth.login
);

router.post('/logout', protect, auth.logout);
router.post('/refresh-token', auth.refreshToken);

router.post('/forgot-password', [body('email').isEmail()], validate, auth.forgotPassword);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  auth.resetPassword
);

export default router;
