import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadVideo, getVideosByTrip } from '../controllers/videoController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post('/:tripId', upload.single('video'), uploadVideo);
router.get('/:tripId', getVideosByTrip);

export default router;
