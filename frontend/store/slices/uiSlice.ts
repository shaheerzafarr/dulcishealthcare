import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  cartOpen: boolean;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  quickViewProductId: string | null;
}

const initialState: UiState = {
  cartOpen: false,
  mobileNavOpen: false,
  searchOpen: false,
  quickViewProductId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.cartOpen = action.payload;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    toggleSearch(state) {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    setQuickViewProductId(state, action: PayloadAction<string | null>) {
      state.quickViewProductId = action.payload;
    },
  },
});

export const {
  toggleCart,
  setCartOpen,
  toggleMobileNav,
  setMobileNavOpen,
  toggleSearch,
  setSearchOpen,
  setQuickViewProductId,
} = uiSlice.actions;
export default uiSlice.reducer;
