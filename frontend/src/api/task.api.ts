import { api } from './client';
import type { ApiResponse, Task, TaskFilters, TaskInput } from '../types';

export const taskApi = {
  list: (filters: TaskFilters = {}) => {
    const params: Record<string, string> = {};
    if (filters.title) params.title = filters.title;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status) params.status = filters.status;
    return api
      .get<ApiResponse<Task[]>>('/tasks', { params })
      .then((r) => r.data.data);
  },

  get: (id: number) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`).then((r) => r.data.data),

  create: (payload: TaskInput) =>
    api.post<ApiResponse<Task>>('/tasks', payload).then((r) => r.data.data),

  update: (id: number, payload: Partial<TaskInput>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, payload).then((r) => r.data.data),

  remove: (id: number) => api.delete(`/tasks/${id}`).then((r) => r.data),
};
