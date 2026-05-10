import { z } from 'zod';

export const companySchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  tamanio: z.string().optional().nullable(),
  ubicacion: z.string().optional().nullable(),
  sitio_web: z.string().url('URL inválida').optional().nullable(),
  logo_url: z.string().url('URL inválida').optional().nullable(),
});

export type CompanyFormData = z.infer<typeof companySchema>;