import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import checkoutReducer from "./checkoutSlice";
import { cartApi } from "./cartApi";

// ===== CART PERSISTENCE =====
const loadCartState = () => {
  try {
    const serialized = localStorage.getItem("cart");
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

const saveCartState = (state: any) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  } catch {}
};

// ===== AUTH PERSISTENCE =====
const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem("auth");
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

const saveAuthState = (state: any) => {
  try {
    localStorage.setItem("auth", JSON.stringify(state.auth));
  } catch {}
};

// ===== PRELOAD =====
const preloadedCart = loadCartState();
const preloadedAuth = loadAuthState();

// ===== STORE =====
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    checkout: checkoutReducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartApi.middleware),

  preloadedState: {
    cart: preloadedCart,
    auth: preloadedAuth,
  },
});

// ===== PERSIST ON CHANGE =====
store.subscribe(() => {
  const state = store.getState();
  saveCartState(state);
  saveAuthState(state);
});

// ===== TYPES =====
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
