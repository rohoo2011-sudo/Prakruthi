import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, compact = false }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      variantLabel: selectedVariant.label,
      name: product.name,
      price: selectedVariant.price,
      image: product.image,
      quantity,
    });
  };

  if (compact) {
    return (
      <div className="rounded-xl bg-offwhite border border-borderSoft shadow-soft overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-textPrimary text-offwhite px-3 py-1 rounded text-sm font-medium">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-textPrimary">{product.name}</h3>
          <p className="text-darkgreen font-medium mt-1">
            {product.variants.length > 1 ? 'From ' : ''}₹{product.price}
          </p>
          {product.inStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-3 w-full py-2.5 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[44px]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-offwhite border border-borderSoft shadow-soft overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-textPrimary text-offwhite px-3 py-1 rounded text-sm font-medium">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-textPrimary">{product.name}</h3>
        {product.variants.length > 1 ? (
          <div>
            <label className="text-sm text-textSecondary block mb-1">Variant</label>
            <select
              value={selectedVariant.id}
              onChange={(e) => {
                const v = product.variants.find((x) => x.id === e.target.value);
                if (v) setSelectedVariant(v);
              }}
              className="w-full rounded-lg border border-borderSoft bg-offwhite px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-transparent"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — ₹{v.price}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-darkgreen font-medium">₹{selectedVariant.price}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-textSecondary">Qty</span>
          <div className="flex items-center border border-borderSoft rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-offwhiteWarm min-h-[44px] min-w-[44px]"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-offwhiteWarm min-h-[44px] min-w-[44px]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        {product.inStock ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3 rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[44px]"
          >
            Add to Cart
          </button>
        ) : null}
      </div>
    </div>
  );
}
