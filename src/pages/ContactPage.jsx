import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function ContactPage() {
  const { store } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-[60vh] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl font-medium text-darkgreen mb-6">
          Contact Us
        </h1>
        <div className="space-y-6 text-textSecondary">
          <div>
            <h2 className="text-sm font-medium text-textPrimary mb-1">Phone</h2>
            <a
              href={store.phone ? `tel:${store.phone.replace(/\s/g, '')}` : '#'}
              className="text-darkgreen hover:underline"
            >
              {store.phone || '—'}
            </a>
          </div>
          <div>
            <h2 className="text-sm font-medium text-textPrimary mb-1">Address</h2>
            <p className="whitespace-pre-line">{store.address || '—'}</p>
          </div>
          <p className="text-sm bg-offwhiteWarm border border-borderSoft rounded-lg p-4">
            We usually confirm orders via phone call. If you place an order
            online, we will call you to confirm before delivery.
          </p>
        </div>
        <div className="mt-10">
          <h2 className="font-medium text-textPrimary mb-4">Send us a message</h2>
          {sent ? (
            <p className="text-textSecondary">Thank you. We will get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-textPrimary mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[44px]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-textPrimary mb-1">
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[44px]"
                  placeholder="Your phone"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-textPrimary mb-1">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent resize-none"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="py-3 px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[44px]"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
