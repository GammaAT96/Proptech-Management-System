import type { User } from './user.types';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'DONE';

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  /** URLs of images attached to this ticket (from GET /tickets/:id or after upload) */
  imageUrls?: string[];
  priority: TicketPriority;
  status: TicketStatus;
  tenantId: string;
  tenantName?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  propertyId: string;
  propertyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  ticketId: string;
  action: string;
  performedBy: string;
  timestamp: string;
}

export interface AssignTechnicianPayload {
  technicianId: string;
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus;
}

