import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const UI_TEXT: Record<string, {
  enable: string;
  enabled: string;
  denied: string;
  unsupported: string;
  tooltip: string;
}> = {
  ar: {
    enable: "تفعيل الإشعارات",
    enabled: "الإشعارات مفعّلة",
    denied: "الإشعارات محظورة",
    unsupported: "غير مدعوم",
    tooltip: "احصل على إشعار فوري عند نشر مقال جديد",
  },
  en: {
    enable: "Enable Notifications",
    enabled: "Notifications Enabled",
    denied: "Notifications Blocked",
    unsupported: "Not Supported",
    tooltip: "Get instant notifications when new articles are published",
  },
  fr: {
    enable: "Activer les notifications",
    enabled: "Notifications activées",
    denied: "Notifications bloquées",
    unsupported: "Non supporté",
    tooltip: "Recevez des notifications instantanées pour les nouveaux articles",
  },
  es: {
    enable: "Activar notificaciones",
    enabled: "Notificaciones activadas",
    denied: "Notificaciones bloqueadas",
    unsupported: "No soportado",
    tooltip: "Recibe notificaciones instantáneas cuando se publiquen nuevos artículos",
  },
  de: {
    enable: "Benachrichtigungen aktivieren",
    enabled: "Benachrichtigungen aktiviert",
    denied: "Benachrichtigungen blockiert",
    unsupported: "Nicht unterstützt",
    tooltip: "Erhalten Sie sofortige Benachrichtigungen bei neuen Artikeln",
  },
  tr: {
    enable: "Bildirimleri Etkinleştir",
    enabled: "Bildirimler Etkin",
    denied: "Bildirimler Engellendi",
    unsupported: "Desteklenmiyor",
    tooltip: "Yeni makaleler yayınlandığında anında bildirim alın",
  },
};

type PushState = "default" | "granted" | "denied" | "unsupported" | "loading";

export default function PushNotificationButton({ compact = false }: { compact?: boolean }) {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang] || UI_TEXT.en;
  const [state, setState] = useState<PushState>("default");

  const subscribeMutation = trpc.push.subscribe.useMutation();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    // Check current permission
    const permission = Notification.permission;
    if (permission === "granted") {
      // Check if already subscribed
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setState(sub ? "granted" : "default");
        });
      });
    } else if (permission === "denied") {
      setState("denied");
    }
  }, []);

  const handleSubscribe = async () => {
    if (state !== "default") return;
    setState("loading");

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      // Get VAPID public key from env
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error("[Push] VAPID public key not configured");
        setState("default");
        return;
      }

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as ArrayBuffer,
      });

      // Send subscription to server
      const subJson = subscription.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: subJson.endpoint!,
        p256dh: subJson.keys!.p256dh!,
        auth: subJson.keys!.auth!,
        language: lang,
      });

      setState("granted");
    } catch (error) {
      console.error("[Push] Subscription error:", error);
      setState("default");
    }
  };

  if (state === "unsupported") return null;

  if (compact) {
    return (
      <button
        onClick={handleSubscribe}
        disabled={state !== "default"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          state === "granted"
            ? "bg-teal-100 text-teal-700 cursor-default"
            : state === "denied"
            ? "bg-red-100 text-red-600 cursor-not-allowed"
            : state === "loading"
            ? "bg-gray-100 text-gray-500 cursor-wait"
            : "bg-teal-600 text-white hover:bg-teal-700 active:scale-97"
        }`}
        title={t.tooltip}
      >
        {state === "granted" ? (
          <BellActiveIcon />
        ) : state === "denied" ? (
          <BellSlashIcon />
        ) : (
          <BellIcon />
        )}
        <span>
          {state === "granted" ? t.enabled : state === "denied" ? t.denied : state === "loading" ? "..." : t.enable}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={state !== "default"}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        state === "granted"
          ? "bg-teal-50 text-teal-700 border border-teal-200 cursor-default"
          : state === "denied"
          ? "bg-red-50 text-red-600 border border-red-200 cursor-not-allowed"
          : state === "loading"
          ? "bg-gray-50 text-gray-500 border border-gray-200 cursor-wait"
          : "bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow active:scale-97"
      }`}
      title={t.tooltip}
    >
      {state === "granted" ? (
        <BellActiveIcon />
      ) : state === "denied" ? (
        <BellSlashIcon />
      ) : state === "loading" ? (
        <SpinnerIcon />
      ) : (
        <BellIcon />
      )}
      <span>
        {state === "granted" ? t.enabled : state === "denied" ? t.denied : state === "loading" ? "..." : t.enable}
      </span>
    </button>
  );
}

// Helper: Convert base64url to Uint8Array for applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function BellIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function BellActiveIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function BellSlashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11M6 6l12 12M13.73 21a2 2 0 01-3.46 0M6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
