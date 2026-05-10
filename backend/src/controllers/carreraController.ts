import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const carreras = await prisma.carrera.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(carreras);
  } catch (error) {
    next(error);
  }
};