import React, { useEffect, useMemo, useState } from 'react';
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
import { createUser, type CreateUserPayload } from '@/api/users.api';
import type { UserRole } from '@/types/user.types';
import { useAuth } from '@/hooks/useAuth';

interface CreateUserDialogProps {
  onCreated: () => void;
  children: React.ReactNode;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreated, children }) => {
  const { user } = useAuth();
  const currentRole = user?.role;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('TENANT');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedRoles: UserRole[] = useMemo(() => {
    if (currentRole === 'ADMIN') {
      return ['TENANT', 'TECHNICIAN', 'MANAGER', 'ADMIN'];
    }
    if (currentRole === 'MANAGER') {
      return ['TENANT', 'TECHNICIAN'];
    }
    return [];
  }, [currentRole]);

  useEffect(() => {
    if (open && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      setRole(allowedRoles[0]);
    }
  }, [open, allowedRoles, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!allowedRoles.includes(role)) {
      setError('You are not allowed to create this type of user');
      toast.error('You are not allowed to create this type of user');
      return;
    }
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Name, email and password (min 8 characters) are required');
      return;
    }
    try {
      setSubmitting(true);
      const payload: CreateUserPayload = { name: name.trim(), email: email.trim(), password, role };
      await createUser(payload);
      toast.success('User created');
      setOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('TENANT');
      onCreated();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'EMAIL_TAKEN'
          ? 'Email already in use'
          : 'Failed to create user'
        : 'Failed to create user';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Create a new user account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="user-password">Password</Label>
            <Input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              required
            />
          </div>
          <div>
            <Label htmlFor="user-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger id="user-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r === 'TENANT' && 'Tenant'}
                    {r === 'TECHNICIAN' && 'Technician'}
                    {r === 'MANAGER' && 'Manager'}
                    {r === 'ADMIN' && 'Admin'}
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
