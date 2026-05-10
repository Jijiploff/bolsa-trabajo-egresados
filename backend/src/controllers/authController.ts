import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rol } = req.body;
    const result = await authService.register(email, password, rol);
    // Configurar cookie JWT automáticamente después del registro
    res.cookie('token', result.token, authService.getCookieOptions());
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie('token', result.token, authService.getCookieOptions());
    return res.json({
      message: 'Inicio de sesión exitoso',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  return res.json({ message: 'Sesión cerrada correctamente' });
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};