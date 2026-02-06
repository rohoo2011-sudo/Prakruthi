import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const order = {
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        variantLabel: i.variantLabel,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      total: totalAmount,
    };
    addOrder(order);
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-[60vh] py-12 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-serif text-2xl font-medium text-darkgreen mb-4">
            Thank you
          </h1>
          <p className="text-textSecondary leading-relaxed mb-8">
            Your order has been received. We will call and confirm shortly.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !submitted) {
    return (
      <main className="min-h-[60vh] py-12 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-serif text-2xl font-medium text-darkgreen mb-4">
            Checkout
          </h1>
          <p className="text-textSecondary mb-6">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-2xl font-medium text-darkgreen mb-6">
          Checkout
        </h1>
        <div className="mb-8 p-4 rounded-xl bg-offwhiteWarm border border-borderSoft">
          <h2 className="font-medium text-textPrimary mb-3">Order summary</h2>
          <ul className="space-y-2 text-sm text-textSecondary">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between">
                <span>
                  {item.name} ({item.variantLabel}) × {item.quantity}
                </span>
                <span className="text-darkgreen font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-borderSoft flex justify-between font-medium text-textPrimary">
            <span>Total</span>
            <span className="text-darkgreen">₹{totalAmount}</span>
          </div>
        </div>
        <p className="text-sm text-textSecondary mb-4">
          We usually confirm orders via phone call. No online payment—we will
          confirm and arrange delivery.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-textPrimary mb-1">
              Customer name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-textPrimary mb-1">
              Phone number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="We'll call to confirm your order"
            />
          </div>
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-textPrimary mb-1">
              Address
            </label>
            <input
              id="street"
              name="street"
              type="text"
              value={form.street}
              onChange={handleChange}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="Street / area"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-textPrimary mb-1">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-textPrimary mb-1">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
                placeholder="State"
              />
            </div>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-textPrimary mb-1">
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={form.pincode}
              onChange={handleChange}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="Pincode"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[48px]"
          >
            Place order
          </button>
        </form>
      </div>
    </main>
  );
}
