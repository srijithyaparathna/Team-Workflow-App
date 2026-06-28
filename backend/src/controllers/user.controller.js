import * as userModel from '../models/user.model.js';

// get the logged-in user's details
export const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password_hash, otp_code, reset_token, ...safe } = user;
    res.json({ success: true, data: safe });
  } catch (err) { next(err); }
};

// get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll();
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};
