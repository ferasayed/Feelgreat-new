import { useEffect, useState } from "react";
import { useSearchParams } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, CheckCircle, Star, Users, TrendingUp, Heart, Phone, MessageCircle } from "lucide-react";

/**
 * Smart Landing Page with UTM tracking
 * Automatically adapts content based on traffic source
 */
export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const [source, setSource] = useState<string>("unknown");

  useEffect(() => {
    // Extract UTM parameters
    const utmSource = searchParams.get("utm_source") || "direct";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";
    const utmContent = searchParams.get("utm_content") || "";
    const ref = searchParams.get("ref") || document.referrer;

    setSource(utmSource);

    // Track the visit
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        event_category: "landing",
        event_label: utmCampaign || utmSource,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        traffic_source: utmSource,
        referral: ref,
      });
    }

    // Update page title based on source
    const titles: Record<string, Record<string, string>> = {
      facebook: {
        ar: "عرض خاص من فراس العايد - خصم 30%",
        en: "Special Offer from Feras Alayed - 30% Off",
      },
      instagram: {
        ar: "فرصتك للتغيير تبدأ هنا 🌟",
        en: "Your Transformation Starts Here 🌟",
      },
      google: {
        ar: "برنامج Feel Great - نتائج مضمونة",
        en: "Feel Great Program - Guaranteed Results",
      },
      email: {
        ar: "عرض حصري لمتابعي فراس",
        en: "Exclusive Offer for Feras's Followers",
      },
      youtube: {
        ar: "انضم لآلاف الناجحين",
        en: "Join Thousands of Success Stories",
      },
    };

    const sourceTitle = titles[utmSource] || titles.google;
    document.title = sourceTitle[lang] || sourceTitle.en;
  }, [searchParams, lang]);

  // Content variations based on source
  const contentVariations: Record<string, {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    highlight: string;
  }> = {
    facebook: {
      heroBadge: "🎯 عرض فيسبوك الحصري",
      heroTitle: lang === "ar" ? "خصم 30% على برنامج 90 يوم" : "30% Off on 90-Day Program",
      heroSubtitle: lang === "ar"
        ? "لأصدقاء فراس على فيسبوك - العرض لفترة محدودة"
        : "For Feras's Facebook Friends - Limited Time Offer",
      highlight: lang === "ar" ? "🎁 استخدم كود: FB30" : "🎁 Use Code: FB30",
    },
    instagram: {
      heroBadge: "✨ عرض الإنستغرام",
      heroTitle: lang === "ar" ? "حوّل صحتك في 90 يوم" : "Transform Your Health in 90 Days",
      heroSubtitle: lang === "ar"
        ? "انضم لأكثر من 10,000 شخص غيّر حياتهم"
        : "Join 10,000+ who transformed their lives",
      highlight: lang === "ar" ? "🎁 مكافأة الإنضمام المبكر" : "🎁 Early Bird Bonus",
    },
    google: {
      heroBadge: "🔬 مدرج في PDR الطبي",
      heroTitle: lang === "ar" ? "المنهج العلمي للتحول الصحي" : "Scientific Method for Health Transformation",
      heroSubtitle: lang === "ar"
        ? "50+ دراسة علمية تدعم النتائج"
        : "50+ Scientific Studies Support Results",
      highlight: lang === "ar" ? "✓ ضمان استرداد كامل خلال 90 يوم" : "✓ 90-Day Money-Back Guarantee",
    },
    youtube: {
      heroBadge: "📺 شاهد قصص النجاح",
      heroTitle: lang === "ar" ? "نفس القصص التي شاهدتها... الآن لك" : "The Same Stories You Watched... Now Yours",
      heroSubtitle: lang === "ar"
        ? "اكتشف كيف غير هؤلاء حياتهم"
        : "Discover how these people changed their lives",
      highlight: lang === "ar" ? "✓ 500+ قصة نجاح موثقة" : "✓ 500+ Documented Success Stories",
    },
    email: {
      heroBadge: "💌 لمتابعي فراس المميزين",
      heroTitle: lang === "ar" ? "شكراً لمتابعتك! 🎁" : "Thanks for Following! 🎁",
      heroSubtitle: lang === "ar"
        ? "عرض خاص لك فقط - لمرة واحدة"
        : "Special Offer Just for You - One Time Only",
      highlight: lang === "ar" ? "🎁 هدية مجانية مع طلبك" : "🎁 Free Gift with Your Order",
    },
    default: {
      heroBadge: "🌟 Feras Alayed Method™",
      heroTitle: lang === "ar" ? "حوّل صحتك. حوّل حياتك." : "Transform Your Health. Transform Your Life.",
      heroSubtitle: lang === "ar"
        ? "برنامج 90 يوم المدعوم علمياً"
        : "90-Day Science-Backed Program",
      highlight: lang === "ar" ? "✓ أكثر من 10,000 ناجح" : "✓ 10,000+ Success Stories",
    },
  };

  const c = contentVariations[source in contentVariations ? source : "default"];

  const benefits: Record<string, Array<{ icon: React.ReactNode; text: string }>> = {
    ar: [
      { icon: <TrendingUp className="w-6 h-6" />, text: "نتائج خلال 90 يوم - أو استرداد كامل" },
      { icon: <Heart className="w-6 h-6" />, text: "يحسّن مقاومة الإنسولين والصحة الأيضية" },
      { icon: <Users className="w-6 h-6" />, text: "دعم فردي من فريق متخصص" },
      { icon: <Star className="w-6 h-6" />, text: "مدرج في PDR المرجع الطبي الأمريكي" },
    ],
    en: [
      { icon: <TrendingUp className="w-6 h-6" />, text: "Results in 90 days - or full refund" },
      { icon: <Heart className="w-6 h-6" />, text: "Improves insulin resistance & metabolic health" },
      { icon: <Users className="w-6 h-6" />, text: "Individual support from specialized team" },
      { icon: <Star className="w-6 h-6" />, text: "Listed in PDR (Physicians' Desk Reference)" },
    ],
  };

  const testimonials: Record<string, Array<{ name: string; country: string; text: string; result: string }>> = {
    ar: [
      { name: "أم محمد", country: "السعودية", text: "خسرت 29.5 كيلو في أقل من سنة!", result: "-29.5 كغ" },
      { name: "سارة", country: "الإمارات", text: "سكر زوجي انضبط بدون أدوية!", result: "سكر منضبط" },
      { name: "نورة", country: "البحرين", text: "طاقتي تغيرت بالكامل! صحيت من النوم", result: "طاقة عالية" },
    ],
    en: [
      { name: "Sarah M.", country: "Saudi Arabia", text: "Lost 29.5 kg in less than a year!", result: "-29.5 kg" },
      { name: "Ahmed R.", country: "UAE", text: "My husband's sugar stabilized without meds!", result: "Balanced sugar" },
      { name: "Noura H.", country: "Bahrain", text: "My energy completely transformed!", result: "High energy" },
    ],
  };

  const b = benefits[lang] || benefits.en;
  const t = testimonials[lang] || testimonials.en;

  const referralLink = "https://ufeelgreat.com/c/GBP556";
  const whatsappLink = `https://wa.me/96877020770?text=${encodeURIComponent(
    lang === "ar"
      ? `جئت من ${source} وأريد معرفة المزيد عن برنامج Feel Great`
      : `I came from ${source} and want to learn more about Feel Great program`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Dynamic Badge based on source */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-6 animate-fade-in-up">
            <Star className="w-4 h-4 text-amber-400" />
            {c.heroBadge}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up stagger-1">
            {c.heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-2">
            {c.heroSubtitle}
          </p>

          {/* Highlight */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 font-bold mb-10 animate-fade-in-up stagger-3">
            {c.highlight}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-4">
            <a href={referralLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-10 py-6 gradient-gold text-foreground font-bold border-0 hover:opacity-90 w-full sm:w-auto">
                {lang === "ar" ? "ابدأ الآن" : "Start Now"}
                <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-green-400/50 text-green-300 hover:bg-green-500/10 bg-transparent w-full sm:w-auto">
                <Phone className="w-5 h-5 me-2" />
                {lang === "ar" ? "تواصل واتساب" : "WhatsApp"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {lang === "ar" ? "لماذا Feel Great؟" : "Why Feel Great?"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {b.map((benefit, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    {benefit.icon}
                  </div>
                  <p className="text-white/90 font-medium">{benefit.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {lang === "ar" ? "قصص نجاح حقيقية" : "Real Success Stories"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {t.map((story, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="flex gap-1 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-4 italic">"{story.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-bold text-sm">{story.name}</p>
                      <p className="text-xs text-white/50">{story.country}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                      {story.result}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === "ar" ? "جاهز لبدء رحلتك؟" : "Ready to Start Your Journey?"}
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {lang === "ar"
              ? "سجّل الآن واحصل على دعم فردي من فريقنا"
              : "Register now and get individual support from our team"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={referralLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-12 py-7 gradient-gold text-foreground font-bold border-0 hover:opacity-90">
                {lang === "ar" ? "سجّل كشريك الآن" : "Register as Partner"}
                <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
              </Button>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-green-400/50 text-green-300 hover:bg-green-500/10 bg-transparent">
                <MessageCircle className="w-5 h-5 me-2" />
                {lang === "ar" ? "تحدث مع فراس" : "Talk to Feras"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Source Attribution - shows what we know about the visitor */}
      <section className="py-8 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/30">
            {lang === "ar"
              ? `📊 تم التتبع: ${source} |_campaign: ${searchParams.get("utm_campaign") || "organic"}`
              : `📊 Tracked: ${source} | Campaign: ${searchParams.get("utm_campaign") || "organic"}`}
          </p>
        </div>
      </section>
    </div>
  );
}
