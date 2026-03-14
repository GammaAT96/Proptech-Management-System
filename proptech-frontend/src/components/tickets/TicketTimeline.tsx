import React, { useEffect, useState } from 'react';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { getTicketActivity } from '@/api/tickets.api';
import type { ActivityLog } from '@/types/ticket.types';
import { formatDateTime } from '@/utils/formatDate';

interface TicketTimelineProps {
  ticketId: string;
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticketId }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTicketActivity(ticketId);
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load ticket activity');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [ticketId]);

  if (loading && logs.length === 0) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (logs.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet</p>;
  }

  return (
    <div className="space-y-3">
      {logs.map((log, index) => (
        <div key={log.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary" />
            {index < logs.length - 1 && <div className="h-full w-px bg-border" />}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium">{log.action}</p>
            <p className="text-xs text-muted-foreground">
              by {log.performedBy} • {formatDateTime(log.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

