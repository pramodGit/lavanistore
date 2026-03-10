import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import api from "../utils/api";
import { clearCart } from "../store/cartSlice";

interface User {
  id: string;
  name: string;
  email: string;
}
interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  isGreen: number;
}

interface AuthContextType {
  user: User | null;
  login: (userName: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { throw new Error("login function not implemented"); },
  logout: async () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const dispatch = useDispatch();

  // Restore user on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const restoredUser: LoggedInUser = {
          id: decoded.id,
          name: decoded.userName,
          email: decoded.email || decoded.userName,
          isGreen: parsedUser?.isGreen ?? 0  // ✅ read isGreen from stored user
        };

        setUserState(restoredUser);
      } catch (err) {
        console.error("Invalid token, clearing it:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUserState(null);
      }
    } else if (parsedUser) {
      // ✅ restore from localStorage if token missing
      setUserState({
        ...parsedUser,
        isGreen: parsedUser?.isGreen ?? 0
      });
    }
  }, []);


  // Login
  const login = async (userName: string, password: string): Promise<User> => {
    const res = await api.post("/auth/login", { userName, password });
    const { accessToken, isGreen } = res.data;

    if (!accessToken) throw new Error("Login failed");

    const decoded: any = jwtDecode(accessToken);

    const loggedInUser: LoggedInUser = {
      id: decoded.id || decoded.sub,
      name: decoded.userName || decoded.username,
      email: decoded.email || userName,
      isGreen: isGreen ?? 0
    };

    setUserState(loggedInUser);          // ✅ context
    dispatch(setUser(loggedInUser));     // ✅ redux

    // Save JWT + minimal user info in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout API failed:", err);
    }

    // Clear frontend state
    setUserState(null);
    dispatch(setUser(null));   // redux auth
    dispatch(clearCart());     // redux cart, see step 2

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    localStorage.removeItem("cart");       // if cart stored as 'cart'
    localStorage.removeItem("cartItems");  // or 'cartItems', depending on your key
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
