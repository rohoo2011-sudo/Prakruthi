import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function rowToOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    customerName: row.customer_name,
    phone: row.phone ?? '',
    street: row.street ?? '',
    city: row.city ?? '',
    state: row.state ?? '',
    pincode: row.pincode ?? '',
    items: row.items ?? [],
    total: Number(row.total),
    status: row.status ?? 'pending',
    paid: row.paid === true,
    modified: row.modified === true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function orderToRow(order) {
  return {
    user_id: order.user_id ?? null,
    customer_name: order.customerName ?? order.customer_name,
    phone: order.phone ?? '',
    street: order.street ?? '',
    city: order.city ?? '',
    state: order.state ?? '',
    pincode: order.pincode ?? '',
    items: order.items ?? [],
    total: order.total ?? 0,
    status: order.status ?? 'pending',
    paid: order.paid === true,
    modified: order.modified === true,
    updated_at: new Date().toISOString(),
  };
}

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    const { data, error: e } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setError(e?.message ?? null);
    setOrders((data ?? []).map(rowToOrder));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getOrders = useCallback(() => orders, [orders]);

  const addOrder = useCallback(async (order) => {
    const row = orderToRow({
      ...order,
      customerName: order.customerName ?? order.customer_name,
      customer_name: order.customerName ?? order.customer_name,
    });
    const { data, error: e } = await supabase.from('orders').insert(row).select('id').single();
    setError(e?.message ?? null);
    if (data) {
      await loadOrders();
      return data.id;
    }
    return null;
  }, [loadOrders]);

  const updateOrder = useCallback(async (id, updates) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    const next = { ...o, ...updates };
    const row = orderToRow(next);
    const { error: e } = await supabase.from('orders').update(row).eq('id', id);
    setError(e?.message ?? null);
    if (!e) setOrders((prev) => prev.map((x) => (x.id === id ? next : x)));
  }, [orders, loadOrders]);

  const deleteOrder = useCallback(async (id) => {
    const { error: e } = await supabase.from('orders').delete().eq('id', id);
    setError(e?.message ?? null);
    if (!e) setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const getOrder = useCallback(
    (id) => orders.find((o) => o.id === id) ?? null,
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        getOrders,
        getOrder,
        addOrder,
        updateOrder,
        deleteOrder,
        loadOrders,
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
