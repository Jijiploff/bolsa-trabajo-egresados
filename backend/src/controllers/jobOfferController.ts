import { Request, Response, NextFunction } from 'express';
import { jobOfferService } from '../services/jobOfferService';
import { notificationService } from '../services/notificationService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    let userEmpresaId: number | undefined;
    if (req.user.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findUnique({
        where: { usuario_id: req.user.id },
        select: { id: true },
      });
      if (!empresa) {
        return res.status(400).json({ message: 'El usuario no tiene un perfil de empresa asociado' });
      }
      userEmpresaId = empresa.id;
    }

    const result = await jobOfferService.findAll(req.query, userEmpresaId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const offer = await jobOfferService.findById(id);

    if (req.user.rol !== 'ADMIN') {
      if (req.user.rol === 'EMPRESA') {
        const empresa = await prisma.empresa.findUnique({
          where: { usuario_id: req.user.id },
          select: { id: true },
        });
        if (!empresa || empresa.id !== offer.empresa_id) {
          return res.status(403).json({ message: 'No autorizado' });
        }
      }
    }
    res.json(offer);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const body = req.body;

    if (req.user.rol === 'EMPRESA') {
      const empresa = await prisma.empresa.findUnique({
        where: { usuario_id: req.user.id },
        select: { id: true, nombre: true },
      });
      if (!empresa) {
        return res.status(400).json({ message: 'No tiene un perfil de empresa asociado' });
      }
      body.empresa_id = empresa.id;
    } else if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'No autorizado para crear ofertas' });
    }

    const offer = await jobOfferService.create(body);

    // --- NOTIFICAR A TODOS LOS EGRESADOS ---
    await notificationService.notifyAllGraduates(
      `Nueva oferta laboral: ${offer.titulo} en ${offer.empresa?.nombre || 'una empresa'}`,
      `/offers/${offer.id}`
    );

    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const existing = await jobOfferService.findById(id);

    if (req.user.rol !== 'ADMIN') {
      if (req.user.rol === 'EMPRESA') {
        const empresa = await prisma.empresa.findUnique({
          where: { usuario_id: req.user.id },
          select: { id: true },
        });
        if (!empresa || empresa.id !== existing.empresa_id) {
          return res.status(403).json({ message: 'No autorizado para modificar esta oferta' });
        }
      } else {
        return res.status(403).json({ message: 'No autorizado' });
      }
    }

    const updated = await jobOfferService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const existing = await jobOfferService.findById(id);

    if (req.user.rol !== 'ADMIN') {
      if (req.user.rol === 'EMPRESA') {
        const empresa = await prisma.empresa.findUnique({
          where: { usuario_id: req.user.id },
          select: { id: true },
        });
        if (!empresa || empresa.id !== existing.empresa_id) {
          return res.status(403).json({ message: 'No autorizado' });
        }
      } else {
        return res.status(403).json({ message: 'No autorizado' });
      }
    }

    await jobOfferService.delete(id);
    res.json({ message: 'Oferta eliminada' });
  } catch (error) {
    next(error);
  }
};

export const toggleActive = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const existing = await jobOfferService.findById(id);

    if (req.user.rol !== 'ADMIN') {
      if (req.user.rol === 'EMPRESA') {
        const empresa = await prisma.empresa.findUnique({
          where: { usuario_id: req.user.id },
          select: { id: true },
        });
        if (!empresa || empresa.id !== existing.empresa_id) {
          return res.status(403).json({ message: 'No autorizado' });
        }
      } else {
        return res.status(403).json({ message: 'No autorizado' });
      }
    }

    const { activa } = req.body;
    const updated = await jobOfferService.toggleActive(id, activa);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};