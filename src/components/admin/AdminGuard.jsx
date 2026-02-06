import { Navigate, useLocation } from 'react-router-dom';

const AUTH_KEY = 'admin_authenticated';

export function isAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(value) {
  if (value) sessionStorage.setItem(AUTH_KEY, 'true');
  else sessionStorage.removeItem(AUTH_KEY);
}

export default function AdminGuard({ children }) {
  const location = useLocation();
  const isLogin = location.pathname.endsWith('/login');

  if (isLogin) return children;
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
