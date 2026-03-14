import { api } from './axios';
import type {
  MaintenanceTicket,
  ActivityLog,
  AssignTechnicianPayload,
  UpdateTicketStatusPayload,
} from '../types/ticket.types';

interface BackendTicketWithImages extends Omit<MaintenanceTicket, 'imageUrls'> {
  ticketimage?: { id: string; url: string }[];
}

function mapTicketWithImages(t: BackendTicketWithImages): MaintenanceTicket {
  const base = api.defaults.baseURL ?? '';
  const imageUrls = t.ticketimage?.map((i) => (i.url.startsWith('http') ? i.url : `${base}${i.url}`)) ?? [];
  return { ...t, imageUrls };
}

function toMaintenanceTicket(t: Record<string, unknown>): MaintenanceTicket {
  const out = { ...t } as MaintenanceTicket & { technicianId?: string };
  out.assignedTechnicianId = out.technicianId ?? out.assignedTechnicianId;
  return out;
}

export const getTickets = async (): Promise<MaintenanceTicket[]> => {
  const res = await api.get<{ items: Record<string, unknown>[] } | Record<string, unknown>[]>('/tickets');
  const raw = Array.isArray(res.data) ? res.data : res.data.items ?? [];
  return raw.map(toMaintenanceTicket);
};

export const getManagedTickets = async (): Promise<MaintenanceTicket[]> => {
  const res = await api.get<{ items: Record<string, unknown>[] } | Record<string, unknown>[]>('/tickets', {
    // managers are automatically scoped on the backend via JWT in listTicketsHandler
  });
  const raw = Array.isArray(res.data) ? res.data : res.data.items ?? [];
  return raw.map(toMaintenanceTicket);
};

export const getMyTickets = async (): Promise<MaintenanceTicket[]> => {
  const res = await api.get<Record<string, unknown>[] | { items: Record<string, unknown>[] }>('/tickets/my');
  const raw = Array.isArray(res.data) ? res.data : (res.data as { items?: Record<string, unknown>[] }).items ?? [];
  return raw.map(toMaintenanceTicket);
};

export const getTicket = async (id: string): Promise<MaintenanceTicket> => {
  const res = await api.get<BackendTicketWithImages>(`/tickets/${id}`);
  return mapTicketWithImages(res.data);
};

export const createTicket = async (data: FormData): Promise<MaintenanceTicket> => {
  const res = await api.post<MaintenanceTicket>('/tickets', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateTicketStatus = async (
  id: string,
  payload: UpdateTicketStatusPayload,
): Promise<MaintenanceTicket> => {
  const res = await api.patch<MaintenanceTicket>(`/tickets/${id}/status`, payload);
  return res.data;
};

export const assignTechnician = async (
  id: string,
  payload: AssignTechnicianPayload,
): Promise<MaintenanceTicket> => {
  const res = await api.post<MaintenanceTicket>(`/tickets/${id}/assign`, payload);
  return res.data;
};

export const uploadTicketImage = async (id: string, file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post<{ id: string; url: string; ticketId: string }>(
    `/tickets/${id}/images`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  const base = api.defaults.baseURL ?? '';
  const url = res.data.url.startsWith('http') ? res.data.url : `${base}${res.data.url}`;
  return { url };
};

export const getTicketActivity = async (id: string): Promise<ActivityLog[]> => {
  const res = await api.get<ActivityLog[]>(`/tickets/${id}/activity`);
  return res.data;
};

