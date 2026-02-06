import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import AdminGuard, { isAdminAuthenticated, setAdminAuthenticated } from '../../components/admin/AdminGuard';

export default function AdminLoginPage() {
  const { store } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const envEmail = import.meta.env.VITE_ADMIN_EMAIL ?? '';
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? '';
    if (email === envEmail && password === envPassword) {
      setAdminAuthenticated(true);
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-offwhite">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-xl font-medium text-darkgreen text-center mb-2">
            {store.storeName}
          </h1>
          <p className="text-sm text-textSecondary text-center mb-8">Admin login</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-textPrimary mb-1">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-textPrimary mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
                placeholder="Password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px]"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
