import type { AssignTechnicianInput, CreateTicketInput, UpdateStatusInput } from "./ticket.schema.js";
export declare const createTicket: (input: CreateTicketInput) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
}>;
export declare const listTickets: (page?: number, limit?: number) => Promise<{
    items: {
        status: import("@prisma/client").$Enums.ticket_status;
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.ticket_priority;
        tenantId: string;
        technicianId: string | null;
        propertyId: string;
    }[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export declare const listTicketsForManager: (managerId: string, page?: number, limit?: number) => Promise<{
    items: {
        status: import("@prisma/client").$Enums.ticket_status;
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        priority: import("@prisma/client").$Enums.ticket_priority;
        tenantId: string;
        technicianId: string | null;
        propertyId: string;
    }[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export declare const listTicketsForTechnician: (technicianId: string) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
}[]>;
export declare const listTicketsForTenant: (tenantId: string) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
}[]>;
export declare const getTicketById: (id: string) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
    ticketimage: {
        id: string;
        url: string;
    }[];
} | null>;
export declare const assignTechnician: (ticketId: string, input: AssignTechnicianInput) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
} | null>;
export declare const updateTicketStatus: (ticketId: string, input: UpdateStatusInput & {
    actorId: string;
}) => Promise<{
    status: import("@prisma/client").$Enums.ticket_status;
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    priority: import("@prisma/client").$Enums.ticket_priority;
    tenantId: string;
    technicianId: string | null;
    propertyId: string;
} | null>;
//# sourceMappingURL=ticket.service.d.ts.map