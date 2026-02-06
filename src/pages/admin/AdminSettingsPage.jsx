import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export default function AdminSettingsPage() {
  const { store, updateStore } = useStore();
  const [form, setForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    about: '',
    storeDisabled: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      storeName: store.storeName ?? '',
      phone: store.phone ?? '',
      address: store.address ?? '',
      about: store.about ?? '',
      storeDisabled: store.storeDisabled ?? false,
    });
  }, [store]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStore({
      storeName: form.storeName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      about: form.about.trim(),
      storeDisabled: form.storeDisabled,
    });
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-serif text-xl font-medium text-darkgreen mb-6">Store Settings</h1>
      {saved && <p className="text-sm text-darkgreen mb-4">Settings saved.</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="store-name" className="block text-sm font-medium text-textPrimary mb-1">
            Store name
          </label>
          <input
            id="store-name"
            name="storeName"
            type="text"
            value={form.storeName}
            onChange={handleChange}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
            placeholder="Store name"
          />
        </div>
        <div>
          <label htmlFor="store-phone" className="block text-sm font-medium text-textPrimary mb-1">
            Phone (shown to customers)
          </label>
          <input
            id="store-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
            placeholder="+91 ..."
          />
        </div>
        <div>
          <label htmlFor="store-address" className="block text-sm font-medium text-textPrimary mb-1">
            Address
          </label>
          <textarea
            id="store-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent resize-none"
            placeholder="Full address"
          />
        </div>
        <div>
          <label htmlFor="store-about" className="block text-sm font-medium text-textPrimary mb-1">
            About / description
          </label>
          <textarea
            id="store-about"
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent resize-none"
            placeholder="Short description for footer etc."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="store-disabled"
            name="storeDisabled"
            type="checkbox"
            checked={form.storeDisabled}
            onChange={handleChange}
            className="rounded border-borderSoft"
          />
          <label htmlFor="store-disabled" className="text-sm font-medium text-textPrimary">
            Temporarily disable store (hide products)
          </label>
        </div>
        <button
          type="submit"
          className="min-h-[44px] px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
