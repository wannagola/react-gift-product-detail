import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
