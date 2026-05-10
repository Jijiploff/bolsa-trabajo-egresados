import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createGraduateSchema, updateGraduateSchema, graduateQuerySchema } from '../validations/graduateValidations';
import { getAll, getById, create, update, remove, getMyProfile } from '../controllers/graduateController';

const router = Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('ADMIN'), validate(graduateQuerySchema, 'query'), getAll);
router.get('/me', roleMiddleware('EGRESADO'), getMyProfile);
router.get('/:id', getById);
router.post('/', roleMiddleware('ADMIN', 'EGRESADO'), validate(createGraduateSchema), create);
router.put('/:id', roleMiddleware('ADMIN', 'EGRESADO'), validate(updateGraduateSchema), update);
router.delete('/:id', roleMiddleware('ADMIN'), remove);


export default router;