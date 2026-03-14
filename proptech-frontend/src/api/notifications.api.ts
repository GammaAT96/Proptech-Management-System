import { api } from './axios';
import type { Notification } from '../types/notification.types';

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const res = await api.get<Notification[]>(`/notifications`, {
    params: { userId },
  });
  return res.data;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const res = await api.patch<Notification>(`/notifications/${id}/read`, {});
  return res.data;
};

