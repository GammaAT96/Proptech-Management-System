import React, { useMemo, useState } from 'react';
import { IconSearch, IconMoreVertical, IconEye, IconEdit, IconUserPlus, IconPlus } from '@/components/icons/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeleton';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog';
import { AssignTechnicianDialog } from '@/components/tickets/AssignTechnicianDialog';
import { TicketDetailsPage } from '@/modules/tickets/TicketDetailsPage';
import type { MaintenanceTicket, TicketPriority, TicketStatus } from '@/types/ticket.types';

const getPriorityVariant = (priority: TicketPriority) => {
  switch (priority) {
    case 'URGENT':
      return 'destructive';
    case 'HIGH':
      return 'default';
    case 'MEDIUM':
      return 'secondary';
    case 'LOW':
    default:
      return 'outline';
  }
};

const getStatusClasses = (status: TicketStatus) => {
  switch (status) {
    case 'OPEN':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'DONE':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return '';
  }
};

export const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const { tickets, loading, error, setTickets } = useTickets();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [assignTicket, setAssignTicket] = useState<MaintenanceTicket | null>(null);

  const canCreateTicket = user?.role === 'TENANT';
  const isManager = user?.role === 'MANAGER';

  const visibleTickets = useMemo(() => {
    let list = tickets;

    if (user?.role === 'TENANT') {
      list = list.filter((t) => t.tenantId === user.id);
    } else if (user?.role === 'TECHNICIAN') {
      list = list.filter((t) => t.assignedTechnicianId === user.id);
    }

    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.propertyName ?? '').toLowerCase().includes(q),
      );
    }

    return list;
  }, [tickets, user, search, statusFilter]);

  const handleTicketCreated = (newTicket: MaintenanceTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleTicketUpdated = (updated: MaintenanceTicket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTicket(updated);
  };

  const handleTechnicianAssigned = (updated: MaintenanceTicket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setAssignTicket(null);
  };

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex-1 sm:w-auto">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          {canCreateTicket && (
            <CreateTicketDialog onCreated={handleTicketCreated}>
              <Button className="w-full sm:w-auto">
                <IconPlus className="mr-2 h-4 w-4 shrink-0" />
                New Ticket
              </Button>
            </CreateTicketDialog>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading && visibleTickets.length === 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Property</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : visibleTickets.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No tickets found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Property</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                    <TableHead className="hidden xl:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="max-w-[220px] truncate">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {ticket.propertyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.propertyName}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                            ticket.status,
                          )}`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {ticket.assignedTechnicianName || '-'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconMoreVertical className="h-4 w-4 shrink-0" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                              <IconEye className="mr-2 h-4 w-4 shrink-0" />
                              View Details
                            </DropdownMenuItem>
                            {isManager && (
                              <>
                                <DropdownMenuItem>
                                  <IconEdit className="mr-2 h-4 w-4 shrink-0" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setAssignTicket(ticket);
                                  }}
                                >
                                  <IconUserPlus className="mr-2 h-4 w-4 shrink-0" />
                                  Assign Technician
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.title}</DialogTitle>
              </DialogHeader>
              <TicketDetailsPage ticket={selectedTicket} onStatusUpdated={handleTicketUpdated} />
            </>
          )}
        </DialogContent>
      </Dialog>

      {assignTicket && (
        <AssignTechnicianDialog
          open={!!assignTicket}
          ticket={assignTicket}
          onOpenChange={(open) => !open && setAssignTicket(null)}
          onAssigned={handleTechnicianAssigned}
        />
      )}
    </div>
  );
};

