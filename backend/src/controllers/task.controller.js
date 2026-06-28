import * as taskModel from '../models/task.model.js';
import * as userModel from '../models/user.model.js';
import { canModify, canView } from '../services/task.service.js';

// Helper function to check if the assigned_to user exists
const assertAssigneeExists = async (assigned_to) => {
  if (assigned_to === undefined || assigned_to === null) return null;
  const assignee = await userModel.findById(assigned_to);
  if (!assignee) {
    const err = new Error('assigned_to user does not exist');
    err.statusCode = 400;
    throw err;
  }
  return assignee;
};

// create a new task with the provided details and assign it to a user
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, due_date, assigned_to } = req.body;
    await assertAssigneeExists(assigned_to);
    // Default to self-assigned when no assignee is given (e.g. a non-admin creating their own task).
    const id = await taskModel.create({
      title, description, priority, status, due_date,
      created_by: req.user.id,
      assigned_to: assigned_to ?? req.user.id,
    });
    const task = await taskModel.findById(id);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
};

// get all tasks for the logged-in user, with optional filtering by title, priority, and status
export const getTasks = async (req, res, next) => {
  try {
    const { title, priority, status } = req.query;
    const tasks = await taskModel.findAll({
      userId: req.user.id,
      isAdmin: req.user.role === 'admin',
      title, priority, status,
    });
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
};

// get a specific task by its ID, ensuring the user has permission to view it
export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canView(task, req.user)) return res.status(403).json({ message: 'Forbidden' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

// update a specific task by its ID, ensuring the user has permission to modify it
export const updateTask = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canModify(task, req.user)) return res.status(403).json({ message: 'Forbidden' });

    const { title, description, priority, status, due_date, assigned_to } = req.body;
    await assertAssigneeExists(assigned_to);
    const fields = { title, description, priority, status, due_date, assigned_to };
    Object.keys(fields).forEach((k) => fields[k] === undefined && delete fields[k]);

    await taskModel.update(req.params.id, fields);
    const updated = await taskModel.findById(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// delete a specific task by its ID, ensuring the user has permission to modify it
export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canModify(task, req.user)) return res.status(403).json({ message: 'Forbidden' });
    await taskModel.remove(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};
