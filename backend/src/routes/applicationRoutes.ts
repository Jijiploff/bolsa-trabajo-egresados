import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { applicationQuerySchema, changeStatusSchema } from '../validations/applicationValidations';
import { getAll, getById, apply, changeStatus, getHistory } from '../controllers/applicationController';

const router = Router();
router.use(authMiddleware);

// Listar postulaciones (roles: admin, empresa, egresado)
router.get('/', roleMiddleware('ADMIN', 'EMPRESA', 'EGRESADO'), validate(applicationQuerySchema, 'query'), getAll);

// Ver detalle de una postulación
router.get('/:id', roleMiddleware('ADMIN', 'EMPRESA', 'EGRESADO'), getById);

// Postular a una oferta (solo egresado)
router.post('/apply/:ofertaId', roleMiddleware('EGRESADO'), apply);

// Cambiar estado de una postulación (admin o empresa dueña)
router.put('/:id/status', roleMiddleware('ADMIN', 'EMPRESA'), validate(changeStatusSchema), changeStatus);

// Obtener historial de estados de una postulación
router.get('/:id/history', roleMiddleware('ADMIN', 'EMPRESA', 'EGRESADO'), getHistory);

export default router;