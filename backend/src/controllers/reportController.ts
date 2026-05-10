import { Response, NextFunction } from 'express';
import { pdfService } from '../services/pdfService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

export const getEgresadosPorCarrera = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ano = parseInt(req.query.ano as string) || undefined;
    const stream = await pdfService.egresadosPorCarrera(ano);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=egresados_por_carrera${ano ? '_' + ano : ''}.pdf`);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getOfertasActivas = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let empresaId: number | undefined;
    if (req.user?.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findUnique({ where: { usuario_id: req.user.id }, select: { id: true } });
      if (!empresa) return res.status(400).json({ message: 'Perfil de empresa no encontrado' });
      empresaId = empresa.id;
    }

    const stream = await pdfService.ofertasActivas(empresaId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ofertas_activas.pdf');
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getPostulacionesPorOferta = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ofertaId = parseInt(req.params.ofertaId as string);
    let empresaId: number | undefined;
    if (req.user?.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findUnique({ where: { usuario_id: req.user.id }, select: { id: true } });
      if (!empresa) return res.status(400).json({ message: 'Perfil de empresa no encontrado' });
      empresaId = empresa.id;
    }

    const stream = await pdfService.postulacionesPorOferta(ofertaId, empresaId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=postulaciones_oferta_${ofertaId}.pdf`);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getEmpleabilidadPorCarrera = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stream = await pdfService.empleabilidadPorCarrera();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=empleabilidad_por_carrera.pdf');
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getDemandaHabilidades = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stream = await pdfService.demandaHabilidades();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=demanda_habilidades.pdf');
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export const getComparacionCohortes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const anosParam = req.query.anos as string;
    if (!anosParam) return res.status(400).json({ message: 'Debe indicar los años separados por coma (ej: ?anos=2020,2021)' });
    const anos = anosParam.split(',').map(Number).filter((n) => !isNaN(n));
    if (anos.length === 0) return res.status(400).json({ message: 'Años inválidos' });

    const stream = await pdfService.comparacionCohortes(anos);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=comparacion_cohortes_${anos.join('_')}.pdf`);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};