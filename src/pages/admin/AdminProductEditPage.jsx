import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '../../data/products';

const BUCKET = 'product-images';

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
    image: '',
    inStock: true,
    variants: [{ id: `v-${crypto.randomUUID().slice(0, 8)}`, label: '', price: 0, stock: 0 }],
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [variantError, setVariantError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      const vars = product.variants?.length
        ? product.variants.map((v) => ({
            id: v.id || `v-${crypto.randomUUID().slice(0, 8)}`,
            label: v.label ?? '',
            price: Number(v.price) || 0,
            stock: v.stock !== undefined && v.stock !== null ? Number(v.stock) : 0,
          }))
        : [{ id: `v-${crypto.randomUUID().slice(0, 8)}`, label: 'Default', price: product.price ?? 0, stock: product.stock ?? 0 }];
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        category: product.category ?? 'Oils',
        image: product.image ?? '',
        inStock: product.inStock !== false,
        variants: vars,
      });
    } else if (!isNew) {
      setForm({
        name: '',
        description: '',
        category: 'Oils',
        image: '',
        inStock: true,
        variants: [{ id: `v-${crypto.randomUUID().slice(0, 8)}`, label: '', price: 0, stock: 0 }],
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

  const updateVariant = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === idx
          ? { ...v, [field]: field === 'label' ? value : value === '' ? '' : Number(value) || 0 }
          : v
      ),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: `v-${crypto.randomUUID().slice(0, 8)}`, label: '', price: 0, stock: 0 }],
    }));
  };

  const removeVariant = (idx) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${id === 'new' ? crypto.randomUUID() : id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      setUploadError(error.message || 'Upload failed.');
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setForm((prev) => ({ ...prev, image: publicUrl }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVariantError('');
    const variants = form.variants
      .map((v) => ({
        id: v.id,
        label: (v.label?.trim() || 'Default'),
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      }))
      .filter((v) => !(v.label === 'Default' && v.price === 0 && v.stock === 0));
    if (variants.length === 0) {
      setVariantError('Add at least one variant with size and price.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      image: form.image.trim() || (isNew ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop' : product?.image),
      inStock: form.inStock,
      variants,
    };
    if (isNew) {
      addProduct({ ...payload, bestSelling: false });
      navigate('/admin/products');
    } else {
      updateProduct(id, payload);
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
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">Variants (size / quantity)</label>
          {variantError && <p className="text-sm text-red-600 mb-2">{variantError}</p>}
          <div className="space-y-3">
            {form.variants.map((v, idx) => {
              const isLast = idx === form.variants.length - 1;
              const isEmpty = (v.label?.trim() === '' || v.label === 'Default') && (Number(v.price) || 0) === 0 && (Number(v.stock) || 0) === 0;
              const isEmptyLastRow = isLast && isEmpty;
              return (
              <div
                key={v.id}
                className={`flex flex-wrap gap-3 items-start p-3 rounded-lg ${
                  isEmptyLastRow
                    ? 'border-2 border-dashed border-borderSoft bg-offwhiteWarm/50'
                    : 'border border-borderSoft bg-offwhite'
                }`}
              >
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-xs text-textSecondary mb-1">Size</label>
                  <input
                    type="text"
                    value={v.label}
                    onChange={(e) => updateVariant(idx, 'label', e.target.value)}
                    placeholder="e.g. 1 L, 5 L, 500 ml"
                    className="w-full rounded-lg border border-borderSoft bg-offwhite px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                    className="w-24 rounded-lg border border-borderSoft bg-offwhite px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                    className="w-24 rounded-lg border border-borderSoft bg-offwhite px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[44px]"
                  />
                </div>
                <div className="self-end pb-1">
                  {idx === form.variants.length - 1 ? (
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-3 py-2 text-sm font-medium text-darkgreen hover:text-darkgreenMuted min-h-[44px]"
                      aria-label="Add variant"
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg min-h-[44px]"
                      aria-label="Remove variant"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-1">
            Product image
          </label>
          <div className="flex flex-wrap gap-3 items-start">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFile}
              disabled={uploading}
              className="block w-full text-sm text-textSecondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-darkgreen file:text-offwhite file:font-medium"
            />
            <span className="text-sm text-textSecondary">or paste URL below</span>
          </div>
          {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
          {uploading && <p className="mt-1 text-sm text-textSecondary">Uploading…</p>}
          <input
            id="product-image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-borderSoft bg-offwhite px-4 py-3 text-textPrimary focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent min-h-[48px]"
            placeholder="https://... or upload above"
          />
          {form.image && (
            <img src={form.image} alt="" className="mt-2 h-24 w-24 object-cover rounded-lg border border-borderSoft" />
          )}
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
