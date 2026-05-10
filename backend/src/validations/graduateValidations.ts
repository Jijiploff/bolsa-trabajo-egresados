import { z } from 'zod';

export const createGraduateSchema = z.object({
  usuario_id: z.number().int().positive('ID de usuario requerido'), // Admin puede asignar usuario
  nombres: z.string().min(1, 'Nombres requeridos'),
  apellidos: z.string().min(1, 'Apellidos requeridos'),
  fecha_nacimiento: z.string().datetime().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  pais: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  foto_url: z.string().url().optional().nullable(),
  cv_url: z.string().url().optional().nullable(),
  linkedin_url: z.string().url().optional().nullable(),
  github_url: z.string().url().optional().nullable(),
  titulo: z.string().optional().nullable(),
  universidad: z.string().optional().nullable(),
  carrera_id: z.number().int().positive().optional().nullable(),
  anio_egreso: z.number().int().min(1900).max(2100).optional().nullable(),
  descripcion_personal: z.string().optional().nullable(),
  formacion_academica: z.array(
    z.object({
      institucion: z.string().min(1),
      titulo: z.string().min(1),
      nivel: z.enum(['PREGRADO', 'POSTGRADO', 'DIPLOMADO', 'MAESTRIA', 'DOCTORADO', 'CURSO']),
      anio_inicio: z.number().int().optional().nullable(),
      anio_fin: z.number().int().optional().nullable(),
      descripcion: z.string().optional().nullable(),
    })
  ).optional().default([]),
  experiencia_laboral: z.array(
    z.object({
      empresa: z.string().min(1),
      cargo: z.string().min(1),
      fecha_inicio: z.string().datetime(),
      fecha_fin: z.string().datetime().optional().nullable(),
      descripcion: z.string().optional().nullable(),
      actual_trabajo: z.boolean().optional().default(false),
    })
  ).optional().default([]),
  habilidades: z.array(
    z.object({
      habilidad_id: z.number().int().positive(),
      nivel: z.number().int().min(1).max(5).optional(),
    })
  ).optional().default([]),
});

export const updateGraduateSchema = createGraduateSchema.partial().omit({ usuario_id: true });

export const graduateQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  nombre: z.string().optional(),
  carrera_id: z.coerce.number().int().optional(),
  habilidad_id: z.coerce.number().int().optional(),
  anio_egreso: z.coerce.number().int().optional(),
  ciudad: z.string().optional(),
});