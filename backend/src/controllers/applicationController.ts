import { Request, Response, NextFunction } from 'express';
import { applicationService } from '../services/applicationService';
import { notificationService } from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

const getUserContext = async (user: { id: number; rol: string }) => {
  const context: { userId: number; rol: string; empresaId?: number; egresadoId?: number } = {
    userId: user.id,
    rol: user.rol,
  };

  if (user.rol === 'EMPRESA') {
    const empresa = await prisma.empresa.findUnique({ where: { usuario_id: user.id }, select: { id: true } });
    if (empresa) context.empresaId = empresa.id;
  } else if (user.rol === 'EGRESADO') {
    const egresado = await prisma.egresado.findUnique({ where: { usuario_id: user.id }, select: { id: true } });
    if (egresado) context.egresadoId = egresado.id;
  }

  return context;
};

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const context = await getUserContext(req.user);
    const result = await applicationService.findAll(req.query, context);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const context = await getUserContext(req.user);
    const application = await applicationService.findById(id, context);
    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const apply = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (req.user.rol !== 'EGRESADO') {
      return res.status(403).json({ message: 'Solo los egresados pueden postular' });
    }

    const context = await getUserContext(req.user);
    if (!context.egresadoId) {
      return res.status(400).json({ message: 'Debe completar su perfil de egresado antes de postular' });
    }

    const ofertaId = parseInt(req.params.ofertaId as string);
    const application = await applicationService.apply(context.egresadoId, ofertaId);

    // --- NOTIFICAR A LA EMPRESA DUEÑA DE LA OFERTA ---
    const oferta = await prisma.ofertaLaboral.findUnique({
      where: { id: ofertaId },
      include: { empresa: { include: { usuario: { select: { id: true } } } } },
    });
    if (oferta?.empresa?.usuario?.id) {
      await notificationService.create({
        usuario_id: oferta.empresa.usuario.id,
        tipo: 'NUEVA_POSTULACION',
        mensaje: `Nueva postulación de ${application.egresado.nombres} ${application.egresado.apellidos} para "${application.oferta.titulo}"`,
        url: `/applications/${application.id}`,
      });
    }

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (req.user.rol !== 'ADMIN' && req.user.rol !== 'EMPRESA') {
      return res.status(403).json({ message: 'Solo administradores o empresas pueden cambiar el estado' });
    }

    const id = parseInt(req.params.id as string);
    const { estado, comentario } = req.body;

    let empresaId: number | undefined;
    if (req.user.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findUnique({ where: { usuario_id: req.user.id }, select: { id: true } });
      if (!empresa) return res.status(400).json({ message: 'Perfil de empresa no encontrado' });
      empresaId = empresa.id;
    }

    const updated = await applicationService.changeStatus(id, estado, comentario, empresaId);

    // --- NOTIFICAR AL EGRESADO SOBRE EL CAMBIO DE ESTADO ---
    const postulacion = await prisma.postulacion.findUnique({
      where: { id },
      include: { egresado: { include: { usuario: { select: { id: true } } } }, oferta: { select: { titulo: true } } },
    });
    if (postulacion?.egresado?.usuario?.id) {
      await notificationService.create({
        usuario_id: postulacion.egresado.usuario.id,
        tipo: 'CAMBIO_ESTADO',
        mensaje: `Tu postulación a "${postulacion.oferta.titulo}" ha cambiado a estado: ${estado}${comentario ? '. Comentario: ' + comentario : ''}`,
        url: `/applications/${id}`,
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const context = await getUserContext(req.user);
    const application = await applicationService.findById(id, context);
    res.json(application.historial_estados);
  } catch (error) {
    next(error);
  }
};