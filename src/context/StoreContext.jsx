import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_STORE = {
  id: null,
  storeName: 'Prakruthi',
  phone: '+91 98765 43210',
  address: 'Prakruthi Natural Products\nNear Main Road, Village Name\nDistrict, State – 123456',
  about: 'Traditional bull-driven oils and natural farming products.',
  storeDisabled: false,
};

function rowToStore(row) {
  if (!row) return DEFAULT_STORE;
  return {
    id: row.id,
    storeName: row.store_name ?? DEFAULT_STORE.storeName,
    phone: row.phone ?? DEFAULT_STORE.phone,
    address: row.address ?? DEFAULT_STORE.address,
    about: row.about ?? DEFAULT_STORE.about,
    storeDisabled: row.store_disabled ?? false,
  };
}

function storeToRow(store) {
  return {
    store_name: store.storeName,
    phone: store.phone,
    address: store.address,
    about: store.about,
    store_disabled: store.storeDisabled,
    updated_at: new Date().toISOString(),
  };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error: e } = await supabase.from('store').select('*').limit(1);
      setError(e?.message ?? null);
      if (data?.[0]) setStore(rowToStore(data[0]));
      setLoading(false);
    }
    load();
  }, []);

  const getStore = useCallback(() => store, [store]);

  const updateStore = useCallback(async (updates) => {
    const next = { ...store, ...updates };
    if (!next.id) return;
    const { error: e } = await supabase.from('store').update(storeToRow(next)).eq('id', next.id);
    setError(e?.message ?? null);
    if (!e) setStore(next);
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, getStore, updateStore, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
