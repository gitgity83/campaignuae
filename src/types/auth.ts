
export type UserRole = 'admin' | 'supervisor' | 'volunteer';
export type UserStatus = 'active' | 'pending_approval' | 'inactive';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: string;
  lastLogin: string;
  createdBy?: string;
  registrationToken?: string;
  passwordSet: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface RegistrationData {
  token: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
