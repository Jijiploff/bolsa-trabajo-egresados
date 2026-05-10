import { z } from 'zod';

export const createCompanySchema = z.object({
  usuario_id: z.number().int().positive('ID de usuario requerido'),
  nombre: z.string().min(1, 'Nombre de la empresa requerido'),
  descripcion: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  tamanio: z.string().optional().nullable(),
  ubicacion: z.string().optional().nullable(),
  sitio_web: z.string().url('URL inválida').optional().nullable(),
  logo_url: z.string().url('URL inválida').optional().nullable(),
});

export const updateCompanySchema = createCompanySchema.partial().omit({ usuario_id: true });

export const companyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  nombre: z.string().optional(),
  sector: z.string().optional(),
  ubicacion: z.string().optional(),
});