import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsConfig } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import graduateRoutes from './routes/graduateRoutes';
import companyRoutes from './routes/companyRoutes';
import jobOfferRoutes from './routes/jobOfferRoutes';
import applicationRoutes from './routes/applicationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import reportRoutes from './routes/reportRoutes';
import carreraRoutes from './routes/carreraRoutes';
import habilidadRoutes from './routes/habilidadRoutes';

export const app = express();

app.set('trust proxy', 1);

// Seguridad
app.use(helmet());
app.use(corsConfig);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/graduates', graduateRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/job-offers', jobOfferRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/carreras', carreraRoutes);
app.use('/api/habilidades', habilidadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Manejo global de errores
app.use(errorHandler);