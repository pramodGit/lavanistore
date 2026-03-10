// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  mrp: number;
  salePrice: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  gstRates: { ProdID: string; GST_Percent: number }[];
}

const initialState: CartState = {
  items: [],
  gstRates: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    incrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity++;
    },

    decrementQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity--;
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
      state.gstRates = [];
      localStorage.removeItem("cart");
    },
    setGstRates(state, action) {
      state.gstRates = action.payload;
    },
  }
});

export const { addItem, incrementQuantity, decrementQuantity, removeItem, clearCart, setGstRates  } =
  cartSlice.actions;

export default cartSlice.reducer;
