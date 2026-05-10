import { z } from 'zod';

export const jobOfferSchema = z.object({
  titulo: z.string().min(1, 'Título requerido'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  salario_min: z.number().nonnegative('Debe ser >= 0').optional().nullable(),
  salario_max: z.number().nonnegative('Debe ser >= 0').optional().nullable(),
  modalidad: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
  ubicacion: z.string().optional().nullable(),
  requisitos: z.string().optional().nullable(),
  fecha_cierre: z.string().optional().nullable(),
  habilidades: z.array(
    z.object({ habilidad_id: z.number().int().positive('Seleccione una habilidad') })
  ).optional().default([]),
});

export type JobOfferFormData = z.infer<typeof jobOfferSchema>;