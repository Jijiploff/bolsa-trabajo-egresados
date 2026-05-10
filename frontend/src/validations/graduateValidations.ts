import { z } from 'zod';

export const formacionSchema = z.object({
  institucion: z.string().min(1, 'Institución requerida'),
  titulo: z.string().min(1, 'Título requerido'),
  nivel: z.enum(['PREGRADO', 'POSTGRADO', 'DIPLOMADO', 'MAESTRIA', 'DOCTORADO', 'CURSO']),
  anio_inicio: z.number().int().optional().nullable(),
  anio_fin: z.number().int().optional().nullable(),
  descripcion: z.string().optional().nullable(),
});

export const experienciaSchema = z.object({
  empresa: z.string().min(1, 'Empresa requerida'),
  cargo: z.string().min(1, 'Cargo requerido'),
  fecha_inicio: z.string().min(1, 'Fecha inicio requerida'),
  fecha_fin: z.string().optional().nullable(),
  descripcion: z.string().optional().nullable(),
  actual_trabajo: z.boolean().optional().default(false),
});

export const habilidadEgresadoSchema = z.object({
  habilidad_id: z.number().int().positive('Seleccione una habilidad'),
  nivel: z.number().int().min(1).max(5).optional().nullable(),
});

export const graduateSchema = z.object({
  nombres: z.string().min(1, 'Nombres requeridos'),
  apellidos: z.string().min(1, 'Apellidos requeridos'),
  fecha_nacimiento: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  pais: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  foto_url: z.string().url('URL inválida').optional().nullable(),
  cv_url: z.string().url('URL inválida').optional().nullable(),
  linkedin_url: z.string().url('URL inválida').optional().nullable(),
  github_url: z.string().url('URL inválida').optional().nullable(),
  titulo: z.string().optional().nullable(),
  universidad: z.string().optional().nullable(),
  carrera_id: z.number().int().positive('Carrera requerida').optional().nullable(),
  anio_egreso: z.number().int().min(1900).max(2100).optional().nullable(),
  descripcion_personal: z.string().optional().nullable(),
  formacion_academica: z.array(formacionSchema).optional().default([]),
  experiencia_laboral: z.array(experienciaSchema).optional().default([]),
  habilidades: z.array(habilidadEgresadoSchema).optional().default([]),
});

export type GraduateFormData = z.infer<typeof graduateSchema>;