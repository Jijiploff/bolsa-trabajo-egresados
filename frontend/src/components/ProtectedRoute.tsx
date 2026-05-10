import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/layout/LoadingScreen';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirige al dashboard de su rol
    const redirectMap: Record<string, string> = {
      ADMIN: '/admin',
      EGRESADO: '/graduate',
      EMPRESA: '/company',
    };
    return <Navigate to={redirectMap[user.rol] || '/login'} replace />;
  }

  return <>{children}</>;
};