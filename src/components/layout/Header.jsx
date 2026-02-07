import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const { store } = useStore();
  const storeName = store.storeName || 'Prakruthi';

  return (
    <header className="sticky top-0 z-40 bg-offwhite border-b border-borderSoft shadow-soft">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg sm:text-xl font-medium text-darkgreen">
          <img src="/assets/prakruthi-logo-2.png" alt="" className="h-8 sm:h-9 w-auto object-contain" />
          {storeName}
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-textSecondary hover:text-darkgreen transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-textSecondary hover:text-darkgreen transition-colors">
            Products
          </Link>
          <Link to="/about" className="text-textSecondary hover:text-darkgreen transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-textSecondary hover:text-darkgreen transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-1">
          <Link
            to="/login"
            className="p-2 rounded-lg hover:bg-offwhiteWarm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Log in"
          >
            <svg className="w-6 h-6 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2 rounded-lg hover:bg-offwhiteWarm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open cart"
          >
          <svg className="w-6 h-6 text-darkgreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-darkgreen text-offwhite text-xs font-medium min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex items-center justify-center gap-4 py-2 border-t border-borderSoft">
        <Link to="/" className="text-sm text-textSecondary hover:text-darkgreen">Home</Link>
        <Link to="/products" className="text-sm text-textSecondary hover:text-darkgreen">Products</Link>
        <Link to="/about" className="text-sm text-textSecondary hover:text-darkgreen">About</Link>
        <Link to="/contact" className="text-sm text-textSecondary hover:text-darkgreen">Contact</Link>
      </nav>
    </header>
  );
}
