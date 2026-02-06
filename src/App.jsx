import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { ProductsProvider } from './context/ProductsContext';
import { StoreProvider } from './context/StoreContext';
import CustomerLayout from './components/layout/CustomerLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <StoreProvider>
      <ProductsProvider>
        <OrdersProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="login" element={<AdminLoginPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/:id" element={<AdminProductEditPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </OrdersProvider>
      </ProductsProvider>
    </StoreProvider>
  );
}

export default App;
