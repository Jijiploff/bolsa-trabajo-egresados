import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { getAdminDashboard, getGraduateDashboard, getCompanyDashboard } from '../controllers/dashboardController';

const router = Router();
router.use(authMiddleware);

router.get('/admin', roleMiddleware('ADMIN'), getAdminDashboard);
router.get('/graduate', roleMiddleware('EGRESADO'), getGraduateDashboard);
router.get('/company', roleMiddleware('EMPRESA'), getCompanyDashboard);

export default router;