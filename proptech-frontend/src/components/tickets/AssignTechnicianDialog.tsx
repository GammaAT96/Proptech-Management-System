import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { getTechnicians } from '@/api/users.api';
import { assignTechnician } from '@/api/tickets.api';
import type { MaintenanceTicket } from '@/types/ticket.types';
import type { User } from '@/types/user.types';

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: MaintenanceTicket;
  onAssigned: (ticket: MaintenanceTicket) => void;
}

export const AssignTechnicianDialog: React.FC<AssignTechnicianDialogProps> = ({
  open,
  onOpenChange,
  ticket,
  onAssigned,
}) => {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTechnicians();
        setTechnicians(data);
        setSelectedId(ticket.assignedTechnicianId ?? '');
      } catch (err) {
        console.error(err);
        setError('Failed to load technicians');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, ticket.assignedTechnicianId]);

  const handleAssign = async () => {
    if (!selectedId) {
      setError('Please select a technician');
      return;
    }
    try {
      setAssigning(true);
      setError(null);
      const updated = await assignTechnician(ticket.id, { technicianId: selectedId });
      toast.success('Technician assigned');
      onAssigned(updated);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError('Failed to assign technician');
      toast.error('Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>Assign a technician to: {ticket.title}</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-2">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="space-y-4 py-2">
          {loading ? (
            <Loader message="Loading technicians..." />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="technician">Select Technician</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Choose a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{tech.username}</span>
                        <span className="text-xs text-muted-foreground">{tech.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={assigning || loading}>
            {assigning ? 'Assigning...' : 'Assign Technician'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

