import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  DATABASE_URL: parsed.data.DATABASE_URL,
  JWT_SECRET: parsed.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsed.data.JWT_EXPIRES_IN,
  PORT: parsed.data.PORT,
  FRONTEND_URL: parsed.data.FRONTEND_URL,
  NODE_ENV: parsed.data.NODE_ENV,
};