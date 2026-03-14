import { api } from './axios';
import type { ActivityLog } from '../types/ticket.types';

interface BackendActivityItem {
  id: string;
  action: string;
  createdAt: string;
  ticketId: string;
  userId: string;
  user: { id: string; name: string; role: string };
  ticket: {
    id: string;
    title: string;
    propertyId: string;
    property: { name: string };
  };
}

function mapToActivityLog(item: BackendActivityItem): ActivityLog {
  return {
    id: item.id,
    ticketId: item.ticketId,
    action: item.action,
    performedBy: item.user?.name ?? '—',
    timestamp: item.createdAt,
  };
}

export const getActivity = async (limit = 50): Promise<ActivityLog[]> => {
  const res = await api.get<BackendActivityItem[]>('/activity', {
    params: { limit },
  });
  return res.data.map(mapToActivityLog);
};

export const getMyActivity = async (limit = 50): Promise<ActivityLog[]> => {
  const res = await api.get<BackendActivityItem[]>('/activity/my', {
    params: { limit },
  });
  return res.data.map(mapToActivityLog);
};
