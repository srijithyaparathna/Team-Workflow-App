import { api } from './client';
import type { ApiResponse, User } from '../types';

export const userApi = {
  list: () =>
    api.get<ApiResponse<User[]>>('/users').then((r) => r.data.data),

  me: () =>
    api.get<ApiResponse<User>>('/users/me').then((r) => r.data.data),
};
