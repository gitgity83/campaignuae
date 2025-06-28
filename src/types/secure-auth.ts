
import { User, UserRole, UserStatus } from './auth';

export interface SecureUser extends Omit<User, 'id'> {
  id: string;
  passwordHash: string;
  passwordSalt: string;
  sessionToken?: string;
  sessionExpiry?: string;
  loginAttempts: number;
  lockedUntil?: string;
  tokenExpiry?: string;
}

export interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  ip?: string;
}

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDurationMs: number;
  sessionExpiryHours: number;
  tokenExpiryHours: number;
  passwordMinLength: number;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes
  sessionExpiryHours: 24,
  tokenExpiryHours: 48,
  passwordMinLength: 8
};
