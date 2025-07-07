import { Router } from 'express';
import { ImageController } from '../controller/imageController';


const router = Router();
const imageController = new ImageController();

// Image routes
router.get('/', imageController.getImages);
router.get('/:id', imageController.getImageById);

export default router;