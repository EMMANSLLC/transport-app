import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createRoute,
  getRoutes,
  updateRoute,
  deleteRoute,
} from '../controllers/routeController';

const router = Router();

router.use(authenticate);
router.use(authorize('TRUCKER'));

router.post(
  '/',
  [
    body('startLocation').notEmpty(),
    body('startLat').isFloat(),
    body('startLng').isFloat(),
    body('endLocation').notEmpty(),
    body('endLat').isFloat(),
    body('endLng').isFloat(),
    body('availableSpace').isFloat(),
    body('departureTime').isISO8601(),
    body('estimatedArrival').isISO8601(),
    validate,
  ],
  createRoute
);

router.get('/', getRoutes);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

export default router;
