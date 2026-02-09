import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMessages, markAsRead } from '../controllers/messageController';

const router = Router();

router.use(authenticate);

router.get('/:tripId', getMessages);
router.patch('/:messageId/read', markAsRead);

export default router;
