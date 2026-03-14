import { api } from './axios';
import type { User } from '../types/user.types';

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface BackendLoginResponse {
  user: { id: string; name: string; email: string; role: string; createdAt: string };
  token: string;
}

interface BackendMeResponse {
  user: { userId: string; role: string };
}

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<BackendLoginResponse>('/auth/login', { email, password });
  const data = res.data;
  return {
    user: {
      id: data.user.id,
      username: data.user.name,
      email: data.user.email,
      role: data.user.role as User['role'],
    },
    accessToken: data.token,
  };
};

/** Validate token and return current user claims (id, role). Use for session restore. */
export const getMe = async (): Promise<{ user: Pick<User, 'id' | 'role'> }> => {
  const res = await api.get<BackendMeResponse>('/auth/me');
  const data = res.data;
  return {
    user: {
      id: data.user.userId,
      role: data.user.role as User['role'],
    },
  };
};

