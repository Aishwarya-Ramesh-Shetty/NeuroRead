import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gameRoutes from './gameRoutes.js';
import progressRoutes from './progressRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/progress', progressRoutes);

export default router;
