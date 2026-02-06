import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';

export default function AdminOrdersPage() {
  const { orders } = useOrders();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (statusFilter === 'pending') list = list.filter((o) => o.status === 'pending');
    return list;
  }, [orders, statusFilter]);

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  };

  const statusBadge = (status) => {
    const styles = {
      pending: 'bg-offwhiteWarm text-darkgreen border-borderSoft',
      delivered: 'bg-offwhiteWarm text-darkgreenMuted border-borderSoft',
      cancelled: 'bg-offwhiteWarm text-textSecondary border-borderSoft',
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded border ${styles[status] ?? styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-serif text-xl font-medium text-darkgreen mb-6">Orders</h1>
      {filtered.length === 0 ? (
        <p className="text-textSecondary">No orders found.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((order) => (
            <li key={order.id}>
              <Link
                to={`/admin/orders/${order.id}`}
                className={`block p-4 rounded-xl border transition-colors ${
                  order.status === 'pending'
                    ? 'border-darkgreen/40 bg-offwhiteWarm'
                    : 'border-borderSoft bg-offwhite'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-textPrimary">{order.customerName}</p>
                    <p className="text-sm text-textSecondary">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(order.status)}
                    <span className="font-medium text-darkgreen">₹{order.total}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
