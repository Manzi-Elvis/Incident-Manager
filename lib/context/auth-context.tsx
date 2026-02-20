'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/services/auth-service';

export type UserRole = 'admin' | 'engineer' | 'client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team_id: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  canView: (requiredRoles: UserRole[]) => boolean;
  canAssign: () => boolean;
  canResolve: () => boolean;
  canDelete: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user fallback
const DEMO_USER: AuthUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'admin',
  team_id: '1',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: 'engineer',
            team_id: '1',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          };
          setUser(authUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data } = authService.onAuthStateChange((authUser) => {
      if (authUser) {
        const mappedUser: AuthUser = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          role: 'engineer',
          team_id: '1',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email}`,
        };
        setUser(mappedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        const authUser: AuthUser = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.user_metadata?.full_name || result.user.email.split('@')[0],
          role: 'engineer',
          team_id: '1',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.email}`,
        };
        setUser(authUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const result = await authService.signup(email, password, fullName);
      if (result.success && result.user) {
        const authUser: AuthUser = {
          id: result.user.id,
          email: result.user.email,
          name: fullName || result.user.email.split('@')[0],
          role: 'engineer',
          team_id: '1',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.email}`,
        };
        setUser(authUser);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const switchRole = (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
  };

  const canView = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const canAssign = () => user?.role === 'admin' || user?.role === 'engineer';
  const canResolve = () => user?.role === 'admin' || user?.role === 'engineer';
  const canDelete = () => user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        isAuthenticated,
        setUser,
        login,
        signup,
        logout,
        switchRole,
        canView,
        canAssign,
        canResolve,
        canDelete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
