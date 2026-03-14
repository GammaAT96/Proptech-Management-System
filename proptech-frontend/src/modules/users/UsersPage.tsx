import React, { useEffect, useState } from 'react';
import { IconSearch, IconMoreVertical, IconEdit, IconTrash } from '@/components/icons/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { getUsers, deleteUser } from '@/api/users.api';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import type { User, UserRole } from '@/types/user.types';

const getRoleVariant = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return 'default';
    case 'MANAGER':
      return 'default';
    case 'TECHNICIAN':
      return 'secondary';
    case 'TENANT':
    default:
      return 'outline';
  }
};

/** Managers can only edit/delete tenants and technicians; admins can manage anyone. */
const canManageUser = (
  currentUser: { role: string } | null | undefined,
  targetUser: User
): boolean => {
  if (!currentUser?.role) return false;
  if (currentUser.role === 'ADMIN') return true;
  if (currentUser.role === 'MANAGER') {
    return targetUser.role === 'TENANT' || targetUser.role === 'TECHNICIAN';
  }
  return false;
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { properties } = useProperties();
  const { user: currentUser } = useAuth();

  const canManageUsers = currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN';

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserUpdated = () => {
    fetchUsers();
    setEditOpen(false);
    setEditUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserTarget) return;
    try {
      setDeleting(true);
      await deleteUser(deleteUserTarget.id);
      setDeleteUserTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex-1 sm:w-auto">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="TECHNICIAN">Technician</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
            </SelectContent>
          </Select>
          {canManageUsers && (
            <CreateUserDialog onCreated={fetchUsers}>
              <Button>
                <span className="mr-2">+</span>
                Add User
              </Button>
            </CreateUserDialog>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading && users.length === 0 ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Property</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => {
                    const propertyName = u.propertyId
                      ? properties.find((p) => p.id === u.propertyId)?.name
                      : '-';
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{u.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.username}</p>
                              <p className="text-xs text-muted-foreground md:hidden">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{u.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                            {currentUser?.role === 'MANAGER' && u.role === 'ADMIN' && (
                              <span className="text-xs text-muted-foreground">🔒 System Account</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{propertyName}</TableCell>
                        <TableCell className="text-right">
                          {canManageUser(currentUser, u) ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <IconMoreVertical className="h-4 w-4 shrink-0" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setEditUser(u); setEditOpen(true); }}>
                                  <IconEdit className="mr-2 h-4 w-4 shrink-0" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteUserTarget(u)}
                                >
                                  <IconTrash className="mr-2 h-4 w-4 shrink-0" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : canManageUsers && (u.role === 'ADMIN' || u.role === 'MANAGER') ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled
                              title="Only admins can manage this account"
                              className="cursor-not-allowed opacity-60"
                            >
                              <IconMoreVertical className="h-4 w-4 shrink-0" />
                            </Button>
                          ) : null}
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

      <EditUserDialog
        user={editUser}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={handleUserUpdated}
      />

      <Dialog open={!!deleteUserTarget} onOpenChange={(open) => !open && setDeleteUserTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteUserTarget && `This will permanently delete ${deleteUserTarget.username}. This action cannot be undone.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

