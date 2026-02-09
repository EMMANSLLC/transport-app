import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile, updateTruckerProfile } from '../controllers/userController';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/trucker-profile', updateTruckerProfile);

export default router;
