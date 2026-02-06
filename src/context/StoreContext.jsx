import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'prakruthi_store';

const DEFAULT_STORE = {
  storeName: 'Prakruthi',
  phone: '+91 98765 43210',
  address: 'Prakruthi Natural Products\nNear Main Road, Village Name\nDistrict, State – 123456',
  about: 'Traditional bull-driven oils and natural farming products.',
  storeDisabled: false,
};

const StoreContext = createContext(null);

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STORE, ...JSON.parse(raw) } : DEFAULT_STORE;
  } catch {
    return DEFAULT_STORE;
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function StoreProvider({ children }) {
  const [store, setStore] = useState(loadStore);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const getStore = useCallback(() => store, [store]);

  const updateStore = useCallback((updates) => {
    setStore((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <StoreContext.Provider value={{ store, getStore, updateStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
