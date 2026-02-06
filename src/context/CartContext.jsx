import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

const initialState = { items: [], isOpen: false };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, variantId, variantLabel, name, price, image, quantity = 1 } = action.payload;
      const key = `${productId}-${variantId}`;
      const existing = state.items.find((i) => i.key === key);
      const items = existing
        ? state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...state.items, { key, productId, variantId, variantLabel, name, price, image, quantity }];
      const wasEmpty = state.items.length === 0;
      return { ...state, items, isOpen: wasEmpty ? true : state.isOpen };
    }
    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload;
      if (quantity < 1) {
        return { ...state, items: state.items.filter((i) => i.key !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity } : i
        ),
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.key !== action.payload.key),
      };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((payload) => {
    dispatch({ type: 'ADD_ITEM', payload });
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { key } });
  }, []);

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalAmount,
        addItem,
        updateQuantity,
        removeItem,
        openCart,
        closeCart,
        toggleCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
