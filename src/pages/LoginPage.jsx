import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

const TABS = { email: 'email', phone: 'phone' };

export default function LoginPage() {
  const { store } = useStore();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user && !isAdmin) navigate(redirectTo, { replace: true });
  }, [user, isAdmin, redirectTo, navigate]);

  const [tab, setTab] = useState(TABS.email);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password });
      setSubmitting(false);
      if (err) {
        setError(err.message || 'Sign up failed.');
        return;
      }
      setError('');
      navigate(redirectTo, { replace: true });
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (err) {
        setError(err.message || 'Invalid email or password.');
        return;
      }
      navigate(redirectTo, { replace: true });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    if (normalized.length < 10) {
      setError('Enter a valid phone number.');
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: normalized });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Failed to send OTP.');
      return;
    }
    setOtpSent(true);
    setError('');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    setSubmitting(true);
    const { error: err } = await supabase.auth.verifyOtp({
      phone: normalized,
      token: otp,
      type: 'sms',
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Invalid code.');
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-serif text-xl font-medium text-darkgreen text-center mb-2">
        {store.storeName || 'Prakruthi'}
      </h1>
      <p className="text-sm text-textSecondary text-center mb-8">Login or sign up</p>

      <div className="flex border-b border-borderSoft mb-6">
        <button
          type="button"
          onClick={() => { setTab(TABS.email); setError(''); setOtpSent(false); }}
          className={`flex-1 py-2 text-sm font-medium ${tab === TABS.email ? 'text-darkgreen border-b-2 border-darkgreen' : 'text-textSecondary'}`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => { setTab(TABS.phone); setError(''); setOtpSent(false); }}
          className={`flex-1 py-2 text-sm font-medium ${tab === TABS.phone ? 'text-darkgreen border-b-2 border-darkgreen' : 'text-textSecondary'}`}
        >
          Phone
        </button>
      </div>

      {tab === TABS.email && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-textPrimary mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen min-h-[48px]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-textPrimary mb-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isSignUp}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen min-h-[48px]"
              placeholder="Password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px] disabled:opacity-70"
          >
            {submitting ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="w-full text-sm text-textSecondary hover:text-darkgreen"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </form>
      )}

      {tab === TABS.phone && (
        <>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="login-phone" className="block text-sm font-medium text-textPrimary mb-1">
                  Phone number
                </label>
                <input
                  id="login-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen min-h-[48px]"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px] disabled:opacity-70"
              >
                {submitting ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-textSecondary">
                Code sent to {phone.startsWith('+') ? phone : `+91 ${phone}`}
              </p>
              <div>
                <label htmlFor="login-otp" className="block text-sm font-medium text-textPrimary mb-1">
                  Enter code
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen min-h-[48px]"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting || otp.length < 6}
                className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px] disabled:opacity-70"
              >
                {submitting ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                className="w-full text-sm text-textSecondary hover:text-darkgreen"
              >
                Use a different number
              </button>
            </form>
          )}
        </>
      )}

      <p className="mt-8 text-center text-sm text-textSecondary">
        <Link to={redirectTo} className="text-darkgreen hover:underline">
          ← Back
        </Link>
      </p>
    </div>
  );
}
