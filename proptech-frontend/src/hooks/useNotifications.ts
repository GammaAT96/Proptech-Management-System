import { useEffect, useState } from 'react';
import { getNotifications } from '../api/notifications.api';
import type { Notification } from '../types/notification.types';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  return { notifications, loading, error, refetch: fetchNotifications, setNotifications };
};

