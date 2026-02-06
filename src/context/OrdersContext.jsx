import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'prakruthi_orders';

const OrdersContext = createContext(null);

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const getOrders = useCallback(() => orders, [orders]);

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: String(order.id ?? Date.now()),
      createdAt: order.createdAt ?? new Date().toISOString(),
      status: order.status ?? 'pending',
      paid: order.paid ?? false,
      modified: order.modified ?? false,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder.id;
  }, []);

  const updateOrder = useCallback((id, updates) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === String(id) ? { ...o, ...updates } : o))
    );
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((o) => o.id !== String(id)));
  }, []);

  const getOrder = useCallback(
    (id) => orders.find((o) => o.id === String(id)) ?? null,
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        getOrders,
        getOrder,
        addOrder,
        updateOrder,
        deleteOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
