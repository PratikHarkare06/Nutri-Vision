import { useEffect, useState } from "react";

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed it in this session
    const isDismissed = localStorage.getItem("pwa-banner-dismissed") === "true";
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser prompt
      e.preventDefault();
      // Save event for triggering later
      setDeferredPrompt(e);
      // Show the custom banner
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also support testing simulation if active
    const timer = setTimeout(() => {
      // If prompt isn't fired but we're in standalone, do nothing
      if (window.matchMedia("(display-mode: standalone)").matches) return;
    }, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install user choice: ${outcome}`);

    // Clear prompt and hide banner
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg bg-white border border-[#7A9E7E]/30 rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EBF2EB] border border-[#D4E6D5] flex items-center justify-center text-lg shrink-0">
          📲
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-textHeading text-xs">Install NutriTrack App</h4>
          <p className="text-[10px] text-textMuted mt-0.5">
            Add to your home screen for rapid meal logging & offline logs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 text-[10px] font-bold text-textMuted hover:text-textHeading hover:bg-background rounded-lg transition-all"
        >
          Dismiss
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 bg-[#9DB89F] hover:bg-[#7A9E7E] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm"
        >
          Install App
        </button>
      </div>
    </div>
  );
};
