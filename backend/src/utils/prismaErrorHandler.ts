import { Prisma } from '@prisma/client';

interface PrismaErrorResponse {
  status: number;
  message: string;
}

export const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): PrismaErrorResponse => {
  switch (error.code) {
    case 'P2002':
      return {
        status: 409,
        message: 'Ya existe un registro con ese valor único',
      };
    case 'P2025':
      return {
        status: 404,
        message: 'Registro no encontrado',
      };
    case 'P2003':
      return {
        status: 400,
        message: 'Fallo en restricción de clave foránea',
      };
    default:
      return {
        status: 400,
        message: 'Error de base de datos',
      };
  }
};