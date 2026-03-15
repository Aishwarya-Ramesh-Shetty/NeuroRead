import { Router } from 'express';
import { getGameQuestions, getGames } from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, getGames);
router.get('/:gameId/questions', requireAuth, getGameQuestions);

export default router;
