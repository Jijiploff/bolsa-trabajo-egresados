import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';
import { env } from '../config/env';
import { CookieOptions } from 'express';

class AuthService {
  async register(email: string, password: string, rolNombre: string) {
    // Validar que el rol exista y no sea ADMIN (no se permite registro público de admin)
    const rol = await prisma.rol.findUnique({ where: { nombre: rolNombre as any } });
    if (!rol) {
      const error = new Error('Rol no válido');
      (error as any).statusCode = 400;
      throw error;
    }
    if (rolNombre === 'ADMIN') {
      const error = new Error('No se permite el registro de administradores por esta vía');
      (error as any).statusCode = 403;
      throw error;
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error('El correo ya está registrado');
      (error as any).statusCode = 409;
      throw error;
    }

    const passwordHash = await hashPassword(password);
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password_hash: passwordHash,
        rol_id: rol.id,
      },
      select: {
        id: true,
        email: true,
        rol: { select: { nombre: true } },
        activo: true,
        creado_en: true,
      },
    });

    const token = generateToken({ userId: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol.nombre });

    return {
      token,
      user: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol.nombre,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true },
    });

    if (!user || !user.activo) {
      const error = new Error('Credenciales inválidas');
      (error as any).statusCode = 401;
      throw error;
    }

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      const error = new Error('Credenciales inválidas');
      (error as any).statusCode = 401;
      throw error;
    }

    const token = generateToken({ userId: user.id, email: user.email, rol: user.rol.nombre });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol.nombre,
      },
    };
  }

  getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  }
}

export const authService = new AuthService();