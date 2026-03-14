import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { getActivity } from '@/api/activity.api';
import type { ActivityLog } from '@/types/ticket.types';
import { formatDateTime } from '@/utils/formatDate';

export const ActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActivity(100)
      .then(setLogs)
      .catch((err) => {
        console.error(err);
        setError('Failed to load activity logs');
      })
      .finally(() => setLoading(false));
  }, []);

  const showLoader = loading && logs.length === 0;

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Complete history of all maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          {showLoader ? (
            <Loader />
          ) : logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activity logs available
            </p>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {index < logs.length - 1 && <div className="h-full w-px bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      Ticket #{log.ticketId} • by {log.performedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

