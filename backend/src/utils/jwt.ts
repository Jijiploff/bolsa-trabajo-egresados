import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

interface TokenPayload {
  userId: number;
  email: string;
  rol: string;
}

const signOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as any, // forzamos tipo para compatibilidad con la versión de tipos
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, signOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};