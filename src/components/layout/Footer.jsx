import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
  const { store } = useStore();
  const storeName = store.storeName || 'Prakruthi';
  return (
    <footer className="bg-offwhiteWarm border-t border-borderSoft mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-serif text-lg font-medium text-darkgreen">
            {storeName}
          </Link>
          <p className="text-sm text-textSecondary text-center sm:text-left">
            {store.about || 'Traditional bull-driven oils and natural farming products.'}
          </p>
        </div>
        <nav className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-textSecondary">
          <Link to="/products" className="hover:text-darkgreen transition-colors">Products</Link>
          <Link to="/about" className="hover:text-darkgreen transition-colors">About</Link>
          <Link to="/contact" className="hover:text-darkgreen transition-colors">Contact</Link>
        </nav>
        <p className="mt-6 text-xs text-textSecondary text-center sm:text-left">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
