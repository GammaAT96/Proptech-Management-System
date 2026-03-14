import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { TicketTimeline } from '@/components/tickets/TicketTimeline';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Loader } from '@/components/common/Loader';
import { updateTicketStatus, getTicket, uploadTicketImage } from '@/api/tickets.api';
import type { MaintenanceTicket, TicketStatus } from '@/types/ticket.types';

interface TicketDetailsPageProps {
  ticket: MaintenanceTicket;
  onStatusUpdated: (ticket: MaintenanceTicket) => void;
}

export const TicketDetailsPage: React.FC<TicketDetailsPageProps> = ({
  ticket,
  onStatusUpdated,
}) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(ticket.imageUrls ?? []);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getTicket(ticket.id)
      .then((t) => setImageUrls(t.imageUrls ?? []))
      .catch(() => {});
  }, [ticket.id]);

  const canManageStatus =
    user &&
    (user.role === 'MANAGER' ||
      (user.role === 'TECHNICIAN' && ticket.assignedTechnicianId === user.id));

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateTicketStatus(ticket.id, { status });
      onStatusUpdated(updated);
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium">
          #{ticket.id}
        </span>
        <span className="inline-flex rounded-full bg-secondary px-2 py-1 text-xs font-medium">
          {ticket.priority}
        </span>
        <span className="inline-flex rounded-full bg-accent px-2 py-1 text-xs font-medium">
          {ticket.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
      </div>

      {(imageUrls.length > 0 || user) && (
        <div className="space-y-2">
          <Label>Images</Label>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded border border-border overflow-hidden w-24 h-24"
                >
                  <img src={url} alt="Ticket" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                disabled={uploadingImage}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setUploadingImage(true);
                    const { url } = await uploadTicketImage(ticket.id, file);
                    setImageUrls((prev) => [...prev, url]);
                  } catch (err) {
                    console.error(err);
                    setError('Failed to upload image');
                  } finally {
                    setUploadingImage(false);
                    e.target.value = '';
                  }
                }}
              />
              {uploadingImage && <span className="text-xs text-muted-foreground">Uploading...</span>}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Property</Label>
          <p className="text-sm">{ticket.propertyName}</p>
        </div>
        <div className="space-y-1">
          <Label>Tenant</Label>
          <p className="text-sm">{ticket.tenantName}</p>
        </div>
        <div className="space-y-1">
          <Label>Assigned Technician</Label>
          <p className="text-sm">{ticket.assignedTechnicianName ?? 'Not assigned'}</p>
        </div>
        <div className="space-y-1">
          <Label>Created</Label>
          <p className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {canManageStatus && (
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(value) => setStatus(value as TicketStatus)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {user?.role === 'TECHNICIAN'
                ? (() => {
                    const next: Record<TicketStatus, TicketStatus | null> = {
                      ASSIGNED: 'IN_PROGRESS',
                      IN_PROGRESS: 'DONE',
                      DONE: null,
                      OPEN: null,
                    };
                    const options = [ticket.status];
                    if (next[ticket.status]) options.push(next[ticket.status]!);
                    return (
                      <>
                        {options.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s === 'OPEN' && 'Open'}
                            {s === 'ASSIGNED' && 'Assigned'}
                            {s === 'IN_PROGRESS' && 'In Progress'}
                            {s === 'DONE' && 'Done'}
                          </SelectItem>
                        ))}
                      </>
                    );
                  })()
                : (
                  <>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </>
                )}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleUpdateStatus} disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <Label>Activity Timeline</Label>
        <React.Suspense fallback={<Loader />}>
          <TicketTimeline ticketId={ticket.id} />
        </React.Suspense>
      </div>
    </div>
  );
};

