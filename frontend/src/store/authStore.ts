// authStore.ts — Firebase-powered auth state management
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase";
import { apiClient } from "../services/apiClient";

export type User = {
  id: string;         // Firebase UID
  name: string;
  email: string;
  hasCompletedProfile: boolean;
};

type AuthState = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string;

  // Actions
  initAuth: () => void;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setHasCompletedProfile: (val: boolean) => void;
};

// Helper: fetch user profile from Nutrixa backend using Firebase UID
const fetchNutrixaProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  // Get fresh ID token and set it as Bearer header via apiClient interceptor
  const idToken = await firebaseUser.getIdToken(true);
  localStorage.setItem("nutrixa_token", idToken);

  try {
    const res = await apiClient.get("/auth/me");
    if (res.data?.success) {
      return {
        id: firebaseUser.uid,
        name: res.data.data.name || firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        hasCompletedProfile: res.data.data.hasCompletedProfile ?? false,
      };
    }
  } catch {
    // Profile not found — create it on first sign-in
    const createRes = await apiClient.post("/auth/sync", {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "User",
      email: firebaseUser.email,
    });
    if (createRes.data?.success) {
      return {
        id: firebaseUser.uid,
        name: createRes.data.data.name || firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        hasCompletedProfile: false,
      };
    }
  }

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "User",
    email: firebaseUser.email || "",
    hasCompletedProfile: false,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  errorMessage: "",

  clearError: () => set({ errorMessage: "" }),

  setHasCompletedProfile: (val) => {
    const user = get().user;
    if (user) set({ user: { ...user, hasCompletedProfile: val } });
  },

  // Called once on app mount — listens for Firebase auth state
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Refresh ID token and store it for API calls
          const idToken = await firebaseUser.getIdToken(true);
          localStorage.setItem("nutrixa_token", idToken);

          const user = await fetchNutrixaProfile(firebaseUser);
          set({ user, firebaseUser, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem("nutrixa_token");
          set({ user: null, firebaseUser: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        localStorage.removeItem("nutrixa_token");
        set({ user: null, firebaseUser: null, isAuthenticated: false, isLoading: false });
      }
    });

    // Return unsubscribe fn (not stored, app-level listener)
    return unsubscribe;
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true, errorMessage: "" });
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken(true);
      localStorage.setItem("nutrixa_token", idToken);
      const user = await fetchNutrixaProfile(credential.user);
      set({ user, firebaseUser: credential.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code);
      set({ errorMessage: msg, isLoading: false });
      return false;
    }
  },

  register: async ({ name, email, password }) => {
    try {
      set({ isLoading: true, errorMessage: "" });
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name on Firebase profile
      await updateProfile(credential.user, { displayName: name });

      const idToken = await credential.user.getIdToken(true);
      localStorage.setItem("nutrixa_token", idToken);

      // Sync new user to Nutrixa backend
      await apiClient.post("/auth/sync", {
        uid: credential.user.uid,
        name,
        email,
      });

      const user: User = {
        id: credential.user.uid,
        name,
        email,
        hasCompletedProfile: false,
      };
      set({ user, firebaseUser: credential.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const msg = getFirebaseErrorMessage(err.code);
      set({ errorMessage: msg, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem("nutrixa_token");
    set({ user: null, firebaseUser: null, isAuthenticated: false, errorMessage: "" });
  },
}));

// Human-friendly Firebase error messages
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Authentication failed. Please try again.";
  }
}
