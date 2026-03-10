import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User type
interface User {
  id: string;
  name: string;
  email: string;
  isGreen?: number | string;
}

// Auth state
interface AuthState {
  user: User | null;
  csrfToken: string | null;
}

// ✅ Normalize user so isGreen is always a number
const normalizeUser = (user: User | null) => {
  if (!user) return null;
  return {
    ...user,
    isGreen: Number(user.isGreen) || 0
  };
};

// ✅ Load from localStorage (compatible with old & new formats)
const storedAuth = localStorage.getItem("auth") || localStorage.getItem("user");
const parsed = storedAuth ? JSON.parse(storedAuth) : null;

// ✅ If parsed has .user → use parsed.user, else treat parsed as user
const initialState: AuthState = {
  user: parsed?.user ? normalizeUser(parsed.user) : normalizeUser(parsed),
  csrfToken: parsed?.csrfToken ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      const normalizedUser = normalizeUser(action.payload);
      state.user = normalizedUser;

      if (normalizedUser) {
        localStorage.setItem("auth", JSON.stringify({
          user: normalizedUser,
          csrfToken: state.csrfToken
        }));
      } else {
        localStorage.removeItem("auth");
      }
    },

    setCsrfToken: (state, action: PayloadAction<string | null>) => {
      state.csrfToken = action.payload;

      localStorage.setItem("auth", JSON.stringify({
        user: state.user,
        csrfToken: action.payload
      }));
    },

    logout: (state) => {
      state.user = null;
      state.csrfToken = null;

      // Clear all relevant auth keys
      localStorage.removeItem("auth");
      localStorage.removeItem("user");          // old key
      localStorage.removeItem("cart");          // if you store cart
      localStorage.removeItem("someOtherKey");  // any other persistent keys
    },

  },
});

export const { setUser, setCsrfToken, logout } = authSlice.actions;
export default authSlice.reducer;
