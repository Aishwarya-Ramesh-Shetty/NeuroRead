import { Router } from 'express';
import { getSummary, recordAttempt } from '../controllers/progressController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createAttemptValidator } from '../validators/progressValidators.js';

const router = Router();

router.post('/attempt', requireAuth, validateRequest(createAttemptValidator), recordAttempt);
router.get('/summary', requireAuth, getSummary);

export default router;
