import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import {
  getEgresadosPorCarrera,
  getOfertasActivas,
  getPostulacionesPorOferta,
  getEmpleabilidadPorCarrera,
  getDemandaHabilidades,
  getComparacionCohortes,
} from '../controllers/reportController';

const router = Router();
router.use(authMiddleware);

// Operacionales
router.get('/egresados-por-carrera', roleMiddleware('ADMIN', 'EGRESADO'), getEgresadosPorCarrera);
router.get('/ofertas-activas', roleMiddleware('ADMIN', 'EMPRESA'), getOfertasActivas);
router.get('/postulaciones-por-oferta/:ofertaId', roleMiddleware('ADMIN', 'EMPRESA'), getPostulacionesPorOferta);

// Gestión (solo Admin)
router.get('/empleabilidad-por-carrera', roleMiddleware('ADMIN'), getEmpleabilidadPorCarrera);
router.get('/demanda-habilidades', roleMiddleware('ADMIN'), getDemandaHabilidades);
router.get('/comparacion-cohortes', roleMiddleware('ADMIN'), getComparacionCohortes);

export default router;