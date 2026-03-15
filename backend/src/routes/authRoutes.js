import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateRequest(registerValidator), register);
router.post('/login', validateRequest(loginValidator), login);
router.get('/me', requireAuth, me);

export default router;
