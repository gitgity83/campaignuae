
import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole, CreateUserData, RegistrationData } from '@/types/auth';

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

// Enhanced mock users with new fields
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@campaign.com',
    role: 'admin',
    firstName: 'John',
    lastName: 'Admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-06-27',
    passwordSet: true
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
    passwordSet: true
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
    passwordSet: true
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
    registrationToken: 'token-pending-volunteer',
    passwordSet: false
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('campaign_user');
    const storedUsers = localStorage.getItem('campaign_users');
    
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch {
        localStorage.setItem('campaign_users', JSON.stringify(mockUsers));
      }
    } else {
      localStorage.setItem('campaign_users', JSON.stringify(mockUsers));
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch {
        localStorage.removeItem('campaign_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
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

    if (password === 'password123') {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      
      setUsers(updatedUsers);
      localStorage.setItem('campaign_users', JSON.stringify(updatedUsers));
      localStorage.setItem('campaign_user', JSON.stringify(updatedUser));
      
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('campaign_user');
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

    // Check permissions
    if (authState.user.role === 'volunteer') {
      throw new Error('Volunteers cannot create users');
    }

    if (authState.user.role === 'supervisor' && userData.role !== 'volunteer') {
      throw new Error('Supervisors can only create volunteer accounts');
    }

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
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
      registrationToken: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      passwordSet: false
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('campaign_users', JSON.stringify(updatedUsers));

    const registrationLink = `${window.location.origin}/register/${newUser.registrationToken}`;

    return { user: newUser, registrationLink };
  };

  const approveUser = async (userId: string) => {
    if (!authState.user || authState.user.role !== 'admin') {
      throw new Error('Only admins can approve users');
    }

    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: 'active' as const } : user
    );

    setUsers(updatedUsers);
    localStorage.setItem('campaign_users', JSON.stringify(updatedUsers));
  };

  const rejectUser = async (userId: string) => {
    if (!authState.user || authState.user.role !== 'admin') {
      throw new Error('Only admins can reject users');
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('campaign_users', JSON.stringify(updatedUsers));
  };

  const completeRegistration = async (data: RegistrationData) => {
    const user = users.find(u => u.registrationToken === data.token);
    
    if (!user) {
      throw new Error('Invalid registration token');
    }

    const updatedUser = {
      ...user,
      passwordSet: true,
      registrationToken: undefined,
      firstName: data.firstName || user.firstName,
      lastName: data.lastName || user.lastName
    };

    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('campaign_users', JSON.stringify(updatedUsers));
  };

  const validateToken = (token: string): User | null => {
    return users.find(u => u.registrationToken === token) || null;
  };

  const getAllUsers = () => users;
  const getPendingUsers = () => users.filter(u => u.status === 'pending_approval');

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
