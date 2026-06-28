// user Role type
export type Role = 'user' | 'admin';

// Task prority type
export type Priority = 'low' | 'medium' | 'high';

// satus type
export type Status = 'open' | 'in_progress' | 'testing' | 'done';

// User interface 
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  is_verified?: boolean;
  created_at?: string;
}

// Task interface
export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  due_date: string | null;
  created_by: number;
  assigned_to: number | null;
  created_by_name?: string | null;
  assigned_to_name?: string | null;
  created_at: string;
  updated_at: string;
}

// TaskInput interface 
// Used when creating or updating task
export interface TaskInput {
  title: string;
  description?: string | null;
  priority?: Priority;
  status?: Status;
  due_date?: string | null;
  assigned_to?: number | null;
}

// TaskFilters interface
export interface TaskFilters {
  title?: string;
  priority?: Priority | '';
  status?: Status | '';
}

// ApiResponse interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// AuthResponse interface
export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: User;
}

// Priority dropdown options 
export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

// Status dropdown options
export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'testing', label: 'Testing' },
  { value: 'done', label: 'Done' },
];
