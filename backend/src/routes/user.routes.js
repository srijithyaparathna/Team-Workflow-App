import { Router } from 'express';
import * as user from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(protect);

router.get('/me', user.getMe);
router.get('/', requireRole('admin'), user.getAllUsers);

export default router;
