import { Request, Response, NextFunction } from 'express';
import { graduateService } from '../services/graduateService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await graduateService.findAll(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const graduate = await graduateService.findById(id);

    // Solo se requiere estar autenticado; cualquier rol puede ver
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    res.json(graduate);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    const egresado = await prisma.egresado.findUnique({
      where: { usuario_id: req.user.id },
      include: {
        usuario: { select: { id: true, email: true, activo: true } },
        carrera: { select: { id: true, nombre: true } },
        formacion_academica: true,
        experiencia_laboral: true,
        habilidades: {
          include: { habilidad: { select: { id: true, nombre: true, tipo: true } } },
        },
      },
    });

    if (!egresado) {
      return res.status(404).json({ message: 'Perfil de egresado no encontrado' });
    }

    res.json(egresado);
  } catch (error) {
    console.error('Error en getMyProfile:', error);
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (req.user.rol === 'EGRESADO') {
      body.usuario_id = req.user.id;
    } else if (req.user.rol === 'ADMIN') {
      if (!body.usuario_id) {
        return res.status(400).json({ message: 'Se requiere usuario_id' });
      }
    } else {
      return res.status(403).json({ message: 'No tiene permisos para crear un perfil de egresado' });
    }

    const graduate = await graduateService.create(body);
    res.status(201).json(graduate);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const body = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const existing = await graduateService.findById(id);
    if (req.user.rol !== 'ADMIN' && existing.usuario_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para modificar este perfil' });
    }

    const updated = await graduateService.update(id, body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (!req.user || req.user.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await graduateService.delete(id);
    res.json({ message: 'Egresado eliminado' });
  } catch (error) {
    next(error);
  }
};