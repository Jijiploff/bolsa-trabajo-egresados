import { Request, Response, NextFunction } from 'express';
import { companyService } from '../services/companyService';
import { AuthRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/database';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await companyService.findAll(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const company = await companyService.findById(id);
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    // Solo ADMIN puede crear empresas directamente, una EMPRESA puede crear su propio perfil
    const body = req.body;
    if (req.user.rol === 'EMPRESA') {
      body.usuario_id = req.user.id;
    } else if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    const empresa = await companyService.create(body);
    res.status(201).json(empresa);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const id = parseInt(req.params.id as string);
    const existing = await companyService.findById(id);
    if (req.user.rol !== 'ADMIN' && existing.usuario_id !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    const updated = await companyService.update(id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.rol !== 'ADMIN') {
      return res.status(403).json({ message: 'Solo administradores pueden eliminar empresas' });
    }
    const id = parseInt(req.params.id as string);
    await companyService.delete(id);
    res.json({ message: 'Empresa eliminada' });
  } catch (error) {
    next(error);
  }
};

export const getMyCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    const empresa = await prisma.empresa.findUnique({
      where: { usuario_id: req.user.id },
      include: {
        usuario: { select: { id: true, email: true, activo: true } },
        _count: { select: { ofertas: true } },
      },
    });
    if (!empresa) return res.status(404).json({ message: 'Perfil de empresa no encontrado' });
    res.json(empresa);
  } catch (error) {
    next(error);
  }
};