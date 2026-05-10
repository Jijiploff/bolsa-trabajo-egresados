import { useContext } from 'react';
import { NotificationContext } from '@/store/NotificationContext';

export const useNotifications = () => useContext(NotificationContext);