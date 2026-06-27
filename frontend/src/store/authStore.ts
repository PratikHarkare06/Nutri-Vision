import { create } from "zustand";
import { apiClient } from "../services/apiClient";

export type User = {
  id: string;
  name: string;
  email: string;
  hasCompletedProfile: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string;
  checkAuth: () => Promise<void>;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setHasCompletedProfile: (val: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen for global 401 events
  if (typeof window !== "undefined") {
    window.addEventListener("nutrixa_unauthorized", () => {
      set({ user: null, token: null, isAuthenticated: false });
    });
  }

  return {
    user: null,
    token: localStorage.getItem("nutrixa_token"),
    isAuthenticated: false,
    isLoading: true,
    errorMessage: "",
    clearError: () => set({ errorMessage: "" }),
    setHasCompletedProfile: (val) => {
      const user = get().user;
      if (user) {
        set({ user: { ...user, hasCompletedProfile: val } });
      }
    },
    checkAuth: async () => {
      const token = localStorage.getItem("nutrixa_token");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      try {
        set({ isLoading: true });
        const res = await apiClient.get("/auth/me");
        if (res.data && res.data.success) {
          set({
            user: res.data.data,
            isAuthenticated: true,
            isLoading: false,
            errorMessage: "",
          });
        }
      } catch (err: any) {
        localStorage.removeItem("nutrixa_token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },
    login: async (credentials) => {
      try {
        set({ isLoading: true, errorMessage: "" });
        const res = await apiClient.post("/auth/login", credentials);
        if (res.data && res.data.success) {
          const { token, data } = res.data;
          localStorage.setItem("nutrixa_token", token);
          set({
            token,
            user: data,
            isAuthenticated: true,
            isLoading: false,
            errorMessage: "",
          });
          return true;
        }
        return false;
      } catch (err: any) {
        const msg = err.response?.data?.error?.message || "Failed to log in. Please check your credentials.";
        set({ errorMessage: msg, isLoading: false });
        return false;
      }
    },
    register: async (data) => {
      try {
        set({ isLoading: true, errorMessage: "" });
        const res = await apiClient.post("/auth/register", data);
        if (res.data && res.data.success) {
          const { token, data: userData } = res.data;
          localStorage.setItem("nutrixa_token", token);
          set({
            token,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            errorMessage: "",
          });
          return true;
        }
        return false;
      } catch (err: any) {
        const msg = err.response?.data?.error?.message || "Registration failed. Try again.";
        set({ errorMessage: msg, isLoading: false });
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem("nutrixa_token");
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        errorMessage: "",
      });
      // Redirect or reload
      window.location.href = "/";
    },
  };
});
