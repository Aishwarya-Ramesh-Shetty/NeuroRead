import { Router } from 'express';
import { getPronunciation } from '../controllers/pronunciationController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:letter', requireAuth, getPronunciation);

export default router;
