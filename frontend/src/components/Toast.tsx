import { useEffect, useState, createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  showConfirm: () => {},
});

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const colors: Record<ToastType, string> = {
  success: "border-[#7A9E7E] bg-[#EBF2EB] text-[#2C3E2B]",
  error:   "border-[#E8815A] bg-[#FEF0EB] text-[#7A2010]",
  warning: "border-[#D4A847] bg-[#FEF9EB] text-[#7A5A10]",
  info:    "border-[#7A9EBE] bg-[#EBF2F8] text-[#1A3A5C]",
};

interface ConfirmDialog {
  id: string;
  message: string;
  onConfirm: () => void;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmDialog | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const showConfirm = useCallback((message: string, onConfirm: () => void) => {
    const id = Math.random().toString(36).slice(2);
    setConfirm({ id, message, onConfirm });
  }, []);

  const dismissToast = (id: string) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Stack */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg
              backdrop-blur-sm animate-slide-up text-sm font-semibold ${colors[t.type]}`}
          >
            <span className="text-base shrink-0 mt-0.5">{icons[t.type]}</span>
            <span className="flex-1 leading-relaxed">{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity ml-1"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] border border-border shadow-2xl p-6 max-w-sm w-full space-y-4 animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm font-semibold text-textHeading leading-relaxed">{confirm.message}</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs font-bold text-textMuted hover:bg-[#F5F5F0] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirm.onConfirm();
                  setConfirm(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
