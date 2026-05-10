import { z } from 'zod';

export const createJobOfferSchema = z.object({
  empresa_id: z.number().int().positive('ID de empresa requerido'),
  titulo: z.string().min(1, 'Título requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  salario_min: z.number().nonnegative().optional().nullable(),
  salario_max: z.number().nonnegative().optional().nullable(),
  modalidad: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
  ubicacion: z.string().optional().nullable(),
  requisitos: z.string().optional().nullable(),
  fecha_cierre: z.string().datetime().optional().nullable(),
  habilidades: z.array(
    z.object({
      habilidad_id: z.number().int().positive(),
    })
  ).optional().default([]),
});

export const updateJobOfferSchema = createJobOfferSchema.partial().omit({ empresa_id: true });

export const jobOfferQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  titulo: z.string().optional(),
  modalidad: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']).optional(),
  ubicacion: z.string().optional(),
  salario_min: z.coerce.number().nonnegative().optional(),
  salario_max: z.coerce.number().nonnegative().optional(),
  activa: z.coerce.boolean().optional(),
});