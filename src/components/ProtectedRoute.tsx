
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check auth status after component mounts
    if (!isLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, isLoading, location, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin route but user is not admin, redirect to dashboard
  if (requireAdmin && user.role !== 'admin') {
    console.log("Not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the children
  console.log("Authenticated, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
