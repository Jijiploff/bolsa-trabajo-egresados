import { z } from 'zod';

export const applicationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  estado: z.enum(['POSTULADO', 'REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO']).optional(),
  oferta_id: z.coerce.number().int().positive().optional(),
  egresado_id: z.coerce.number().int().positive().optional(),
});

export const changeStatusSchema = z.object({
  estado: z.enum(['POSTULADO', 'REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO']),
  comentario: z.string().optional().nullable(),
});