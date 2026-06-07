import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export function NewsletterSection() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const labels: Record<string, {
    title: string; subtitle: string; emailPlaceholder: string; namePlaceholder: string;
    subscribe: string; subscribing: string; success: string; successMsg: string;
    alreadySubscribed: string; error: string; privacy: string;
  }> = {
    ar: {
      title: "انضم لنشرتنا الصحية الأسبوعية",
      subtitle: "احصل على أحدث الأبحاث العلمية والمقالات الصحية ونصائح الخبراء مباشرة في بريدك الإلكتروني",
      emailPlaceholder: "بريدك الإلكتروني",
      namePlaceholder: "اسمك (اختياري)",
      subscribe: "اشترك الآن",
      subscribing: "جاري الاشتراك...",
      success: "تم الاشتراك بنجاح!",
      successMsg: "شكراً لك! ستصلك أحدث المقالات والأبحاث الصحية أسبوعياً.",
      alreadySubscribed: "أنت مشترك بالفعل! شكراً لك.",
      error: "حدث خطأ، يرجى المحاولة مرة أخرى",
      privacy: "نحترم خصوصيتك ولن نشارك بريدك مع أي طرف ثالث",
    },
    en: {
      title: "Join Our Weekly Health Newsletter",
      subtitle: "Get the latest scientific research, health articles, and expert tips delivered to your inbox",
      emailPlaceholder: "Your email address",
      namePlaceholder: "Your name (optional)",
      subscribe: "Subscribe Now",
      subscribing: "Subscribing...",
      success: "Successfully Subscribed!",
      successMsg: "Thank you! You'll receive the latest health articles and research weekly.",
      alreadySubscribed: "You're already subscribed! Thank you.",
      error: "An error occurred, please try again",
      privacy: "We respect your privacy and will never share your email with third parties",
    },
    fr: {
      title: "Rejoignez Notre Newsletter Santé Hebdomadaire",
      subtitle: "Recevez les dernières recherches scientifiques, articles santé et conseils d'experts dans votre boîte mail",
      emailPlaceholder: "Votre adresse email",
      namePlaceholder: "Votre nom (optionnel)",
      subscribe: "S'abonner",
      subscribing: "Abonnement en cours...",
      success: "Abonnement réussi !",
      successMsg: "Merci ! Vous recevrez les derniers articles et recherches santé chaque semaine.",
      alreadySubscribed: "Vous êtes déjà abonné ! Merci.",
      error: "Une erreur est survenue, veuillez réessayer",
      privacy: "Nous respectons votre vie privée et ne partagerons jamais votre email",
    },
    es: {
      title: "Únete a Nuestro Boletín Semanal de Salud",
      subtitle: "Recibe las últimas investigaciones científicas, artículos de salud y consejos de expertos en tu correo",
      emailPlaceholder: "Tu correo electrónico",
      namePlaceholder: "Tu nombre (opcional)",
      subscribe: "Suscribirse",
      subscribing: "Suscribiendo...",
      success: "¡Suscripción exitosa!",
      successMsg: "¡Gracias! Recibirás los últimos artículos e investigaciones de salud semanalmente.",
      alreadySubscribed: "¡Ya estás suscrito! Gracias.",
      error: "Ocurrió un error, inténtalo de nuevo",
      privacy: "Respetamos tu privacidad y nunca compartiremos tu correo con terceros",
    },
    de: {
      title: "Abonnieren Sie Unseren Wöchentlichen Gesundheits-Newsletter",
      subtitle: "Erhalten Sie die neuesten wissenschaftlichen Forschungen, Gesundheitsartikel und Expertentipps direkt in Ihr Postfach",
      emailPlaceholder: "Ihre E-Mail-Adresse",
      namePlaceholder: "Ihr Name (optional)",
      subscribe: "Jetzt Abonnieren",
      subscribing: "Wird abonniert...",
      success: "Erfolgreich Abonniert!",
      successMsg: "Danke! Sie erhalten wöchentlich die neuesten Gesundheitsartikel und Forschungen.",
      alreadySubscribed: "Sie sind bereits abonniert! Danke.",
      error: "Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut",
      privacy: "Wir respektieren Ihre Privatsphäre und teilen Ihre E-Mail niemals mit Dritten",
    },
    tr: {
      title: "Haftalık Sağlık Bültenimize Katılın",
      subtitle: "En son bilimsel araştırmaları, sağlık makalelerini ve uzman ipuçlarını doğrudan gelen kutunuza alın",
      emailPlaceholder: "E-posta adresiniz",
      namePlaceholder: "Adınız (isteğe bağlı)",
      subscribe: "Abone Ol",
      subscribing: "Abone olunuyor...",
      success: "Başarıyla Abone Oldunuz!",
      successMsg: "Teşekkürler! En son sağlık makalelerini ve araştırmaları haftalık olarak alacaksınız.",
      alreadySubscribed: "Zaten abone olmuşsunuz! Teşekkürler.",
      error: "Bir hata oluştu, lütfen tekrar deneyin",
      privacy: "Gizliliğinize saygı duyuyoruz ve e-postanızı asla üçüncü taraflarla paylaşmayız",
    },
  };
  const l = labels[lang] || labels.en;

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email, name: name || undefined, language: lang });
  };

  if (submitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{l.success}</h3>
          <p className="text-muted-foreground">
            {subscribeMutation.data?.alreadySubscribed ? l.alreadySubscribed : l.successMsg}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
      <div className="container max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4">
          <Mail className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{l.title}</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{l.subtitle}</p>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              <Input
                type="text"
                placeholder={l.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={subscribeMutation.isPending || !email}
              >
                {subscribeMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin me-2" />{l.subscribing}</>
                ) : (
                  <><Mail className="w-4 h-4 me-2" />{l.subscribe}</>
                )}
              </Button>
              {subscribeMutation.isError && (
                <p className="text-sm text-red-500">{l.error}</p>
              )}
            </form>
            <p className="text-xs text-muted-foreground mt-4">{l.privacy}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
