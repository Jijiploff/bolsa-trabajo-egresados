import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { handlePrismaError } from '../utils/prismaErrorHandler';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Datos inválidos',
      errors: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(err);
    return res.status(prismaError.status).json({ message: prismaError.message });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Error interno del servidor' });
};