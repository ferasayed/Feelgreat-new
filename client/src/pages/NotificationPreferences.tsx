import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BookOpen, FlaskConical, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

// Multilingual labels
const LABELS: Record<string, {
  title: string;
  subtitle: string;
  articles: string;
  articlesDesc: string;
  research: string;
  researchDesc: string;
  saveBtn: string;
  savedMsg: string;
  notSubscribed: string;
  subscribeFirst: string;
  enableNotifications: string;
  notSupported: string;
  notSupportedDesc: string;
  back: string;
  status: string;
  active: string;
  inactive: string;
}> = {
  ar: {
    title: "إعدادات الإشعارات",
    subtitle: "اختر نوع المحتوى الذي تريد تلقي إشعارات عنه",
    articles: "المقالات الصحية",
    articlesDesc: "إشعار عند نشر مقال جديد عن الصحة والتغذية",
    research: "الأبحاث العلمية",
    researchDesc: "إشعار عند إضافة بحث علمي جديد من المجلات المحكّمة",
    saveBtn: "حفظ التفضيلات",
    savedMsg: "تم حفظ تفضيلاتك بنجاح",
    notSubscribed: "لم تشترك في الإشعارات بعد",
    subscribeFirst: "يجب تفعيل الإشعارات أولاً لتتمكن من تخصيص تفضيلاتك",
    enableNotifications: "تفعيل الإشعارات",
    notSupported: "الإشعارات غير مدعومة",
    notSupportedDesc: "متصفحك لا يدعم إشعارات Push. جرّب استخدام Chrome أو Firefox أو Edge.",
    back: "العودة للرئيسية",
    status: "حالة الإشعارات",
    active: "مفعّلة",
    inactive: "غير مفعّلة",
  },
  en: {
    title: "Notification Settings",
    subtitle: "Choose which content types you want to receive notifications about",
    articles: "Health Articles",
    articlesDesc: "Get notified when a new health & nutrition article is published",
    research: "Scientific Research",
    researchDesc: "Get notified when new peer-reviewed research is added",
    saveBtn: "Save Preferences",
    savedMsg: "Your preferences have been saved successfully",
    notSubscribed: "Not subscribed to notifications",
    subscribeFirst: "You need to enable notifications first to customize your preferences",
    enableNotifications: "Enable Notifications",
    notSupported: "Notifications not supported",
    notSupportedDesc: "Your browser doesn't support Push notifications. Try Chrome, Firefox, or Edge.",
    back: "Back to Home",
    status: "Notification Status",
    active: "Active",
    inactive: "Inactive",
  },
};

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

export default function NotificationPreferences() {
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifyArticles, setNotifyArticles] = useState(true);
  const [notifyResearch, setNotifyResearch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Detect language from URL or default to ar
  const lang = window.location.pathname.startsWith("/en") ? "en" : "ar";
  const t = LABELS[lang] || LABELS.ar;
  const isRtl = lang === "ar";

  const updatePrefs = trpc.push.updatePreferences.useMutation();

  // Check subscription status on mount
  useEffect(() => {
    async function checkSubscription() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setIsSupported(false);
        setIsLoading(false);
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          setEndpoint(subscription.endpoint);
          setIsSubscribed(true);
        }
      } catch (e) {
        console.error("Error checking subscription:", e);
      }
      setIsLoading(false);
    }
    checkSubscription();
  }, []);

  // Fetch preferences when endpoint is available
  const prefsQuery = trpc.push.getPreferences.useQuery(
    { endpoint: endpoint || "" },
    { enabled: !!endpoint }
  );

  useEffect(() => {
    if (prefsQuery.data) {
      setNotifyArticles(prefsQuery.data.notifyArticles);
      setNotifyResearch(prefsQuery.data.notifyResearch);
    }
  }, [prefsQuery.data]);

  const handleSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const p256dhKey = subscription.getKey("p256dh")!;
      const authKey = subscription.getKey("auth")!;
      const p256dh = btoa(Array.from(new Uint8Array(p256dhKey as ArrayBuffer), (b) => String.fromCharCode(b)).join(""));
      const auth = btoa(Array.from(new Uint8Array(authKey as ArrayBuffer), (b) => String.fromCharCode(b)).join(""));

      // Save to server
      const response = await fetch("/api/trpc/push.subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            endpoint: subscription.endpoint,
            p256dh,
            auth,
            language: lang,
          },
        }),
      });

      if (response.ok) {
        setEndpoint(subscription.endpoint);
        setIsSubscribed(true);
        toast.success(lang === "ar" ? "تم تفعيل الإشعارات بنجاح!" : "Notifications enabled!");
      }
    } catch (e: any) {
      if (e.name === "NotAllowedError") {
        toast.error(lang === "ar" ? "تم رفض إذن الإشعارات. يرجى تفعيلها من إعدادات المتصفح." : "Notification permission denied. Please enable in browser settings.");
      } else {
        toast.error(lang === "ar" ? "حدث خطأ أثناء تفعيل الإشعارات" : "Error enabling notifications");
      }
    }
  };

  const handleSave = async () => {
    if (!endpoint) return;
    setIsSaving(true);
    try {
      await updatePrefs.mutateAsync({
        endpoint,
        notifyArticles,
        notifyResearch,
      });
      toast.success(t.savedMsg);
    } catch (e) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving preferences");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="container max-w-2xl py-12 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
        </div>

        {/* Not Supported */}
        {!isSupported && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">{t.notSupported}</h3>
              <p className="text-muted-foreground">{t.notSupportedDesc}</p>
            </CardContent>
          </Card>
        )}

        {/* Not Subscribed */}
        {isSupported && !isSubscribed && (
          <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6 text-center">
              <Bell className="h-12 w-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">{t.notSubscribed}</h3>
              <p className="text-muted-foreground mb-4">{t.subscribeFirst}</p>
              <Button onClick={handleSubscribe} size="lg" className="gap-2">
                <Bell className="h-4 w-4" />
                {t.enableNotifications}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preferences (when subscribed) */}
        {isSupported && isSubscribed && (
          <>
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">{t.status}:</span>
              <Badge variant="default" className="bg-green-600 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {t.active}
              </Badge>
            </div>

            {/* Preference Cards */}
            <div className="space-y-4">
              {/* Articles Toggle */}
              <Card className={`transition-all duration-200 ${notifyArticles ? "border-primary/50 shadow-sm" : "opacity-75"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${notifyArticles ? "bg-primary/10" : "bg-muted"}`}>
                        <BookOpen className={`h-5 w-5 ${notifyArticles ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{t.articles}</CardTitle>
                        <CardDescription className="text-sm mt-0.5">{t.articlesDesc}</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={notifyArticles}
                      onCheckedChange={setNotifyArticles}
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Research Toggle */}
              <Card className={`transition-all duration-200 ${notifyResearch ? "border-primary/50 shadow-sm" : "opacity-75"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${notifyResearch ? "bg-primary/10" : "bg-muted"}`}>
                        <FlaskConical className={`h-5 w-5 ${notifyResearch ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{t.research}</CardTitle>
                        <CardDescription className="text-sm mt-0.5">{t.researchDesc}</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={notifyResearch}
                      onCheckedChange={setNotifyResearch}
                    />
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSave}
                size="lg"
                disabled={isSaving}
                className="gap-2 min-w-[200px]"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {t.saveBtn}
              </Button>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
