import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const habilidades = await prisma.habilidad.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(habilidades);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { nombre, tipo } = req.body;
    // Verificar si ya existe
    const existente = await prisma.habilidad.findUnique({ where: { nombre } });
    if (existente) {
      return res.status(409).json({ message: 'La habilidad ya existe', habilidad: existente });
    }
    const nueva = await prisma.habilidad.create({
      data: { nombre, tipo },
    });
    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
};