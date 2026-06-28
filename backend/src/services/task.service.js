// checks if a user can modify a task based on their role and ownership
export const canModify = (task, user) =>
  user.role === 'admin' || task.created_by === user.id;

// checks if a user can view a task based on their role and ownership
export const canView = (task, user) =>
  user.role === 'admin' || task.created_by === user.id || task.assigned_to === user.id;
