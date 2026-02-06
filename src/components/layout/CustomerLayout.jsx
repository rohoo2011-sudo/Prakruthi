import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

export default function CustomerLayout() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-offwhite">
        <Header />
        <Outlet />
        <Footer />
      </div>
      <CartDrawer />
    </>
  );
}
