import { Navigate } from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { Loader } from '../components/common/Loader';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader fullScreen size="hero" text="Loading..." />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
