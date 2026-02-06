import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import { useProducts } from '../../context/ProductsContext';
import { timeAgo, isToday, isThisWeek } from '../../utils/timeAgo';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const { products } = useProducts();

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const ordersToday = orders.filter((o) => isToday(o.createdAt));
  const ordersThisWeek = orders.filter((o) => isThisWeek(o.createdAt));
  const soldOutCount = products.filter((p) => (p.stock ?? 0) === 0 || !p.inStock).length;
  const lowStock = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < LOW_STOCK_THRESHOLD);

  const summaryCards = [
    { label: 'Pending Orders', value: pendingOrders.length, to: '/admin/orders?status=pending', highlight: true },
    { label: 'Orders Today', value: ordersToday.length, to: '/admin/orders' },
    { label: 'Sold-Out Products', value: soldOutCount, to: '/admin/products' },
    { label: 'Orders This Week', value: ordersThisWeek.length, to: '/admin/orders' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-serif text-xl font-medium text-darkgreen mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {summaryCards.map(({ label, value, to, highlight }) => (
          <Link
            key={label}
            to={to}
            className={`rounded-xl border p-4 min-h-[80px] flex flex-col justify-center transition-colors ${
              highlight ? 'border-darkgreen bg-offwhiteWarm' : 'border-borderSoft bg-offwhite'
            }`}
          >
            <span className="text-2xl font-medium text-darkgreen">{value}</span>
            <span className="text-sm text-textSecondary">{label}</span>
          </Link>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="font-medium text-textPrimary mb-3">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <p className="text-textSecondary text-sm">No pending orders.</p>
        ) : (
          <ul className="space-y-3">
            {pendingOrders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="p-4 rounded-xl border border-darkgreen/30 bg-offwhiteWarm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-textPrimary">{order.customerName}</p>
                    <p className="text-sm text-textSecondary">₹{order.total} · {timeAgo(order.createdAt)}</p>
                  </div>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-darkgreen"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        {pendingOrders.length > 0 && (
          <Link
            to="/admin/orders"
            className="mt-3 inline-block text-sm font-medium text-darkgreen"
          >
            View all orders
          </Link>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-medium text-textPrimary mb-3">Stock Alerts</h2>
        {lowStock.length === 0 && soldOutCount === 0 ? (
          <p className="text-textSecondary text-sm">No low-stock or sold-out products.</p>
        ) : (
          <ul className="space-y-2">
            {products
              .filter((p) => (p.stock ?? 0) === 0 || (p.stock ?? 0) < LOW_STOCK_THRESHOLD)
              .slice(0, 5)
              .map((p) => (
                <li key={p.id} className="flex justify-between items-center py-2 border-b border-borderSoft last:border-0">
                  <span className="text-textPrimary">{p.name}</span>
                  <span className="text-sm text-textSecondary mr-2">Stock: {p.stock ?? 0}</span>
                  <Link
                    to={`/admin/products/${p.id}`}
                    className="text-sm font-medium text-darkgreen min-h-[44px] flex items-center px-3"
                  >
                    Add stock
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-medium text-textPrimary mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products/new"
            className="min-h-[48px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors flex items-center"
          >
            Add Product
          </Link>
          <Link
            to="/admin/products"
            className="min-h-[48px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors flex items-center"
          >
            Update Stock
          </Link>
          <Link
            to="/admin/settings"
            className="min-h-[48px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors flex items-center"
          >
            Store Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
