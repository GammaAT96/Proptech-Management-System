import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';
import { useTickets } from '@/hooks/useTickets';
import { useProperties } from '@/hooks/useProperties';
import { updateTicketStatus } from '@/api/tickets.api';
import type { MaintenanceTicket, TicketStatus } from '@/types/ticket.types';

const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  ASSIGNED: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: null,
  OPEN: null,
};

export const MyTasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, loading, error, refetch } = useTickets();
  const { properties } = useProperties();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const isTechnician = user?.role === 'TECHNICIAN';
  const technicianTickets = isTechnician ? tickets : [];

  const handleStatusChange = async (ticket: MaintenanceTicket, status: TicketStatus) => {
    try {
      setUpdatingId(ticket.id);
      setUpdateError(null);
      await updateTicketStatus(ticket.id, { status });
      refetch();
    } catch (err) {
      console.error(err);
      setUpdateError('Failed to update ticket status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAction = (ticket: MaintenanceTicket) => {
    const next = NEXT_STATUS[ticket.status];
    if (next) handleStatusChange(ticket, next);
  };

  if (!isTechnician) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          You must be logged in as a technician to view this page.
        </CardContent>
      </Card>
    );
  }

  const showLoader = loading && tickets.length === 0;
  const priorityVariant = (p: string) =>
    p === 'URGENT' ? 'destructive' : p === 'HIGH' ? 'default' : 'secondary';

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {updateError && <ErrorMessage message={updateError} />}

      <Card>
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
          <CardDescription>Maintenance tickets assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {showLoader ? (
            <Loader />
          ) : technicianTickets.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No tasks assigned yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicianTickets.map((ticket) => {
                    const propertyName =
                      ticket.propertyName ?? properties.find((p) => p.id === ticket.propertyId)?.name ?? '-';
                    const next = NEXT_STATUS[ticket.status];
                    const actionLabel =
                      ticket.status === 'ASSIGNED'
                        ? 'Start'
                        : ticket.status === 'IN_PROGRESS'
                          ? 'Complete'
                          : null;
                    return (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{ticket.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{propertyName}</TableCell>
                        <TableCell>
                          <Badge variant={priorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                        </TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell className="text-right" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          {actionLabel && (
                            <Button
                              size="sm"
                              disabled={updatingId === ticket.id}
                              onClick={() => handleAction(ticket)}
                            >
                              {updatingId === ticket.id ? 'Updating...' : actionLabel}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

