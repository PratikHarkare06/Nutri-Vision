// Central API base URL — reads from VITE_API_URL env var in production,
// falls back to localhost for local development.
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5001/api";
