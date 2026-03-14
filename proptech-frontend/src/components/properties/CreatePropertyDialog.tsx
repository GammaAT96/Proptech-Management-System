import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProperty, type CreatePropertyPayload } from '@/api/properties.api';
import { getUsers } from '@/api/users.api';
import type { User } from '@/types/user.types';

interface CreatePropertyDialogProps {
  onCreated: () => void;
  children: React.ReactNode;
}

export const CreatePropertyDialog: React.FC<CreatePropertyDialogProps> = ({ onCreated, children }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [units, setUnits] = useState<number>(5);
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getUsers()
        .then((users) => setManagers(users.filter((u) => u.role === 'MANAGER')))
        .catch(() => setManagers([]));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !address.trim() || !managerId) {
      setError('Name, address and manager are required');
      return;
    }
    try {
      setSubmitting(true);
      const payload: CreatePropertyPayload = { name: name.trim(), address: address.trim(), units, managerId };
      await createProperty(payload);
      toast.success('Property created');
      setOpen(false);
      setName('');
      setAddress('');
      setUnits(5);
      setManagerId('');
      onCreated();
    } catch (err) {
      console.error(err);
      setError('Failed to create property');
      toast.error('Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>Create a new property and assign a manager</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Label htmlFor="prop-name">Name</Label>
            <Input
              id="prop-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunset Apartments"
              required
            />
          </div>
          <div>
            <Label htmlFor="prop-address">Address</Label>
            <Input
              id="prop-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Main Street"
              required
            />
          </div>
          <div>
            <Label htmlFor="prop-units">Units</Label>
            <Input
              id="prop-units"
              type="number"
              min={1}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <Label htmlFor="prop-manager">Manager</Label>
            <Select value={managerId} onValueChange={setManagerId}>
              <SelectTrigger id="prop-manager">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.username} ({m.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
