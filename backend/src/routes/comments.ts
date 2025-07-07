import { Router } from 'express';
import { CommentController } from '../controller/commentController';
import { validateComment } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const commentController = new CommentController();

// Comment routes
router.post('/:id/', authenticateToken, validateComment, commentController.createComment);
router.get('/:id/', commentController.getComments);


export default router;