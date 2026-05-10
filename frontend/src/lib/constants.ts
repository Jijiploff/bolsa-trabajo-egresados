export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  EGRESADO: 'EGRESADO',
  EMPRESA: 'EMPRESA',
} as const;

export const ESTADOS_POSTULACION = {
  POSTULADO: 'POSTULADO',
  REVISION: 'REVISION',
  ENTREVISTA: 'ENTREVISTA',
  CONTRATADO: 'CONTRATADO',
  RECHAZADO: 'RECHAZADO',
} as const;

export const MODALIDADES_OFERTA = {
  PRESENCIAL: 'PRESENCIAL',
  REMOTO: 'REMOTO',
  HIBRIDO: 'HIBRIDO',
} as const;

// Transiciones válidas según estado actual
export const VALID_TRANSITIONS: Record<string, string[]> = {
  POSTULADO: ['REVISION', 'RECHAZADO'],
  REVISION: ['ENTREVISTA', 'RECHAZADO'],
  ENTREVISTA: ['CONTRATADO', 'RECHAZADO'],
  CONTRATADO: [],
  RECHAZADO: [],
};