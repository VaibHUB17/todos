import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
