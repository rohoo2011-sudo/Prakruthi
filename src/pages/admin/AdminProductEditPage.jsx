import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { CATEGORIES } from '../../data/products';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, updateProduct, addProduct, deleteProduct } = useProducts();
  const isNew = id === 'new';
  const product = isNew ? null : getProduct(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Oils',
    price: '',
    stock: '',
    image: '',
    inStock: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        category: product.category ?? 'Oils',
        price: String(product.price ?? ''),
        stock: String(product.stock ?? 0),
        image: product.image ?? '',
        inStock: product.inStock !== false,
      });
    } else if (!isNew) {
      setForm({
        name: '',
        description: '',
        category: 'Oils',
        price: '',
        stock: '0',
        image: '',
        inStock: true,
      });
    }
  }, [product, isNew]);

  if (!isNew && !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-textSecondary">Product not found.</p>
        <Link to="/admin/products" className="text-darkgreen font-medium mt-2 inline-block">Back to products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(form.price) || 0;
    const stock = Number(form.stock) || 0;
    if (isNew) {
      addProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price,
        stock,
        image: form.image.trim() || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        inStock: form.inStock && stock > 0,
        bestSelling: false,
      });
      navigate('/admin/products');
    } else {
      updateProduct(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price,
        stock,
        inStock: form.inStock && stock > 0,
        image: form.image.trim() || product?.image,
      });
      setSaved(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      deleteProduct(id);
      navigate('/admin/products');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/admin/products" className="text-sm font-medium text-darkgreen mb-4 inline-block">
        ← Back to products
      </Link>
      <h1 className="font-serif text-xl font-medium text-darkgreen mb-6">
        {isNew ? 'Add Product' : 'Edit Product'}
      </h1>
      {saved && <p className="text-sm text-darkgreen mb-4">Changes saved.</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-textPrimary mb-1">
            Product name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
            placeholder="Product name"
          />
        </div>
        <div>
          <label htmlFor="product-description" className="block text-sm font-medium text-textPrimary mb-1">
            Description (optional)
          </label>
          <textarea
            id="product-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent resize-none"
            placeholder="Short description"
          />
        </div>
        <div>
          <label htmlFor="product-category" className="block text-sm font-medium text-textPrimary mb-1">
            Category
          </label>
          <select
            id="product-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium text-textPrimary mb-1">
              Price (₹)
            </label>
            <input
              id="product-price"
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="product-stock" className="block text-sm font-medium text-textPrimary mb-1">
              Stock
            </label>
            <input
              id="product-stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label htmlFor="product-image" className="block text-sm font-medium text-textPrimary mb-1">
            Image URL
          </label>
          <input
            id="product-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            className="w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
            placeholder="https://..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="product-inStock"
            name="inStock"
            type="checkbox"
            checked={form.inStock}
            onChange={handleChange}
            className="rounded border-borderSoft"
          />
          <label htmlFor="product-inStock" className="text-sm font-medium text-textPrimary">
            In stock (show on store)
          </label>
        </div>
        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            className="min-h-[44px] px-6 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors"
          >
            {isNew ? 'Add Product' : 'Save'}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="min-h-[44px] px-6 rounded-lg border border-borderSoft text-textSecondary font-medium hover:bg-offwhiteWarm transition-colors"
            >
              Delete Product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
