
import CryptoJS from 'crypto-js';

// Secure password hashing
export const hashPassword = (password: string, salt?: string): { hash: string; salt: string } => {
  const passwordSalt = salt || CryptoJS.lib.WordArray.random(32).toString();
  const hash = CryptoJS.PBKDF2(password, passwordSalt, {
    keySize: 64,
    iterations: 10000
  }).toString();
  
  return { hash, salt: passwordSalt };
};

export const verifyPassword = (password: string, hash: string, salt: string): boolean => {
  const testHash = CryptoJS.PBKDF2(password, salt, {
    keySize: 64,
    iterations: 10000
  }).toString();
  
  return testHash === hash;
};

// Cryptographically secure token generation
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Rate limiting helper
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};

// Session management
export const generateSessionToken = (): string => {
  return generateSecureToken();
};

export const isTokenExpired = (timestamp: string, expiryHours: number = 24): boolean => {
  const tokenTime = new Date(timestamp).getTime();
  const now = Date.now();
  const expiryTime = expiryHours * 60 * 60 * 1000;
  
  return (now - tokenTime) > expiryTime;
};
