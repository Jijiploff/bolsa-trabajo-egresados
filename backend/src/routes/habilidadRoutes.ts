import { Router } from 'express';
import { getAll, create } from '../controllers/habilidadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = Router();

// Pública para lectura
router.get('/', getAll);
// Crear (solo ADMIN y EMPRESA)
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'EMPRESA', 'EGRESADO'), create);

export default router;