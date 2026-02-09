import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAllUsers,
  getAllTrips,
  getStatistics,
  verifyUser,
  resolveDispute,
} from '../controllers/adminController';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', getAllUsers);
router.get('/trips', getAllTrips);
router.get('/statistics', getStatistics);
router.post('/users/:userId/verify', verifyUser);
router.post('/trips/:tripId/resolve-dispute', resolveDispute);

export default router;
