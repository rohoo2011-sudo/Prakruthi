import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';

export default function AdminProductsPage() {
  const { products } = useProducts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-xl font-medium text-darkgreen">Products & Stock</h1>
        <Link
          to="/admin/products/new"
          className="min-h-[44px] px-4 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors flex items-center"
        >
          Add Product
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-textSecondary">No products. Add one to get started.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                to={`/admin/products/${p.id}`}
                className={`block p-4 rounded-xl border transition-colors ${
                  (p.stock ?? 0) === 0 ? 'border-darkgreen/40 bg-offwhiteWarm' : 'border-borderSoft bg-offwhite'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-textPrimary truncate">{p.name}</p>
                    <p className="text-sm text-textSecondary">
                      Stock: {p.stock ?? 0} · ₹{p.price} · {(p.stock ?? 0) > 0 && p.inStock !== false ? 'In stock' : 'Sold out'}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded border ${
                      (p.stock ?? 0) > 0 && p.inStock !== false
                        ? 'bg-offwhiteWarm text-darkgreen border-borderSoft'
                        : 'bg-offwhiteWarm text-textSecondary border-borderSoft'
                    }`}
                  >
                    {(p.stock ?? 0) > 0 && p.inStock !== false ? 'In stock' : 'Sold out'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
