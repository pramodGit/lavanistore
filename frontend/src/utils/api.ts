// frontend/src/utils/api.ts
import axios, { AxiosError } from "axios";
import { ApiError } from "./ApiError";
import { tokenStore } from "./tokenStore";

// ─────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────
const api = axios.create({
  baseURL        : "/api",
  withCredentials: true,          // sends httpOnly refresh cookie automatically
  timeout        : 15000,         // 15s timeout — prevents hanging requests
});

// ─────────────────────────────────────────
// State flags
// ─────────────────────────────────────────
let isLoggingOut    = false;
let isRefreshing    = false;

// Queue of requests waiting for token refresh
// e.g. 3 parallel calls all get 401 simultaneously
// only ONE refresh happens, others wait in queue
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject : (err: unknown)  => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else       resolve(token!);
  });
  refreshQueue = [];
}

// ─────────────────────────────────────────
// REQUEST interceptor
// ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // ✅ Token from memory — not localStorage
    const token = tokenStore.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────
// RESPONSE interceptor
// ─────────────────────────────────────────
api.interceptors.response.use(

  // ✅ Success — pass through unchanged
  (response) => {
    // If backend returns { status: "success", data: ... }
    // unwrap it so every component gets data directly
    if (
      response.data &&
      response.data.status === "success" &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    // If no wrapper (login, logout, forgot-password etc.)
    // response.data passes through unchanged
    return response;
  },

  // ✅ Error — handle centrally
  async (error: AxiosError) => {
    const status          = error.response?.status;
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean
    };

    // ── Network error (server down / no internet) ──
    if (!error.response) {
      throw new ApiError(
        "Network error. Please check your connection.",
        0
      );
    }

    // ── 401 — try silent token refresh first ──
    // Only retry once (_retry flag prevents infinite loop)
    if (status === 401 && !originalRequest._retry && !isLoggingOut) {
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
        .then((newToken) => {
          originalRequest.headers!.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch(() => {
          throw new ApiError("Session expired. Please login again.", 401);
        });
      }

      // Start refresh
      originalRequest._retry = true;
      isRefreshing            = true;

      try {
        // ✅ Refresh token is in httpOnly cookie — sent automatically
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        tokenStore.set(newToken);

        // Update header and retry all queued requests
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(originalRequest);  // retry original request

      } catch (refreshError) {
        // Refresh failed — logout
        processQueue(refreshError, null);
        await logout();
        throw new ApiError("Session expired. Please login again.", 401);

      } finally {
        isRefreshing = false;
      }
    }

    // ── 403 — valid token but wrong permissions ──
    if (status === 403) {
      throw new ApiError("You do not have permission to do this.", 403);
    }

    // ── 401 after retry failed (or already logging out) ──
    if (status === 401) {
      if (!isLoggingOut) await logout();
      throw new ApiError("Session expired. Please login again.", 401);
    }

    // ── Other HTTP errors — transform into typed ApiError ──
    const body    = error.response?.data as any;
    const message = body?.message || body?.error || `Request failed (${status})`;
    const field   = body?.field;     // for validation errors from your Node backend

    throw new ApiError(message, status ?? 500, field);
  }
);

// ─────────────────────────────────────────
// Logout helper — single place
// ─────────────────────────────────────────
async function logout() {
  if (isLoggingOut) return;   // ✅ prevent multiple logouts
  isLoggingOut = true;

  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.warn("Logout API failed:", err);
  }

  // ✅ Clear only what you set
  tokenStore.clear();
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  localStorage.removeItem("cartItems");

  // ✅ Reset flag before redirect so future sessions work
  isLoggingOut = false;

  window.location.replace("/auth/login");
}

export { logout };
export default api;