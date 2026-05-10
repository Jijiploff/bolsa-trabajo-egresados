import { Router } from 'express';
import { getAll } from '../controllers/carreraController';

const router = Router();
router.get('/', getAll);
export default router;