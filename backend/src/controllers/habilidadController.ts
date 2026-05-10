import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

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