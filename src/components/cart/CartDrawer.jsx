import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalAmount, updateQuantity, removeItem, closeCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-50 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-offwhite border-l border-borderSoft shadow-softMd z-50 flex flex-col cart-drawer-panel"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-borderSoft">
          <h2 className="font-serif text-lg font-medium text-darkgreen">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-offwhiteWarm min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-textSecondary text-center py-8">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 pb-4 border-b border-borderSoft last:border-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg bg-offwhiteWarm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-textPrimary truncate">{item.name}</p>
                    <p className="text-sm text-textSecondary">{item.variantLabel}</p>
                    <p className="text-sm font-medium text-darkgreen mt-1">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-borderSoft flex items-center justify-center hover:bg-offwhiteWarm min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-8 sm:h-8"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-borderSoft flex items-center justify-center hover:bg-offwhiteWarm min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-8 sm:h-8"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-darkgreen whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-4 border-t border-borderSoft space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Total</span>
              <span className="font-medium text-darkgreen">₹{totalAmount}</span>
            </div>
            <Link
              to="/products"
              onClick={closeCart}
              className="block w-full py-3 px-4 text-center rounded-lg border border-darkgreen text-darkgreen font-medium hover:bg-darkgreen hover:text-offwhite transition-colors min-h-[44px] flex items-center justify-center"
            >
              Add more products
            </Link>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full py-3 px-4 text-center rounded-lg bg-darkgreen text-offwhite font-medium hover:bg-darkgreenMuted transition-colors min-h-[44px] flex items-center justify-center"
            >
              Place order
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
