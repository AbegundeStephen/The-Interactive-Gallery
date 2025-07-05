import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { validateAuth, validateLogin } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

router.post('/signup', validateAuth, authController.signup);
router.post('/login', validateLogin, authController.login);

export default router;
