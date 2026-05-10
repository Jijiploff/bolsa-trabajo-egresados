import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Inicie sesión.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Verificar usuario activo y obtener su rol
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: { rol: true },
    });

    if (!user || !user.activo) {
      return res.status(401).json({ message: 'Usuario no encontrado o desactivado' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol.nombre,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Error de autenticación' });
  }
};