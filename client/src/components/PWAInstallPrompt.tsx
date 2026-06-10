import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const translations: Record<string, { title: string; description: string; install: string; dismiss: string }> = {
  ar: {
    title: "ثبّت التطبيق",
    description: "أضف Feel Great لشاشتك الرئيسية للوصول السريع والإشعارات الفورية",
    install: "تثبيت",
    dismiss: "لاحقاً",
  },
  en: {
    title: "Install App",
    description: "Add Feel Great to your home screen for quick access and instant notifications",
    install: "Install",
    dismiss: "Later",
  },
  fr: {
    title: "Installer l'app",
    description: "Ajoutez Feel Great à votre écran d'accueil pour un accès rapide",
    install: "Installer",
    dismiss: "Plus tard",
  },
  es: {
    title: "Instalar app",
    description: "Añade Feel Great a tu pantalla de inicio para acceso rápido",
    install: "Instalar",
    dismiss: "Más tarde",
  },
  de: {
    title: "App installieren",
    description: "Fügen Sie Feel Great zu Ihrem Startbildschirm hinzu",
    install: "Installieren",
    dismiss: "Später",
  },
  tr: {
    title: "Uygulamayı yükle",
    description: "Hızlı erişim için Feel Great'i ana ekranınıza ekleyin",
    install: "Yükle",
    dismiss: "Daha sonra",
  },
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Detect language
  const lang = document.documentElement.lang || "en";
  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently (don't show for 7 days)
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after a short delay (don't interrupt immediately)
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-500"
      role="alert"
    >
      <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 shadow-2xl shadow-black/30">
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a365d] to-[#d4af37] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">FG</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">{t.title}</h3>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{t.description}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-150 active:scale-97"
          >
            {t.dismiss}
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 px-3 py-2 text-xs font-semibold text-slate-900 bg-gradient-to-r from-[#d4af37] to-[#e8c84a] hover:from-[#c9a432] hover:to-[#d4af37] rounded-lg transition-all duration-150 shadow-sm active:scale-97"
          >
            {t.install}
          </button>
        </div>
      </div>
    </div>
  );
}
