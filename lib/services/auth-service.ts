import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  error?: string;
}

export const authService = {
  // Sign up with email and password
  async signup(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: 'Signup failed',
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'Signup failed - no user returned',
          error: 'No user data returned',
        };
      }

      return {
        success: true,
        message: 'Signup successful. Check your email to confirm.',
        user: {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Signup failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Sign in with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          message: 'Login failed',
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'Login failed - no user returned',
          error: 'No user data returned',
        };
      }

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Sign out
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          message: 'Logout failed',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: 'Password reset request failed',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Password reset email sent. Check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Password reset request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Update password
  async updatePassword(password: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          message: 'Password update failed',
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Password update failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return null;
      }

      return data.session;
    } catch {
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        });
      } else {
        callback(null);
      }
    });
  },
};
