import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/common/Skeleton';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useProperties } from '@/hooks/useProperties';
import { formatDateTime } from '@/utils/formatDate';
import { getActivity, getMyActivity } from '@/api/activity.api';
import type { ActivityLog } from '@/types/ticket.types';

/** Inline SVG icons to avoid lucide-react forwardRef issues */
const IconTicket = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);
const IconAlertCircle = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);
const IconClock = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCheckCircle = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const IconBuilding = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
    <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tickets, loading, error } = useTickets();
  const { properties } = useProperties();
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const isTechnician = user?.role === 'TECHNICIAN';
   const isTenant = user?.role === 'TENANT';

  useEffect(() => {
    const useScopedActivity = isTechnician || isTenant;
    const fetchActivity = useScopedActivity ? () => getMyActivity(5) : () => getActivity(5);
    fetchActivity()
      .then(setRecentActivity)
      .catch(() => setRecentActivity([]))
      .finally(() => setActivityLoading(false));
  }, [isTechnician]);

  const stats = {
    total: tickets.length,
    open: isTechnician
      ? tickets.filter((t) => t.status === 'ASSIGNED').length
      : tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tickets.filter((t) => t.status === 'DONE').length,
    highPriority: tickets.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT').length,
  };

  const recentTickets = tickets.slice(0, 5);
  const showStatsSkeleton = loading && tickets.length === 0;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showStatsSkeleton ? (
          [...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isTechnician
                ? 'Total Assigned Tickets'
                : isTenant
                  ? 'My Requests'
                  : 'Total Tickets'}
            </CardTitle>
            <IconTicket className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isTechnician
                ? 'Tickets assigned to you'
                : isTenant
                  ? 'Maintenance requests you created'
                  : 'All maintenance requests'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isTechnician
                ? 'Open Tasks'
                : isTenant
                  ? 'Open Requests'
                  : 'Open Tickets'}
            </CardTitle>
            <IconAlertCircle className="h-4 w-4 text-orange-500 shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {isTechnician
                ? 'Awaiting start'
                : isTenant
                  ? 'Awaiting processing'
                  : 'Awaiting assignment'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <IconClock className="h-4 w-4 text-blue-500 shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="mt-1 text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconCheckCircle className="h-4 w-4 text-green-500 shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="mt-1 text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {isTechnician
                ? 'Updates on your assigned tickets'
                : isTenant
                  ? 'Updates on your tickets'
                  : 'Latest updates on maintenance tickets'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </>
              ) : recentActivity.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No recent activity</p>
              ) : (
                recentActivity.map((log, index) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {index < recentActivity.length - 1 && <div className="h-full w-px bg-border" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {log.performedBy} • {formatDateTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>
              {isTechnician
                ? 'My Latest Tasks'
                : isTenant
                  ? 'My Latest Requests'
                  : 'Latest Tickets'}
            </CardTitle>
            <CardDescription>
              {isTechnician
                ? 'Your most recent assigned tickets'
                : isTenant
                  ? 'Your most recent maintenance requests'
                  : 'Most recent maintenance requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showStatsSkeleton ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No tickets yet</p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="max-w-[200px] truncate text-sm font-medium">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">
                        <IconBuilding className="mr-1 inline h-3 w-3" />
                        {ticket.propertyName ?? properties.find((p) => p.id === ticket.propertyId)?.name}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : ticket.priority === 'HIGH'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

