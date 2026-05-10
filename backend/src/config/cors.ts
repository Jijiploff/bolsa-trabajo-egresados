import cors from 'cors';
import { env } from './env';

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin
    if (!origin) {
      return callback(null, true);
    }

    // Dominio principal
    if (origin === env.FRONTEND_URL) {
      return callback(null, true);
    }

    // Permitir previews de Vercel
    if (
      origin.includes('bolsa-trabajo-egresados') &&
      origin.includes('vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
});