import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

type AuthPageProps = {
  navigate: (path: string) => void;
};

export default function AuthPage({ navigate }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { login, register, errorMessage, clearError, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Clear errors on load/tab switch
    clearError();
    setFormError("");
  }, [isLogin]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password || (!isLogin && !name)) {
      setFormError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (isLogin) {
      const success = await login({ email, password });
      if (success) {
        navigate("/");
      }
    } else {
      const success = await register({ name, email, password });
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      {/* Background blobs for premium glassmorphism feel */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#7A9E7E] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E8815A] opacity-10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#E2E4DC] rounded-[32px] p-8 shadow-xl relative z-10">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7A9E7E]/10 text-[#7A9E7E] mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#2C2C2C] tracking-tight">Nutrixa Health Hub</h2>
          <p className="text-xs text-[#7A7A7A] mt-1">Unlock AI nutrition guidance and personalized telemetry</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#F5F6F1] rounded-2xl p-1.5 border border-[#E2E4DC] mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              isLogin
                ? "bg-white text-[#2C2C2C] shadow-sm"
                : "text-[#7A7A7A] hover:text-[#2C2C2C]"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              !isLogin
                ? "bg-white text-[#2C2C2C] shadow-sm"
                : "text-[#7A7A7A] hover:text-[#2C2C2C]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Banners */}
        {(formError || errorMessage) && (
          <div className="bg-[#E8815A]/10 border border-[#E8815A]/20 text-[#E8815A] rounded-2xl p-4 text-xs font-semibold mb-6 flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mt-0.5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{formError || errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                placeholder="Sarah Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white transition-all text-[#2C2C2C]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white transition-all text-[#2C2C2C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F5F6F1]/50 border border-[#E2E4DC] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#7A9E7E] focus:bg-white transition-all text-[#2C2C2C]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7A9E7E] hover:bg-[#68876c] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-6 text-sm"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Log In" : "Create Account"}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-[#E2E4DC]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-[#E2E4DC]"></div>
        </div>

        {/* Guest Mode Trigger */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full border border-[#E2E4DC] hover:border-[#2C2C2C] text-[#2C2C2C] font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          Try as Guest (Food Scan Only)
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

      </div>
    </div>
  );
}
