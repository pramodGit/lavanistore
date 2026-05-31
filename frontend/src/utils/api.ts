import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isLoggingOut = false;

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid sessions globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Prevent multiple redirects/logouts
    if ((status === 401 || status === 403) && !isLoggingOut) {
      isLoggingOut = true;

      try {
        // Optional: tell backend to clear refresh cookie
        await axios.post(
          "/api/auth/logout",
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.warn("Logout API failed:", err);
      }

      // Clear frontend storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      localStorage.removeItem("cart");
      localStorage.removeItem("cartItems");

      // Redirect to login
      window.location.replace("/auth/login");
    }

    return Promise.reject(error);
  }
);

export default api;