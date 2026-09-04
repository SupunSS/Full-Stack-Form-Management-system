import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage: <ProtectedRoute role="CUSTOMER"><ApplicationPage /></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in at all
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />;
  }

  if (role && user.role !== role) {
    // Logged in, but wrong role for this route
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;