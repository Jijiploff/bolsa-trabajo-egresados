import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

export const getAdminDashboard = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [kpis, porCarrera, porAno, demandaHabilidades, ofertasVsEgresados] = await Promise.all([
      dashboardService.getAdminKPIs(),
      dashboardService.getEgresadosPorCarrera(),
      dashboardService.getEgresadosPorAno(),
      dashboardService.getDemandaHabilidades(),
      dashboardService.getOfertasVsEgresadosPorCiudad(),
    ]);

    res.json({
      kpis,
      egresadosPorCarrera: porCarrera.map((c) => ({ carrera: c.nombre, egresados: c._count.egresados })),
      egresadosPorAno: porAno,
      demandaHabilidades,
      ofertasVsEgresadosPorCiudad: ofertasVsEgresados,
    });
  } catch (error) {
    next(error);
  }
};

export const getGraduateDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    const egresado = await prisma.egresado.findUnique({ where: { usuario_id: req.user.id }, select: { id: true } });
    if (!egresado) return res.status(400).json({ message: 'Perfil de egresado no encontrado' });

    const [kpis, matchingOfertas] = await Promise.all([
      dashboardService.getGraduateKPIs(egresado.id),
      dashboardService.getMatchingOfertas(egresado.id),
    ]);

    res.json({ kpis, matchingOfertas });
  } catch (error) {
    next(error);
  }
};

export const getCompanyDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    const empresa = await prisma.empresa.findUnique({ where: { usuario_id: req.user.id }, select: { id: true } });
    if (!empresa) return res.status(400).json({ message: 'Perfil de empresa no encontrado' });

    const [kpis, rendimientoPorOferta] = await Promise.all([
      dashboardService.getCompanyKPIs(empresa.id),
      dashboardService.getRendimientoPorOferta(empresa.id),
    ]);

    res.json({ kpis, rendimientoPorOferta });
  } catch (error) {
    next(error);
  }
};