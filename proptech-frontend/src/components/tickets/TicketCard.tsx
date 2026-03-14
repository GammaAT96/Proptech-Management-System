import React from 'react';
import { IconBuilding, IconClock } from '@/components/icons/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MaintenanceTicket } from '@/types/ticket.types';

interface TicketCardProps {
  ticket: MaintenanceTicket;
  onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const priorityVariant =
    ticket.priority === 'URGENT'
      ? 'destructive'
      : ticket.priority === 'HIGH'
      ? 'default'
      : 'secondary';

  return (
    <Card className="cursor-pointer hover:shadow-md" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{ticket.title}</h3>
              <Badge variant={priorityVariant}>{ticket.priority}</Badge>
            </div>
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {ticket.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconBuilding className="h-3 w-3 shrink-0" />
                {ticket.propertyName}
              </span>
              <span className="flex items-center gap-1">
                <IconClock className="h-3 w-3 shrink-0" />
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="whitespace-nowrap">
            {ticket.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

