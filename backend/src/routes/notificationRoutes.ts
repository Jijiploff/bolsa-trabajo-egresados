import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getAll, markAsRead, markAllAsRead, countUnread } from '../controllers/notificationController';

const router = Router();
router.use(authMiddleware);

router.get('/', getAll);
router.get('/unread-count', countUnread);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

export default router;