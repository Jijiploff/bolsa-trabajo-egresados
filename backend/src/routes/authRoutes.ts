import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../validations/authValidations';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;