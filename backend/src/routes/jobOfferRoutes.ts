import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createJobOfferSchema, updateJobOfferSchema, jobOfferQuerySchema } from '../validations/jobOfferValidations';
import { getAll, getById, create, update, remove, toggleActive } from '../controllers/jobOfferController';

const router = Router();
router.use(authMiddleware);

// Todos los roles autenticados pueden ver ofertas (con restricciones)
router.get('/', roleMiddleware('ADMIN', 'EMPRESA', 'EGRESADO'), validate(jobOfferQuerySchema, 'query'), getAll);
router.get('/:id', getById);
router.post('/', roleMiddleware('ADMIN', 'EMPRESA'), validate(createJobOfferSchema), create);
router.put('/:id', roleMiddleware('ADMIN', 'EMPRESA'), validate(updateJobOfferSchema), update);
router.delete('/:id', roleMiddleware('ADMIN', 'EMPRESA'), remove);
router.patch('/:id/toggle-active', roleMiddleware('ADMIN', 'EMPRESA'), toggleActive);

export default router;