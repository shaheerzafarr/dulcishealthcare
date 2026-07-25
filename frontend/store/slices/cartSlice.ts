import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

// Helper to load cart from localStorage safely during SSR
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
  try {
    const serializedCart = localStorage.getItem("dulcis_cart");
    if (serializedCart) {
      const items = JSON.parse(serializedCart) as CartItem[];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items, totalQuantity, totalAmount };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};

const initialState: CartState = loadCartFromStorage();

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("dulcis_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) {
      const newItem = action.payload;
      const quantityToAdd = newItem.quantity || 1;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: quantityToAdd,
        });
      } else {
        existingItem.quantity = Math.min(existingItem.quantity + quantityToAdd, existingItem.stock);
      }

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0) {
        existingItem.quantity = Math.min(quantity, existingItem.stock);
      }

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToStorage(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
