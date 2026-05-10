import { Router } from 'express';
import { getAll } from '../controllers/habilidadController';

const router = Router();
router.get('/', getAll);
export default router;