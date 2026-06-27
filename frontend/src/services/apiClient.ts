import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s timeout for Render spin-up + AI image analysis
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nutrixa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 (Session expired or unauthorized)
      localStorage.removeItem("nutrixa_token");
      // Trigger a window event so state stores can listen and reset
      window.dispatchEvent(new Event("nutrixa_unauthorized"));
    }
    return Promise.reject(error);
  }
);
