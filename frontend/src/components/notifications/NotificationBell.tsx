import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationList from './NotificationList';

export default function NotificationBell() {
  const { unreadCount, fetchNotifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (!open) {
      fetchNotifications(); // carga la lista al abrir
    }
    setOpen(!open);
  };

  // Cerrar al hacer clic fuera (opcional)
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-panel-container')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="notification-panel-container relative">
      <button
        onClick={handleToggle}
        className="relative text-muted-foreground hover:text-primary transition-colors"
        title="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-[70vh] overflow-hidden flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notificaciones</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            <NotificationList onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}