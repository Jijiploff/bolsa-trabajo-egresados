import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { createCompanySchema, updateCompanySchema, companyQuerySchema } from '../validations/companyValidations';
import { getAll, getById, create, update, remove, getMyCompany } from '../controllers/companyController';

const router = Router();
router.use(authMiddleware);

// Solo administradores pueden listar y gestionar empresas globalmente;
// las empresas pueden crear y editar su propio perfil (lógica en controlador)
router.get('/', roleMiddleware('ADMIN'), validate(companyQuerySchema, 'query'), getAll);
router.get('/me', roleMiddleware('EMPRESA'), getMyCompany);
router.get('/:id', getById);
router.post('/', roleMiddleware('ADMIN', 'EMPRESA'), validate(createCompanySchema), create);
router.put('/:id', roleMiddleware('ADMIN', 'EMPRESA'), validate(updateCompanySchema), update);
router.delete('/:id', roleMiddleware('ADMIN'), remove);


export default router;