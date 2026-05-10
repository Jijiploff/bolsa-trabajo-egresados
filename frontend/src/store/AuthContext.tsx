import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { Usuario, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<Usuario>;
  register: (data: RegisterRequest) => Promise<Usuario>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: LoginRequest): Promise<Usuario> => {
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      setUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (data: RegisterRequest): Promise<Usuario> => {
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      setUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrarse';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignorar errores de red
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};