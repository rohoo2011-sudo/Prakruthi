import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder, deleteOrder, loading } = useOrders();
  const order = getOrder(id);
  const [items, setItems] = useState(order?.items ?? []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (order?.items) setItems(order.items);
  }, [order?.id, order?.items]);

  if (loading && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-textSecondary">Loading…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-textSecondary">Order not found.</p>
        <Link to="/admin/orders" className="text-darkgreen font-medium mt-2 inline-block">Back to orders</Link>
      </div>
    );
  }

  const fullAddress = [order.street, order.city, order.state, order.pincode].filter(Boolean).join(', ');
  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null;

  const updateItemQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const next = [...items];
    next[index] = { ...next[index], quantity };
    setItems(next);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const saveChanges = () => {
    const newTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    updateOrder(id, { items, total: newTotal, modified: true });
    setSaved(true);
  };

  const hasChanges =
    JSON.stringify(items) !== JSON.stringify(order.items) ||
    items.reduce((sum, i) => sum + i.price * i.quantity, 0) !== order.total;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/admin/orders" className="text-sm font-medium text-darkgreen mb-4 inline-block">
        ← Back to orders
      </Link>
      <h1 className="font-serif text-xl font-medium text-darkgreen mb-6">Order #{order.id}</h1>
      {order.modified && (
        <p className="text-sm text-textSecondary mb-4 bg-offwhiteWarm border border-borderSoft rounded-lg px-3 py-2">
          This order was modified.
        </p>
      )}

      <section className="mb-8 p-4 rounded-xl bg-offwhiteWarm border border-borderSoft">
        <h2 className="font-medium text-textPrimary mb-3">Customer</h2>
        <p className="font-medium text-textPrimary">{order.customerName}</p>
        {order.phone && (
          <a href={`tel:${order.phone}`} className="text-darkgreen hover:underline block mt-1">
            {order.phone}
          </a>
        )}
        <p className="text-sm text-textSecondary mt-2 whitespace-pre-line">{fullAddress}</p>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 min-h-[44px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors flex items-center"
          >
            Open in Google Maps
          </a>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-medium text-textPrimary mb-3">Ordered Items</h2>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.productId}-${item.variantId}-${index}`}
              className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-borderSoft bg-offwhite"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-textPrimary">{item.name}</p>
                <p className="text-sm text-textSecondary">{item.variantLabel} · ₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItemQuantity(index, item.quantity - 1)}
                  className="w-9 h-9 rounded border border-borderSoft flex items-center justify-center hover:bg-offwhiteWarm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQuantity(index, item.quantity + 1)}
                  className="w-9 h-9 rounded border border-borderSoft flex items-center justify-center hover:bg-offwhiteWarm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="font-medium text-darkgreen w-16 text-right">
                ₹{item.price * item.quantity}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-sm text-textSecondary hover:text-red-600 min-h-[44px] px-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between font-medium text-textPrimary">
          <span>Total</span>
          <span className="text-darkgreen">
            ₹{items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
          </span>
        </div>
        {hasChanges && (
          <button
            type="button"
            onClick={saveChanges}
            className="mt-4 min-h-[44px] px-4 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
          >
            Save changes
          </button>
        )}
        {saved && <p className="mt-2 text-sm text-darkgreen">Changes saved.</p>}
      </section>

      <section className="flex flex-wrap gap-3">
        {!order.paid && (
          <button
            type="button"
            onClick={() => updateOrder(id, { paid: true })}
            className="min-h-[44px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors"
          >
            Mark as Paid
          </button>
        )}
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => updateOrder(id, { status: 'delivered' })}
            className="min-h-[44px] px-4 rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors"
          >
            Mark as Delivered
          </button>
        )}
        {order.status === 'pending' && (
          <button
            type="button"
            onClick={() => updateOrder(id, { status: 'cancelled' })}
            className="min-h-[44px] px-4 rounded-lg border border-borderSoft text-textSecondary font-medium hover:bg-offwhiteWarm transition-colors"
          >
            Cancel Order
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Delete this order? This cannot be undone.')) {
              deleteOrder(id);
              navigate('/admin/orders');
            }
          }}
          className="min-h-[44px] px-4 rounded-lg border border-borderSoft text-textSecondary font-medium hover:bg-offwhiteWarm transition-colors"
        >
          Delete Order
        </button>
      </section>
    </div>
  );
}
