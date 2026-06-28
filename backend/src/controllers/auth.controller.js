import * as userModel from '../models/user.model.js';
import * as tokenModel from '../models/token.model.js';
import { sendOtpEmail, sendPasswordReset } from '../services/email.service.js';
import { generateOtp } from '../utils/otp.util.js';
import { hashPassword, comparePassword, generateResetToken, issueTokens } from '../services/auth.service.js';
import { verifyRefreshToken, signAccessToken } from '../utils/jwt.util.js';
import { env } from '../config/env.js';

// otp expires time
const OTP_TTL_MS = 10 * 60 * 1000;

// password reset token expires time 
const RESET_TTL_MS = 30 * 60 * 1000;

// cookie options for refresh token
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


//  register a new user 
export const register = async (req, res, next) => {
  try {
    // get name, email, and password from request body
    const { name, email, password } = req.body;

    // check if email is already registered
    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // hash the passwrord, generate otp and set otp expiration
    const password_hash = await hashPassword(password);
    const otp = generateOtp();
    const otp_expires = new Date(Date.now() + OTP_TTL_MS);

    // create the user in the database and send otp email
    await userModel.create({ name, email, password_hash, otp, otp_expires });
    // send the otp email to the user
    await sendOtpEmail({ name, email }, otp);

    res.status(201).json({
      success: true,
      message: 'Registered! Check your email for the 6-digit code.',
    });
  } catch (err) { next(err); }
};

// verify the otp sent to the user's email
export const verifyOtp = async (req, res, next) => {
  try {
    // get email and otp from request body
    const { email, otp } = req.body;

    // find the user by email
    const user = await userModel.findByEmail(email);

    // user not found
    if (!user) return res.status(404).json({ message: 'User not found' });

    // user already verified
    if (user.is_verified) return res.status(400).json({ message: 'Already verified' });

    // check if the otp matches and is not expired
    if (user.otp_code !== otp) {
      return res.status(400).json({ message: 'Incorrect code' });
    }
    // check if the otp is expired
    if (new Date(user.otp_expires) < new Date()) {
      return res.status(400).json({ message: 'Code expired, request a new one' });
    }
    // mark the user as verified
    await userModel.markVerified(user.id);
    res.json({ success: true, message: 'Email verified! You can now log in.' });
  } catch (err) { next(err); }
};

// resend the otp to the user's email
export const resendOtp = async (req, res, next) => {
  try {

    // get email from request body
    const { email } = req.body;
    // find the user by email
    const user = await userModel.findByEmail(email);
    // user not found
    if (!user) return res.status(404).json({ message: 'User not found' });
    // user already verified
    if (user.is_verified) return res.status(400).json({ message: 'Already verified' });

    // generate a new otp and set otp expiration
    const otp = generateOtp();
    const otp_expires = new Date(Date.now() + OTP_TTL_MS);
    await userModel.setOtp(user.id, otp, otp_expires);
    await sendOtpEmail(user, otp);

    res.json({ success: true, message: 'A new code has been sent.' });
  } catch (err) { next(err); }
};

// login the user and issue access and refresh tokens
export const login = async (req, res, next) => {
  try {

    // get email and password from request body
    const { email, password } = req.body;

    // find the user by email
    const user = await userModel.findByEmail(email);

    // user not found
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // compare the password with the hashed password
    const match = await comparePassword(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // check if the user is verified
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    // issue access and refresh tokens for the user
    const { accessToken, refreshToken } = await issueTokens(user);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.json({
      success: true,
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

// logout the user by removing the refresh token from the database and clearing the cookie
export const logout = async (req, res, next) => {
  try {
    // get the refresh token from the cookie
    const token = req.cookies?.refreshToken;
    // remove the refresh token from the database and clear the cookie
    if (token) await tokenModel.removeByToken(token);
    res.clearCookie('refreshToken', refreshCookieOptions);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) { next(err); }
};

// refresh the access token using the refresh token
export const refreshToken = async (req, res, next) => {
  try {
    // read refresh token from cookie
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    // check if the refresh token is valid and not expired
    const stored = await tokenModel.findByToken(token);
    if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });
    if (new Date(stored.expires_at) < new Date()) {
      await tokenModel.removeByToken(token);
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    // verify the refresh token and issue a new access token
    const payload = verifyRefreshToken(token);
    // create a new access token using the payload from the refresh token
    const accessToken = signAccessToken({ id: payload.id, role: payload.role });

    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// handle forgot password request by generating a reset token and sending it to the user's email
export const forgotPassword = async (req, res, next) => {
  try {
    // get email from request body
    const { email } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const reset_token = generateResetToken();
    const reset_expires = new Date(Date.now() + RESET_TTL_MS);
    await userModel.setResetToken(user.id, reset_token, reset_expires);

    const resetUrl = `${env.frontendUrl}/reset-password?token=${reset_token}`;
    await sendPasswordReset(user, resetUrl);

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) { next(err); }
};

// reset the user's password using the reset token and new password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await userModel.findByResetToken(token);
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    if (new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ message: 'Reset token expired' });
    }

    const password_hash = await hashPassword(password);
    await userModel.resetPassword(user.id, password_hash);

    res.json({ success: true, message: 'Password reset. You can now log in.' });
  } catch (err) { next(err); }
};
