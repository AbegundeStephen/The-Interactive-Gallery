import { Router } from 'express';
import { LikeController } from '../controller/likesController';
import {  authenticateToken } from '../middleware/auth';

const router = Router();
const likeController = new LikeController();

// Like routes
router.post('/:id/like', authenticateToken, likeController.likeImage);
router.get('/:id/likes', likeController.getLikes);

export default router;