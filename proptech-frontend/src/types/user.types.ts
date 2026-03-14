export type UserRole = 'TENANT' | 'MANAGER' | 'TECHNICIAN' | 'ADMIN';

export interface Technician {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  propertyId?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

