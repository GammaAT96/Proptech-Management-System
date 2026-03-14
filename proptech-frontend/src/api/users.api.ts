import { api } from './axios';
import type { User, UserRole } from '../types/user.types';

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

function toUser(b: BackendUser): User {
  return {
    id: b.id,
    username: b.name,
    email: b.email,
    role: b.role as UserRole,
  };
}

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<BackendUser[]>('/users');
  return res.data.map(toUser);
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get<BackendUser>(`/users/${id}`);
  return toUser(res.data);
};

export const getTechnicians = async (): Promise<User[]> => {
  const res = await api.get<BackendUser[]>('/users/technicians');
  return res.data.map(toUser);
};

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await api.post<BackendUser>('/users', payload);
  return toUser(res.data);
};

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<User> => {
  const res = await api.patch<BackendUser>(`/users/${id}`, payload);
  return toUser(res.data);
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

