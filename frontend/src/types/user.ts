export interface Usuario {
  id: number;
  email: string;
  rol: 'ADMIN' | 'EGRESADO' | 'EMPRESA';
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  rol: 'EGRESADO' | 'EMPRESA';
}

export interface AuthResponse {
  message: string;
  user: Usuario;
}