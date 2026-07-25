import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
}

const loadWishlistFromStorage = (): WishlistState => {
  if (typeof window === "undefined") {
    return { items: [] };
  }
  try {
    const serializedWishlist = localStorage.getItem("dulcis_wishlist");
    if (serializedWishlist) {
      return { items: JSON.parse(serializedWishlist) as WishlistItem[] };
    }
  } catch (error) {
    console.error("Error loading wishlist from localStorage", error);
  }
  return { items: [] };
};

const initialState: WishlistState = loadWishlistFromStorage();

const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("dulcis_wishlist", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving wishlist to localStorage", error);
    }
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const item = action.payload;
      const index = state.items.findIndex((i) => i.id === item.id);
      if (index === -1) {
        state.items.push(item);
      } else {
        state.items.splice(index, 1);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
