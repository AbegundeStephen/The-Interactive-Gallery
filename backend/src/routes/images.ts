import { Router } from 'express';
import { ImageController } from '@/controller/imageController';
import { CommentController } from '@/controller/commentController';
import { LikeController } from '@/controller/likesController';
import { validateComment } from '@/middleware/validation';
import { optionalAuth } from '@/middleware/auth';

const router = Router();
const imageController = new ImageController();
const commentController = new CommentController();
const likeController = new LikeController();

// Image routes
router.get('/', imageController.getImages);
router.get('/:id', imageController.getImageById);

// Comment routes
router.post('/:id/comments', optionalAuth, validateComment, commentController.createComment);
router.get('/:id/comments', commentController.getComments);

// Like routes
router.post('/:id/like', optionalAuth, likeController.likeImage);
router.get('/:id/likes', likeController.getLikes);

export default router;