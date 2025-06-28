import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole, CreateUserData, RegistrationData } from '@/types/auth';
import { SecureUser, LoginAttempt, DEFAULT_SECURITY_CONFIG } from '@/types/secure-auth';
import { hashPassword, verifyPassword, generateSecureToken, checkRateLimit, generateSessionToken, isTokenExpired } from '@/utils/security';
import { validateInput, loginSchema, createUserSchema, registrationSchema } from '@/utils/validation';
import { sanitizeInput } from '@/utils/security';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  createUser: (userData: CreateUserData) => Promise<{ user: User; registrationLink: string }>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  completeRegistration: (data: RegistrationData) => Promise<void>;
  validateToken: (token: string) => User | null;
  getAllUsers: () => User[];
  getPendingUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create secure mock users with hashed passwords
const createSecureMockUsers = (): SecureUser[] => {
  const defaultPassword = 'SecurePass123!';
  const { hash, salt } = hashPassword(defaultPassword);
  
  return [
    {
      id: '1',
      email: 'admin@campaign.com',
      role: 'admin',
      firstName: 'John',
      lastName: 'Admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-06-27',
      passwordSet: true,
      passwordHash: hash,
      passwordSalt: salt,
      loginAttempts: 0
    },
    {
      id: '2',
      email: 'supervisor@campaign.com',
      role: 'supervisor',
      firstName: 'Sarah',
      lastName: 'Supervisor',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-06-26',
      createdBy: '1',
      passwordSet: true,
      passwordHash: hash,
      passwordSalt: salt,
      loginAttempts: 0
    },
    {
      id: '3',
      email: 'volunteer@campaign.com',
      role: 'volunteer',
      firstName: 'Mike',
      lastName: 'Volunteer',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '2024-06-25',
      createdBy: '2',
      passwordSet: true,
      passwordHash: hash,
      passwordSalt: salt,
      loginAttempts: 0
    },
    {
      id: '4',
      email: 'pending@campaign.com',
      role: 'volunteer',
      firstName: 'Lisa',
      lastName: 'Johnson',
      status: 'pending_approval',
      createdAt: '2024-06-20',
      lastLogin: '',
      createdBy: '2',
      registrationToken: generateSecureToken(),
      passwordSet: false,
      passwordHash: '',
      passwordSalt: '',
      loginAttempts: 0,
      tokenExpiry: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    }
  ];
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [users, setUsers] = useState<SecureUser[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);

  useEffect(() => {
    // Initialize secure users
    const secureUsers = createSecureMockUsers();
    const storedUsers = localStorage.getItem('campaign_secure_users');
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch {
        setUsers(secureUsers);
        localStorage.setItem('campaign_secure_users', JSON.stringify(secureUsers));
      }
    } else {
      setUsers(secureUsers);
      localStorage.setItem('campaign_secure_users', JSON.stringify(secureUsers));
    }

    // Check for valid session
    const storedSession = localStorage.getItem('campaign_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (!isTokenExpired(session.expiry)) {
          const user = secureUsers.find(u => u.id === session.userId);
          if (user) {
            setAuthState({
              user: convertSecureUserToUser(user),
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }
        }
        localStorage.removeItem('campaign_session');
      } catch {
        localStorage.removeItem('campaign_session');
      }
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const convertSecureUserToUser = (secureUser: SecureUser): User => {
    const { passwordHash, passwordSalt, sessionToken, sessionExpiry, loginAttempts, lockedUntil, tokenExpiry, ...user } = secureUser;
    return user;
  };

  const isAccountLocked = (user: SecureUser): boolean => {
    if (!user.lockedUntil) return false;
    return new Date(user.lockedUntil) > new Date();
  };

  const login = async (email: string, password: string) => {
    // Validate input
    const validation = validateInput(loginSchema, { email: sanitizeInput(email), password });
    if (!validation.success) {
      throw new Error(validation.errors?.join(', ') || 'Invalid input');
    }

    // Rate limiting
    if (!checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000)) {
      throw new Error('Too many login attempts. Please try again in 15 minutes.');
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Log failed attempt
      setLoginAttempts(prev => [...prev, {
        email,
        timestamp: new Date().toISOString(),
        success: false
      }]);
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      throw new Error('Account is temporarily locked due to multiple failed login attempts.');
    }

    if (!user.passwordSet) {
      throw new Error('Please complete your registration using the link provided');
    }

    if (user.status === 'pending_approval') {
      throw new Error('Your account is pending approval. Please wait for admin approval.');
    }

    if (user.status === 'inactive') {
      throw new Error('Your account has been deactivated. Please contact an administrator.');
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.passwordHash, user.passwordSalt);
    
    if (!isValidPassword) {
      // Increment login attempts
      const updatedUser = {
        ...user,
        loginAttempts: user.loginAttempts + 1,
        lockedUntil: user.loginAttempts + 1 >= DEFAULT_SECURITY_CONFIG.maxLoginAttempts 
          ? new Date(Date.now() + DEFAULT_SECURITY_CONFIG.lockoutDurationMs).toISOString()
          : undefined
      };
      
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));
      
      // Log failed attempt
      setLoginAttempts(prev => [...prev, {
        email,
        timestamp: new Date().toISOString(),
        success: false
      }]);
      
      throw new Error('Invalid credentials');
    }

    // Successful login - create session
    const sessionToken = generateSessionToken();
    const sessionExpiry = new Date(Date.now() + DEFAULT_SECURITY_CONFIG.sessionExpiryHours * 60 * 60 * 1000).toISOString();
    
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
      lockedUntil: undefined,
      sessionToken,
      sessionExpiry
    };
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));
    
    // Store session
    localStorage.setItem('campaign_session', JSON.stringify({
      userId: user.id,
      token: sessionToken,
      expiry: sessionExpiry
    }));
    
    // Log successful attempt
    setLoginAttempts(prev => [...prev, {
      email,
      timestamp: new Date().toISOString(),
      success: true
    }]);
    
    setAuthState({
      user: convertSecureUserToUser(updatedUser),
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('campaign_session');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const createUser = async (userData: CreateUserData): Promise<{ user: User; registrationLink: string }> => {
    if (!authState.user) {
      throw new Error('Not authenticated');
    }

    // Validate input
    const validation = validateInput(createUserSchema, {
      ...userData,
      email: sanitizeInput(userData.email),
      firstName: sanitizeInput(userData.firstName),
      lastName: sanitizeInput(userData.lastName)
    });
    if (!validation.success) {
      throw new Error(validation.errors?.join(', ') || 'Invalid input');
    }

    // Check permissions
    if (authState.user.role === 'volunteer') {
      throw new Error('Volunteers cannot create users');
    }

    if (authState.user.role === 'supervisor' && userData.role !== 'volunteer') {
      throw new Error('Supervisors can only create volunteer accounts');
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email already exists');
    }

    const registrationToken = generateSecureToken();
    const tokenExpiry = new Date(Date.now() + DEFAULT_SECURITY_CONFIG.tokenExpiryHours * 60 * 60 * 1000).toISOString();

    const newUser: SecureUser = {
      id: generateSecureToken().substring(0, 16),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: authState.user.role === 'supervisor' && userData.role === 'volunteer' 
        ? 'pending_approval' 
        : 'pending_approval',
      createdAt: new Date().toISOString(),
      lastLogin: '',
      createdBy: authState.user.id,
      registrationToken,
      passwordSet: false,
      passwordHash: '',
      passwordSalt: '',
      loginAttempts: 0,
      tokenExpiry
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));

    const registrationLink = `${window.location.origin}/register/${registrationToken}`;

    return { user: convertSecureUserToUser(newUser), registrationLink };
  };

  const completeRegistration = async (data: RegistrationData) => {
    // Validate input
    const validation = validateInput(registrationSchema, {
      ...data,
      firstName: data.firstName ? sanitizeInput(data.firstName) : undefined,
      lastName: data.lastName ? sanitizeInput(data.lastName) : undefined
    });
    if (!validation.success) {
      throw new Error(validation.errors?.join(', ') || 'Invalid input');
    }

    const user = users.find(u => u.registrationToken === data.token);
    
    if (!user) {
      throw new Error('Invalid registration token');
    }

    // Check token expiry
    if (user.tokenExpiry && isTokenExpired(user.tokenExpiry, DEFAULT_SECURITY_CONFIG.tokenExpiryHours)) {
      throw new Error('Registration token has expired');
    }

    const { hash, salt } = hashPassword(data.password);

    const updatedUser = {
      ...user,
      passwordSet: true,
      passwordHash: hash,
      passwordSalt: salt,
      registrationToken: undefined,
      tokenExpiry: undefined,
      firstName: data.firstName || user.firstName,
      lastName: data.lastName || user.lastName
    };

    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));
  };

  const approveUser = async (userId: string) => {
    if (!authState.user || authState.user.role !== 'admin') {
      throw new Error('Only admins can approve users');
    }

    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: 'active' as const } : user
    );

    setUsers(updatedUsers);
    localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));
  };

  const rejectUser = async (userId: string) => {
    if (!authState.user || authState.user.role !== 'admin') {
      throw new Error('Only admins can reject users');
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('campaign_secure_users', JSON.stringify(updatedUsers));
  };

  const validateToken = (token: string): User | null => {
    const user = users.find(u => u.registrationToken === token);
    if (!user) return null;
    
    // Check token expiry
    if (user.tokenExpiry && isTokenExpired(user.tokenExpiry, DEFAULT_SECURITY_CONFIG.tokenExpiryHours)) {
      return null;
    }
    
    return convertSecureUserToUser(user);
  };

  const getAllUsers = () => users.map(convertSecureUserToUser);
  const getPendingUsers = () => users.filter(u => u.status === 'pending_approval').map(convertSecureUserToUser);

  const hasRole = (role: UserRole) => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return authState.user ? roles.includes(authState.user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasRole,
      hasAnyRole,
      createUser,
      approveUser,
      rejectUser,
      completeRegistration,
      validateToken,
      getAllUsers,
      getPendingUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
