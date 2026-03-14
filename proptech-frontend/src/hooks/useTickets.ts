import { useEffect, useState } from 'react';
import type { MaintenanceTicket } from '../types/ticket.types';
import { getTickets, getMyTickets, getManagedTickets } from '../api/tickets.api';
import { useAuth } from './useAuth';

export const useTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: MaintenanceTicket[];
      if (!user) {
        data = await getTickets();
      } else if (user.role === 'TECHNICIAN' || user.role === 'TENANT') {
        data = await getMyTickets();
      } else if (user.role === 'MANAGER') {
        data = await getManagedTickets();
      } else {
        data = await getTickets();
      }
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.role]);

  return { tickets, loading, error, refetch: fetchTickets, setTickets };
};

