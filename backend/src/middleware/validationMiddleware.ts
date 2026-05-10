import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Middleware para validar body, query o params con un esquema Zod
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      // Reemplazar los datos validados en el request
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Error de validación',
          errors: error.errors.map((e) => ({
            campo: e.path.join('.'),
            mensaje: e.message,
          })),
        });
      }
      next(error);
    }
  };
};