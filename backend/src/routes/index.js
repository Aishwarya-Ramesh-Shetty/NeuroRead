import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gameRoutes from './gameRoutes.js';
import progressRoutes from './progressRoutes.js';
import pronunciationRoutes from './pronunciationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/progress', progressRoutes);
router.use('/pronunciation', pronunciationRoutes);

export default router;
