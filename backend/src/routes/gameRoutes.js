import { Router } from 'express';
import {
  getGameQuestions,
  getGames,
  getPersonalizedGameQuestions,
  getPersonalizedGames
} from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, getGames);
router.get('/personalized', requireAuth, getPersonalizedGames);
router.get('/:gameId/questions', requireAuth, getGameQuestions);
router.get('/:gameId/personalized-questions', requireAuth, getPersonalizedGameQuestions);

export default router;
