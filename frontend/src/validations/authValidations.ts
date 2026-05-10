import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const registerSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe tener al menos una mayúscula').regex(/[0-9]/, 'Debe tener al menos un número'),
  rol: z.enum(['EGRESADO', 'EMPRESA'], { message: 'Rol inválido' }),
});