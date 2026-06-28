import { api } from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  
  register: (payload: { name: string; email: string; password: string }) =>
    api.post('/auth/register', payload).then((r) => r.data),

  verifyOtp: (payload: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', payload).then((r) => r.data),

  resendOtp: (payload: { email: string }) =>
    api.post('/auth/resend-otp', payload).then((r) => r.data),

  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  forgotPassword: (payload: { email: string }) =>
    api.post('/auth/forgot-password', payload).then((r) => r.data),

  resetPassword: (payload: { token: string; password: string }) =>
    api.post('/auth/reset-password', payload).then((r) => r.data),

  me: () =>
    api.get<{ success: boolean; data: User }>('/users/me').then((r) => r.data.data),
};
