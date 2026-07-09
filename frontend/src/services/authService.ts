// frontend/src/services/authService.ts
import api from "../utils/api";
import { tokenStore } from "../utils/tokenStore";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });

  // ✅ Store in memory — NOT localStorage
  tokenStore.set(data.accessToken);

  // Non-sensitive user info only in localStorage
  localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
}