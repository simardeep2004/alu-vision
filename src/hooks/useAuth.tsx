
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isAdmin: boolean; // Add isAdmin property
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@aluvision.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@aluvision.com',
    password: 'user123',
    role: 'user' as const,
  },
];

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
    const savedUser = localStorage.getItem('aluvision_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Add isAdmin property based on role
        setUser({
          ...parsedUser,
          isAdmin: parsedUser.role === 'admin'
        });
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('aluvision_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email and password
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Add isAdmin property based on role
      const userWithIsAdmin = {
        ...userWithoutPassword,
        isAdmin: userWithoutPassword.role === 'admin'
      };
      
      // Save user to state and localStorage
      setUser(userWithIsAdmin);
      localStorage.setItem('aluvision_user', JSON.stringify(userWithIsAdmin));
      
      toast.success('Logged in successfully');
      
      // Get redirect path from location state or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user (in a real app, this would be done on the backend)
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'user' as const,
        isAdmin: false // Default to not admin
      };
      
      // Save user to state and localStorage
      setUser(newUser);
      localStorage.setItem('aluvision_user', JSON.stringify(newUser));
      
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
  const logout = () => {
    setUser(null);
    localStorage.removeItem('aluvision_user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
