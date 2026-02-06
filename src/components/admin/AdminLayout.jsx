import { Outlet, NavLink, useLocation } from 'react-router-dom';
import AdminGuard, { setAdminAuthenticated } from './AdminGuard';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const isLogin = location.pathname.endsWith('/login');

  const handleLogout = () => {
    setAdminAuthenticated(false);
    window.location.href = '/admin/login';
  };

  if (isLogin) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex flex-col bg-offwhite">
          <Outlet />
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-offwhite">
        <header className="sticky top-0 z-40 bg-offwhite border-b border-borderSoft shadow-soft px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="font-serif text-lg font-medium text-darkgreen">Admin</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-textSecondary hover:text-darkgreen min-h-[44px] px-3"
            >
              Logout
            </button>
          </div>
        </header>
        <nav className="border-b border-borderSoft bg-offwhiteWarm px-4 py-2">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `min-h-[44px] px-4 rounded-lg flex items-center text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-darkgreen text-offwhite'
                      : 'text-textSecondary hover:bg-borderSoft hover:text-textPrimary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
        <main className="flex-1 pb-20 md:pb-8">
          <Outlet />
        </main>
        <footer className="fixed bottom-0 left-0 right-0 md:relative bg-offwhite border-t border-borderSoft py-2 px-4 md:hidden">
          <div className="max-w-4xl mx-auto flex justify-around">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `min-h-[44px] px-3 flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive ? 'text-darkgreen' : 'text-textSecondary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </footer>
      </div>
    </AdminGuard>
  );
}
