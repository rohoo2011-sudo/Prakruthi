import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function normalizeVariants(variants, fallbackPrice, fallbackStock) {
  const arr = Array.isArray(variants) ? variants : [];
  if (arr.length === 0 && (fallbackPrice != null || fallbackStock != null)) {
    return [{ id: 'default', label: 'Default', price: Number(fallbackPrice) || 0, stock: Number(fallbackStock) ?? 0 }];
  }
  return arr.map((v) => ({
    id: v.id || `v-${crypto.randomUUID().slice(0, 8)}`,
    label: v.label ?? 'Default',
    price: Number(v.price) || 0,
    stock: v.stock !== undefined && v.stock !== null ? Number(v.stock) : undefined,
  }));
}

function rowToProduct(row) {
  if (!row) return null;
  const rawVariants = Array.isArray(row.variants) ? row.variants : (row.variants ? JSON.parse(row.variants) : []);
  const variants = normalizeVariants(rawVariants, row.price, row.stock);
  const prices = variants.map((v) => v.price).filter((n) => !isNaN(n));
  const hasVariantStock = variants.some((v) => v.stock !== undefined);
  const anyVariantInStock = hasVariantStock
    ? variants.some((v) => (v.stock ?? 0) > 0)
    : (row.stock ?? 0) > 0;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    image: row.image ?? '',
    price: prices.length ? Math.min(...prices) : Number(row.price) || 0,
    stock: hasVariantStock ? variants.reduce((s, v) => s + (v.stock ?? 0), 0) : (row.stock ?? 0),
    inStock: row.in_stock !== false && anyVariantInStock,
    description: row.description ?? '',
    variants,
    bestSelling: row.best_selling === true,
  };
}

function productToRow(product) {
  let variants = product.variants ?? [];
  variants = variants.map((v) => {
    const stock = v.stock !== undefined && v.stock !== null ? Number(v.stock) : undefined;
    return {
      id: v.id || `v-${crypto.randomUUID().slice(0, 8)}`,
      label: v.label ?? 'Default',
      price: Number(v.price) || 0,
      ...(stock !== undefined && { stock }),
    };
  });
  const prices = variants.map((v) => v.price).filter((n) => !isNaN(n));
  const hasAnyVariantStock = variants.some((v) => v.stock !== undefined && v.stock !== null);
  const totalStock = hasAnyVariantStock
    ? variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)
    : (product.stock ?? 0);
  const anyInStock = hasAnyVariantStock
    ? variants.some((v) => (Number(v.stock) || 0) > 0)
    : (product.stock ?? 0) > 0;
  return {
    name: product.name,
    category: product.category,
    image: product.image ?? '',
    price: prices.length ? Math.min(...prices) : (product.price ?? 0),
    stock: totalStock,
    in_stock: anyInStock,
    description: product.description ?? '',
    variants,
    best_selling: product.bestSelling === true,
    updated_at: new Date().toISOString(),
  };
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    const { data, error: e } = await supabase.from('products').select('*').order('name');
    setError(e?.message ?? null);
    setProducts((data ?? []).map(rowToProduct));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateProduct = useCallback(async (id, updates) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const next = { ...p, ...updates };
    const row = productToRow(next);
    const { error: e } = await supabase.from('products').update(row).eq('id', id);
    setError(e?.message ?? null);
    if (!e) setProducts((prev) => prev.map((x) => (x.id === id ? next : x)));
  }, [products]);

  const addProduct = useCallback(async (product) => {
    const variants = product.variants?.length
      ? product.variants
      : [{ id: 'default', label: 'Default', price: product.price ?? 0, stock: product.stock ?? 0 }];
    const row = productToRow({ ...product, variants });
    const { data, error: e } = await supabase.from('products').insert(row).select('id').single();
    setError(e?.message ?? null);
    if (data) {
      await loadProducts();
      return data.id;
    }
    return null;
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id) => {
    const { error: e } = await supabase.from('products').delete().eq('id', id);
    setError(e?.message ?? null);
    if (!e) setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id) ?? null,
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        updateProduct,
        addProduct,
        deleteProduct,
        getProduct,
        loadProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
