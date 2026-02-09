import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRating } from '../controllers/ratingController';

const router = Router();

router.use(authenticate);

router.post(
  '/:tripId',
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString(),
    validate,
  ],
  createRating
);

export default router;
