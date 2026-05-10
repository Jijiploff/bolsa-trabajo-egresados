import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { Notificacion } from '@/types';
import { useAuth } from '@/hooks/useAuth'; // ✅ importamos el hook de autenticación

interface NotificationContextType {
  unreadCount: number;
  notifications: Notificacion[];
  loading: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // ✅ obtenemos el usuario actual

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return; // 🚫 no hacer nada si no hay sesión
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unread);
    } catch (err) {
      console.error('Error fetching unread count', err);
    }
  }, [user]);

  const fetchNotifications = useCallback(async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications?page=${page}&limit=50`);
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Polling cada 30 segundos SOLO si hay usuario
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, loading, fetchNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};