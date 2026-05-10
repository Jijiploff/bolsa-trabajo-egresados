import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // 👈 importamos el hook de autenticación
import { Button } from '@/components/ui/button';
import { Check, ExternalLink } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function NotificationList({ onClose }: Props) {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 obtenemos el usuario actual

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleNavigate = (url?: string | null) => {
    if (!url) return;

    // Si la URL es de una aplicación específica (obsoleta), redirigir a la lista según el rol
    if (url.startsWith('/applications/') || url === '/applications') {
      if (user?.rol === 'EGRESADO') {
        navigate('/graduate/applications');
      } else if (user?.rol === 'EMPRESA') {
        navigate('/company/applications');
      } else {
        // Admin no tiene página de postulaciones, redirigir a dashboard
        navigate('/admin');
      }
    } else {
      navigate(url);
    }
    onClose();
  };

  if (loading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Cargando...</div>;
  }

  if (notifications.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">No tienes notificaciones</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center p-2 border-b">
        <span className="text-xs text-muted-foreground">
          {notifications.filter((n) => !n.leida).length} sin leer
        </span>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          <Check size={14} className="mr-1" /> Marcar todas leídas
        </Button>
      </div>
      <ul className="divide-y">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
              !notif.leida ? 'bg-blue-50/50' : ''
            }`}
            onClick={() => {
              if (!notif.leida) handleMarkAsRead(notif.id);
              handleNavigate(notif.url);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm">{notif.mensaje}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notif.creada_en).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {!notif.leida && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                {notif.url && (
                  <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}