import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info('Sesión cerrada');
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-primary">
          Bolsa de Trabajo
        </Link>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user?.rol === 'ADMIN' ? 'Administrador' : user?.rol === 'EMPRESA' ? 'Empresa' : 'Egresado'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="text-sm hidden md:block">{user?.email}</div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={16} className="mr-1" /> Salir
        </Button>
      </div>
    </header>
  );
}