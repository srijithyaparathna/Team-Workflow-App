// Nodemailer library
import nodemailer from 'nodemailer';
import { env } from './env.js';

export const transporter = nodemailer.createTransport({
  host: env.emailHost,
  port: env.emailPort,
  secure: env.emailPort === 465,
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});
