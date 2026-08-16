import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

interface PwaBannerProps {
  currentTab?: string;
}

export const PwaBanner: React.FC<PwaBannerProps> = ({ currentTab = 'dashboard' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Check if current page is public marketing site or public scan
  const isPublicPage = ['landing', 'use-cases', 'features', 'pricing', 'api-docs', 'contact'].includes(currentTab) || currentTab.startsWith('passport-');

  useEffect(() => {
    const isDismissed = localStorage.getItem('uniqr_pwa_dismissed') === 'true';
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    localStorage.setItem('uniqr_pwa_dismissed', 'true');
    if (!deferredPrompt) {
      alert('To install UniQR Enterprise App:\n\n1. On Mobile (Chrome / Safari): Tap Share / Menu (⋮) -> "Add to Home Screen" or "Install App".\n2. On Desktop (Chrome / Edge): Click the install icon in your address bar.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('uniqr_pwa_dismissed', 'true');
    setShowBanner(false);
  };

  // Only allow PWA prompt within application screens
  if (!showBanner || isInstalled || isPublicPage) return null;

  return (
    <div className="bg-[#1D4533] text-[#F7EAE0] px-4 py-2.5 flex items-center justify-between text-xs border-b border-[#F9D2BA]/30 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-3">
        <img 
          src="/logo.jpg" 
          alt="UniQR" 
          className="w-8 h-8 rounded-lg border border-[#F9D2BA] object-cover shrink-0 shadow" 
        />
        <div>
          <span className="font-extrabold text-[#F7EAE0]">Install UniQR Enterprise App</span>
          <span className="hidden sm:inline text-[#F9D2BA] ml-2 font-medium">
            – Fast camera scanner, offline ledger, and universal identity management.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-extrabold hover:bg-[#F7EAE0] transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-[#F9D2BA] hover:text-[#F7EAE0]"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
