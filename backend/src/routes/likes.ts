import { Router } from 'express';
import { LikeController } from '../controller/likesController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const likeController = new LikeController();

// Main like routes
router.post('/:id/toggle', authenticateToken, likeController.toggleLike);
router.get('/:id/status', authenticateToken,likeController.getLikeStatus);
router.get('/:id/likes',authenticateToken, likeController.getLikes);

// User-specific routes
router.get('/user/liked', authenticateToken, likeController.getLikedImagesByUser);

// Discovery routes
router.get('/most-liked', authenticateToken,likeController.getMostLikedImages);

// Legacy routes (for backward compatibility)
router.post('/:id/like', authenticateToken, likeController.likeImage);

export default router;