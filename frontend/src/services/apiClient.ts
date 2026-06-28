// apiClient.ts — Central Axios instance with Firebase token auto-refresh
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { auth } from "../firebase";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
});

// Request interceptor — attach fresh Firebase ID token on every request
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // getIdToken(false) returns cached token; (true) forces refresh
        const token = await user.getIdToken(false);
        config.headers.Authorization = `Bearer ${token}`;
        localStorage.setItem("nutrixa_token", token);
      } catch (err) {
        console.warn("Failed to get Firebase ID token:", err);
      }
    } else {
      // Fallback to localStorage token (e.g., during initialization)
      const cached = localStorage.getItem("nutrixa_token");
      if (cached) {
        config.headers.Authorization = `Bearer ${cached}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nutrixa_token");
      window.dispatchEvent(new Event("nutrixa_unauthorized"));
    }
    return Promise.reject(error);
  }
);
