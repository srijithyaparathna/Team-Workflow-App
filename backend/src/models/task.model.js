import { pool } from '../config/db.js';


// create 
// inserts a new task and returns the auto incremented id of the newly created task
export const create = async ({ title, description, priority, status, due_date, created_by, assigned_to }) => {
  const [r] = await pool.execute(
    `INSERT INTO tasks (title, description, priority, status, due_date, created_by, assigned_to)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ title, 
      description ?? null, 
      priority ?? 'medium', 
      status ?? 'open', 
      due_date ?? null, 
      created_by, assigned_to ?? null]
  );
  return r.insertId;
};

// Selects every task column plus the creator's and assignee's names, so
// callers never need a separate user lookup (regular users can't hit
// GET /api/users, since it's admin-only).
const SELECT_WITH_NAMES = `
  SELECT
    tasks.*,
    creator.name AS created_by_name,
    assignee.name AS assigned_to_name
  FROM tasks
  LEFT JOIN users creator ON creator.id = tasks.created_by
  LEFT JOIN users assignee ON assignee.id = tasks.assigned_to
`;

// - Find a task by its ID
export const findById = async (id) => {
  const [rows] = await pool.execute(`${SELECT_WITH_NAMES} WHERE tasks.id = ?`, [id]);
  return rows[0] || null;
};

// - Find all tasks with optional filters for title, priority, and status
export const findAll = async ({ userId, isAdmin, title, priority, status }) => {
  const conditions = [];
  const params = [];

  if (!isAdmin) {


    conditions.push('(tasks.created_by = ? OR tasks.assigned_to = ?)');
    params.push(userId, userId);
  }
  if (title) {
    conditions.push('tasks.title LIKE ?');
    params.push(`%${title}%`);
  }
  if (priority) {
    conditions.push('tasks.priority = ?');
    params.push(priority);
  }
  if (status) {
    conditions.push('tasks.status = ?');
    params.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `${SELECT_WITH_NAMES} ${where} ORDER BY tasks.created_at DESC`,
    params
  );
  return rows;
};

// Update a task by its ID
export const update = async (id, fields) => {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const params = keys.map((k) => fields[k]);
  await pool.execute(`UPDATE tasks SET ${setClause} WHERE id = ?`, [...params, id]);
};

// Delete a task by its ID
export const remove = async (id) => {
  await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
};
