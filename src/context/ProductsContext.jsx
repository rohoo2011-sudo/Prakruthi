import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { products as seedProducts } from '../data/products';

const STORAGE_KEY = 'prakruthi_products';

const ProductsContext = createContext(null);

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      return list.map((p) => ({
        ...p,
        stock: typeof p.stock === 'number' ? p.stock : (p.inStock ? 10 : 0),
        description: p.description ?? '',
      }));
    }
    return seedProducts.map((p) => ({
      ...p,
      stock: p.inStock ? 10 : 0,
      description: p.description ?? '',
    }));
  } catch {
    return seedProducts.map((p) => ({
      ...p,
      stock: p.inStock ? 10 : 0,
      description: p.description ?? '',
    }));
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadProducts);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== String(id)) return p;
        const next = { ...p, ...updates };
        if (updates.stock !== undefined) {
          next.inStock = updates.stock > 0;
        }
        return next;
      })
    );
  }, []);

  const addProduct = useCallback((product) => {
    const id = String(Date.now());
    const newProduct = {
      ...product,
      id,
      stock: product.stock ?? 0,
      inStock: (product.stock ?? 0) > 0,
      description: product.description ?? '',
      variants: product.variants ?? [{ id: `${id}-default`, label: 'Default', price: product.price ?? 0 }],
    };
    setProducts((prev) => [...prev, newProduct]);
    return id;
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== String(id)));
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === String(id)) ?? null,
    [products]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        getProduct,
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
