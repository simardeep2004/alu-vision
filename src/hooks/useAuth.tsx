
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Updated User type to match Supabase profile
export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch additional profile information
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profileData?.full_name || '',
            avatar_url: profileData?.avatar_url || '',
            role: session.user.email === 'admin@aluvision.com' ? 'admin' : 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: profileData?.full_name || '',
              avatar_url: profileData?.avatar_url || '',
              role: session.user.email === 'admin@aluvision.com' ? 'admin' : 'user'
            });
            
            // Redirect to dashboard after successful sign in
            navigate('/dashboard', { replace: true });
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login', { replace: true });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log("Login successful, user:", data.user);

      // If profile doesn't exist, create one
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user?.id)
        .single();

      if (profileError && data.user) {
        // Create a basic profile if one doesn't exist
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: '',
            avatar_url: '',
            updated_at: new Date().toISOString()
          });
      }

      toast.success('Logged in successfully');
      
      // Navigate to dashboard or previous page
      const from = location.state?.from?.pathname || '/dashboard';
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      // The profile will be created via a trigger in Supabase
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  // Update profile function
  const updateProfile = async (profile: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
