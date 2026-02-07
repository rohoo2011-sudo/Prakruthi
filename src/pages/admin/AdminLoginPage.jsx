import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import AdminGuard from '../../components/admin/AdminGuard';

function withTimeout(promise, ms, message = 'Request timed out. Please try again.') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

export default function AdminLoginPage() {
  const { store } = useStore();
  const { user, isAdmin, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const maxRetries = 2;
    try {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const { data, error: signInError } = await withTimeout(
            supabase.auth.signInWithPassword({ email, password }),
            15000,
            'Login timed out. Please try again.'
          );
          if (signInError) {
            setError(signInError.message || 'Invalid email or password.');
            return;
          }
          if (data?.user) {
            const profileData = await withTimeout(
              fetchProfile(data.user.id),
              10000,
              'Loading profile timed out. Please try again.'
            );
            if (profileData?.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
              return;
            }
            await supabase.auth.signOut();
            setError('Access denied. You are not an admin.');
            return;
          }
        } catch (err) {
          if (err?.name === 'AbortError' && attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
          if (err?.name === 'AbortError') {
            setError('Request was interrupted. Please try again.');
          } else {
            setError(err?.message || 'Login failed. Please try again.');
          }
          return;
        }
      }
    } finally {
      setSubmitting(false);
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
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px] disabled:opacity-70"
            >
              {submitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </AdminGuard>
  );
}
