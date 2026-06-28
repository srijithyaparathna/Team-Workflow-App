import { Router } from 'express';
import { body } from 'express-validator';
import * as task from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(protect);

router.get('/', task.getTasks);

const taskFieldRules = [
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').optional().isIn(['open', 'in_progress', 'testing', 'done']).withMessage('Invalid status'),
  body('due_date').optional({ values: 'null' }).isISO8601().withMessage('Due date must be a valid date'),
  body('assigned_to').optional({ values: 'null' }).isInt().withMessage('assigned_to must be a user id'),
];

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    ...taskFieldRules,
    // Only enforced on create — an update shouldn't be blocked just because
    // an existing task's due date has since passed (e.g. marking it Done).
    body('due_date')
      .optional({ values: 'null' })
      .custom((value) => new Date(value) >= new Date())
      .withMessage('Due date cannot be in the past'),
  ],
  validate,
  task.createTask
);

router.get('/:id', task.getTaskById);
router.put('/:id', [body('title').optional().trim().notEmpty(), ...taskFieldRules], validate, task.updateTask);
router.delete('/:id', task.deleteTask);

export default router;
