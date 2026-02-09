import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createTrip,
  getTripById,
  getUserTrips,
  matchTrip,
  updateTripStatus,
  cancelTrip,
} from '../controllers/tripController';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('pickupLocation').notEmpty(),
    body('pickupLat').isFloat(),
    body('pickupLng').isFloat(),
    body('dropoffLocation').notEmpty(),
    body('dropoffLat').isFloat(),
    body('dropoffLng').isFloat(),
    body('luggageDescription').notEmpty(),
    body('luggageWeight').isFloat(),
    body('luggageDimensions').notEmpty(),
    validate,
  ],
  createTrip
);

router.get('/', getUserTrips);
router.get('/:id', getTripById);
router.post('/:id/match', matchTrip);
router.patch('/:id/status', updateTripStatus);
router.delete('/:id', cancelTrip);

export default router;
