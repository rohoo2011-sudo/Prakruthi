import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminGuard({ children }) {
  const location = useLocation();
  const { user, loading, isAdmin } = useAuth();
  const isLogin = location.pathname.endsWith('/login');

  if (isLogin) return children;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <p className="text-textSecondary">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
