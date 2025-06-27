
import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@campaign.com',
    role: 'admin',
    firstName: 'John',
    lastName: 'Admin',
    createdAt: '2024-01-01',
    lastLogin: '2024-06-27'
  },
  {
    id: '2',
    email: 'supervisor@campaign.com',
    role: 'supervisor',
    firstName: 'Sarah',
    lastName: 'Supervisor',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-26'
  },
  {
    id: '3',
    email: 'volunteer@campaign.com',
    role: 'volunteer',
    firstName: 'Mike',
    lastName: 'Volunteer',
    createdAt: '2024-02-01',
    lastLogin: '2024-06-25'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('campaign_user');
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
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
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
      hasAnyRole
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
