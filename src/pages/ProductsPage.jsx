import { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import ProductCard from '../components/products/ProductCard';

export default function ProductsPage() {
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    let list = products;
    if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  return (
    <main className="min-h-[60vh] py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-2xl font-medium text-darkgreen mb-6">
          Products
        </h1>
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mb-6 rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent"
          aria-label="Search products"
        />
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                category === cat
                  ? 'bg-darkgreen text-offwhite'
                  : 'bg-offwhiteWarm text-textSecondary hover:bg-borderSoft hover:text-textPrimary border border-borderSoft'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="text-textSecondary text-center py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
