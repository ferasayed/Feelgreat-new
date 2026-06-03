import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, ChevronDown, Zap, Heart, TrendingUp, Users, DollarSign, Clock, GraduationCap, Star, MessageCircle, X, Send, ArrowUp } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

function LanguageSwitcher() {
  const { lang, setLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === lang)?.nativeName}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full mt-2 end-0 bg-white rounded-xl shadow-xl border border-border p-2 min-w-[160px] z-50">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${lang === l.code ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}
            >
              <span className="me-2">{l.flag}</span>
              {l.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const { t, dir } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 start-0 end-0 z-50 glass-effect">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="text-xl font-bold text-primary">
          Feel Great
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#products" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.products")}</a>
          <a href="#how" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.opportunity")}</a>
          <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.testimonials")}</a>
          <a href="#register" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{t("nav.register")}</a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="hidden sm:inline-flex">{t("hero.cta")}</Button>
          </a>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white p-4 space-y-3">
          <a href="#products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{t("nav.products")}</a>
          <a href="#how" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{t("nav.opportunity")}</a>
          <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{t("nav.testimonials")}</a>
          <a href="#register" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{t("nav.register")}</a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="gradient-hero min-h-[90vh] flex items-center pt-16 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/manus-storage/feel-great-lifestyle_c7373188.png"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 start-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Unicity International</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up stagger-1 leading-tight">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 animate-fade-in-up stagger-2 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 py-6 animate-pulse-glow bg-primary hover:bg-primary/90">
                {t("hero.cta")}
                <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
              </Button>
            </a>
            <a href="#opportunity">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent">
                {t("hero.cta2")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const { t } = useLanguage();

  return (
    <section id="products" className="py-24 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("products.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("products.subtitle")}</p>
        </div>

        {/* Product Images Showcase */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <img
              src="/manus-storage/feel-great-system_b22dc6e2.png"
              alt="Feel Great Pack - Unimate + Balance"
              className="w-64 md:w-80 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Unimate Card */}
          <Card className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/manus-storage/unimate-product_c205b611.png"
                  alt="Unimate"
                  className="w-24 h-24 object-contain rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold">{t("products.unimate.title")}</h3>
                  <p className="text-sm text-green-600 font-medium">Energy | Performance | Attitude</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t("products.unimate.desc")}</p>
              <ul className="space-y-3">
                {["b1", "b2", "b3", "b4"].map(key => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm text-foreground/80">{t(`products.unimate.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Balance Card */}
          <Card className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/manus-storage/balance-product_c1f1843f.png"
                  alt="Balance"
                  className="w-24 h-24 object-contain rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold">{t("products.balance.title")}</h3>
                  <p className="text-sm text-blue-600 font-medium">Fiber | Metabolism | Wellness</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t("products.balance.desc")}</p>
              <ul className="space-y-3">
                {["b1", "b2", "b3", "b4"].map(key => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm text-foreground/80">{t(`products.balance.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    { key: "step1", icon: <Zap className="w-6 h-6" />, color: "bg-amber-100 text-amber-600" },
    { key: "step2", icon: <Heart className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
    { key: "step3", icon: <TrendingUp className="w-6 h-6" />, color: "bg-green-100 text-green-600" },
  ];

  return (
    <section id="how" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("how.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("how.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.key} className="text-center group">
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -end-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{t(`how.${step.key}.title`)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(`how.${step.key}.desc`)}</p>
            </div>
          ))}
        </div>

        {/* Product Gallery */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <img src="/manus-storage/unimate-lemon_6de9f9cb.png" alt="Unimate Lemon" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full aspect-square object-cover" />
          <img src="/manus-storage/balance-citrus_04f0562e.png" alt="Balance Citrus" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full aspect-square object-cover" />
          <img src="/manus-storage/unimate-matcha_518af93e.png" alt="Unimate Matcha" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full aspect-square object-cover" />
          <img src="/manus-storage/feel-great-complete_44bb8752.png" alt="Feel Great Complete Pack" className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 w-full aspect-square object-cover" />
        </div>
      </div>
    </section>
  );
}

function OpportunitySection() {
  const { t } = useLanguage();

  const benefits = [
    { key: "benefit1", icon: <DollarSign className="w-7 h-7" />, color: "bg-green-100 text-green-600" },
    { key: "benefit2", icon: <Clock className="w-7 h-7" />, color: "bg-purple-100 text-purple-600" },
    { key: "benefit3", icon: <Globe className="w-7 h-7" />, color: "bg-blue-100 text-blue-600" },
    { key: "benefit4", icon: <GraduationCap className="w-7 h-7" />, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <section id="opportunity" className="py-24 gradient-hero text-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("opp.title")}</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{t("opp.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {benefits.map(b => (
            <div key={b.key} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className={`w-14 h-14 rounded-xl ${b.color} flex items-center justify-center mb-4`}>
                {b.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{t(`opp.${b.key}.title`)}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{t(`opp.${b.key}.desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90 font-bold">
              {t("opp.cta")}
              <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t, lang } = useLanguage();

  const successImages = [
    { src: "/manus-storage/weight-before-after-1_f52d86b8.jpg", alt: "Weight loss transformation - Feel Great" },
    { src: "/manus-storage/weight-before-after-3_70016147.jpg", alt: "29.5 kg lost with Feel Great" },
    { src: "/manus-storage/weight-before-after-4_6bc9871a.jpg", alt: "Before and after Feel Great" },
    { src: "/manus-storage/weight-before-after-5_3564c26b.jpg", alt: "Feel Great transformation" },
  ];

  const realStories: Record<string, Array<{text: string; name: string; country: string; result: string}>> = {
    ar: [
      { text: "خسرت 29.5 كيلو مع برنامج Feel Great بدون حرمان وبدون أي صعوبات! من 101.4 كيلو إلى 72 كيلو في أقل من سنة.", name: "أم محمد", country: "السعودية", result: "-29.5 كغ" },
      { text: "كنت صاحبة وزن وأحب الأكل، ومع ذلك نزلت وزني بسهولة مع Feel Great. النتيجة تتكلم عن نفسها!", name: "سارة", country: "الإمارات", result: "تحول كامل" },
      { text: "مستوى السكر عندي انضبط بشكل ملحوظ بعد شهرين من استخدام Unimate و Balance. الطبيب أكد التحسن.", name: "أبو خالد", country: "الكويت", result: "سكر منضبط" },
      { text: "طاقتي تغيرت بالكامل! صرت أصحى نشيطة وأنام مرتاحة. Feel Great غير حياتي.", name: "نورة", country: "البحرين", result: "طاقة عالية" },
    ],
    en: [
      { text: "I lost 29.5 kg with Feel Great without any deprivation! From 101.4 kg to 72 kg in less than a year.", name: "Sarah M.", country: "Saudi Arabia", result: "-29.5 kg" },
      { text: "I loved food and struggled with weight, yet Feel Great made it effortless. The results speak for themselves!", name: "Amira K.", country: "UAE", result: "Full transformation" },
      { text: "My blood sugar levels normalized significantly after 2 months of Unimate and Balance. Doctor confirmed the improvement.", name: "Ahmed R.", country: "Kuwait", result: "Balanced glucose" },
      { text: "My energy completely transformed! I wake up energized and sleep peacefully. Feel Great changed my life.", name: "Noura H.", country: "Bahrain", result: "High energy" },
    ],
    fr: [
      { text: "J'ai perdu 29,5 kg avec Feel Great sans aucune privation ! De 101,4 kg à 72 kg en moins d'un an.", name: "Sarah M.", country: "Arabie Saoudite", result: "-29,5 kg" },
      { text: "J'adorais manger et je luttais avec mon poids, mais Feel Great a rendu cela facile.", name: "Amira K.", country: "Émirats", result: "Transformation" },
      { text: "Ma glycémie s'est normalisée après 2 mois d'Unimate et Balance. Le médecin a confirmé.", name: "Ahmed R.", country: "Koweït", result: "Glycémie stable" },
      { text: "Mon énergie a complètement changé ! Je me réveille en forme et je dors paisiblement.", name: "Noura H.", country: "Bahreïn", result: "Pleine énergie" },
    ],
    es: [
      { text: "Perdí 29,5 kg con Feel Great sin privaciones. De 101,4 kg a 72 kg en menos de un año.", name: "Sarah M.", country: "Arabia Saudita", result: "-29,5 kg" },
      { text: "Me encantaba comer y luchaba con mi peso, pero Feel Great lo hizo fácil.", name: "Amira K.", country: "Emiratos", result: "Transformación" },
      { text: "Mi glucosa se normalizó después de 2 meses con Unimate y Balance.", name: "Ahmed R.", country: "Kuwait", result: "Glucosa estable" },
      { text: "¡Mi energía cambió por completo! Me despierto con energía y duermo tranquila.", name: "Noura H.", country: "Bahréin", result: "Alta energía" },
    ],
    de: [
      { text: "Ich habe 29,5 kg mit Feel Great verloren, ohne Verzicht! Von 101,4 kg auf 72 kg in weniger als einem Jahr.", name: "Sarah M.", country: "Saudi-Arabien", result: "-29,5 kg" },
      { text: "Ich liebte Essen und kämpfte mit meinem Gewicht, aber Feel Great machte es mühelos.", name: "Amira K.", country: "VAE", result: "Transformation" },
      { text: "Mein Blutzucker normalisierte sich nach 2 Monaten mit Unimate und Balance deutlich.", name: "Ahmed R.", country: "Kuwait", result: "Stabile Glukose" },
      { text: "Meine Energie hat sich komplett verändert! Ich wache energiegeladen auf.", name: "Noura H.", country: "Bahrain", result: "Hohe Energie" },
    ],
    tr: [
      { text: "Feel Great ile 29,5 kg verdim, hiçbir mahrumiyet olmadan! Bir yıldan kısa sürede.", name: "Sarah M.", country: "Suudi Arabistan", result: "-29,5 kg" },
      { text: "Yemek yemeyi seviyordum ama Feel Great bunu kolaylaştırdı.", name: "Amira K.", country: "BAE", result: "Dönüşüm" },
      { text: "Kan şekerim 2 ay Unimate ve Balance kullandıktan sonra belirgin şekilde düzeldi.", name: "Ahmed R.", country: "Kuveyt", result: "Dengeli glukoz" },
      { text: "Enerjim tamamen değişti! Enerjik uyanıyorum ve huzurlu uyuyorum.", name: "Noura H.", country: "Bahreyn", result: "Yüksek enerji" },
    ],
  };

  const stories = realStories[lang] || realStories.en;

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("test.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("test.subtitle")}</p>
        </div>

        {/* Real Before/After Image Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          {successImages.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow aspect-[3/4]">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Written Testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stories.map((story, i) => (
            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{story.result}</span>
                </div>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed italic">"{story.text}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-sm">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegistrationForm() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", country: "" });
  const [submitted, setSubmitted] = useState(false);

  const registerMutation = trpc.leads.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("form.success"));
    },
    onError: () => {
      toast.error(t("form.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) return;
    registerMutation.mutate({ ...formData, source: `landing-${lang}` });
  };

  const countries = ["sa", "ae", "eg", "jo", "us", "uk", "fr", "de", "es", "tr", "other"];

  if (submitted) {
    return (
      <section id="register" className="py-24 gradient-section">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">{t("form.success")}</h3>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="mt-6">{t("hero.cta")}</Button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 gradient-section">
      <div className="container">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("form.title")}</h2>
            <p className="text-muted-foreground">{t("form.subtitle")}</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.name")}</label>
                  <Input
                    value={formData.fullName}
                    onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                    placeholder={t("form.name")}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.email")}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder={t("form.email")}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.phone")}</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder={t("form.phone")}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.country")}</label>
                  <Select value={formData.country} onValueChange={v => setFormData(p => ({ ...p, country: v }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t("form.country")} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c} value={c}>{t(`country.${c}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg font-bold"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "..." : t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MediaSection() {
  const { t, lang } = useLanguage();

  const audioSrc = lang === "ar" 
    ? "/manus-storage/feel-great-arabic-pitch_74bf40c9.wav"
    : "/manus-storage/feel-great-english-pitch_d355da1d.wav";

  const mediaLabels: Record<string, { videoTitle: string; videoDesc: string; audioTitle: string; audioDesc: string; }> = {
    ar: { videoTitle: "شاهد قصة Feel Great", videoDesc: "اكتشف كيف يمكن لبرنامج Feel Great أن يغير حياتك الصحية ويفتح لك أبواب الدخل", audioTitle: "استمع للعرض التقديمي", audioDesc: "استمع لشرح مفصل عن البرنامج وفرصة العمل" },
    en: { videoTitle: "Watch the Feel Great Story", videoDesc: "Discover how Feel Great can transform your health and open doors to income", audioTitle: "Listen to the Presentation", audioDesc: "Hear a detailed explanation of the program and business opportunity" },
    fr: { videoTitle: "Regardez l'histoire Feel Great", videoDesc: "Découvrez comment Feel Great peut transformer votre santé et ouvrir des portes au revenu", audioTitle: "Écoutez la présentation", audioDesc: "Écoutez une explication détaillée du programme et de l'opportunité" },
    es: { videoTitle: "Mira la historia de Feel Great", videoDesc: "Descubre cómo Feel Great puede transformar tu salud y abrir puertas al ingreso", audioTitle: "Escucha la presentación", audioDesc: "Escucha una explicación detallada del programa y la oportunidad" },
    de: { videoTitle: "Sehen Sie die Feel Great Geschichte", videoDesc: "Entdecken Sie, wie Feel Great Ihre Gesundheit verändern und Einkommenstüren öffnen kann", audioTitle: "Hören Sie die Präsentation", audioDesc: "Hören Sie eine detaillierte Erklärung des Programms und der Geschäftsmöglichkeit" },
    tr: { videoTitle: "Feel Great Hikayesini İzleyin", videoDesc: "Feel Great'in sağlığınızı nasıl dönüştürebileceğini ve gelir kapılarını nasıl açabileceğini keşfedin", audioTitle: "Sunumu Dinleyin", audioDesc: "Program ve iş fırsatı hakkında ayrıntılı bir açıklama dinleyin" },
  };

  const labels = mediaLabels[lang] || mediaLabels.en;

  return (
    <section id="media" className="py-24 bg-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Video Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{labels.videoTitle}</h2>
              <p className="text-muted-foreground">{labels.videoDesc}</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                controls
                className="w-full aspect-video bg-black"
                poster="/manus-storage/feel-great-display_2cf28e12.png"
              >
                <source src="/manus-storage/feel-great-promo-full_b58cdd1b.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Audio Section */}
          <div className="bg-gradient-to-br from-primary/5 to-green-50 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-3">{labels.audioTitle}</h3>
                <p className="text-muted-foreground mb-6">{labels.audioDesc}</p>
                <audio controls className="w-full">
                  <source src={audioSrc} type="audio/wav" />
                </audio>
              </div>
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShareSection() {
  const { lang } = useLanguage();
  const shareUrl = "https://ufeelgreat.com/c/GBP556";

  const shareLabels: Record<string, { title: string; desc: string; whatsapp: string; telegram: string; twitter: string; facebook: string; copy: string; copied: string; }> = {
    ar: { title: "شارك الفرصة مع أصدقائك", desc: "ساعد الآخرين على اكتشاف برنامج Feel Great وابنِ شبكتك", whatsapp: "واتساب", telegram: "تيليجرام", twitter: "تويتر", facebook: "فيسبوك", copy: "نسخ الرابط", copied: "تم النسخ!" },
    en: { title: "Share the Opportunity", desc: "Help others discover Feel Great and grow your network", whatsapp: "WhatsApp", telegram: "Telegram", twitter: "Twitter", facebook: "Facebook", copy: "Copy Link", copied: "Copied!" },
    fr: { title: "Partagez l'opportunité", desc: "Aidez les autres à découvrir Feel Great et développez votre réseau", whatsapp: "WhatsApp", telegram: "Telegram", twitter: "Twitter", facebook: "Facebook", copy: "Copier le lien", copied: "Copié!" },
    es: { title: "Comparte la oportunidad", desc: "Ayuda a otros a descubrir Feel Great y haz crecer tu red", whatsapp: "WhatsApp", telegram: "Telegram", twitter: "Twitter", facebook: "Facebook", copy: "Copiar enlace", copied: "¡Copiado!" },
    de: { title: "Teile die Chance", desc: "Hilf anderen, Feel Great zu entdecken und baue dein Netzwerk auf", whatsapp: "WhatsApp", telegram: "Telegram", twitter: "Twitter", facebook: "Facebook", copy: "Link kopieren", copied: "Kopiert!" },
    tr: { title: "Fırsatı Paylaşın", desc: "Başkalarının Feel Great'i keşfetmesine yardımcı olun ve ağınızı büyütün", whatsapp: "WhatsApp", telegram: "Telegram", twitter: "Twitter", facebook: "Facebook", copy: "Linki kopyala", copied: "Kopyalandı!" },
  };

  const labels = shareLabels[lang] || shareLabels.en;
  const [copied, setCopied] = useState(false);

  const shareMessages: Record<string, string> = {
    ar: "اكتشف برنامج Feel Great من يونيسيتي - صحة أفضل ودخل إضافي! 🌟",
    en: "Discover the Feel Great program by Unicity - Better health and extra income! 🌟",
    fr: "Découvrez le programme Feel Great de Unicity - Meilleure santé et revenu supplémentaire! 🌟",
    es: "¡Descubre el programa Feel Great de Unicity - Mejor salud e ingresos extra! 🌟",
    de: "Entdecken Sie das Feel Great Programm von Unicity - Bessere Gesundheit und Zusatzeinkommen! 🌟",
    tr: "Unicity'nin Feel Great programını keşfedin - Daha iyi sağlık ve ek gelir! 🌟",
  };

  const msg = encodeURIComponent(shareMessages[lang] || shareMessages.en);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-green-50">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{labels.title}</h2>
          <p className="text-muted-foreground mb-8">{labels.desc}</p>
          {/* Downloadable Social Media Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <a href="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-card-ar-8oskWWSerZR8mLGL6HhDXd.png" download className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-card-ar-bjUJiGgudz4Xb45hbro54E.webp" alt="Social Card Arabic" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-sm">{lang === 'ar' ? 'تحميل البطاقة' : 'Download Card'}</span>
              </div>
            </a>
            <a href="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-card-en-By7sWjN6VXmBPkGDkjUPYe.png" download className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-card-en-S5yj7BFqzv4UGE88SMHA5R.webp" alt="Social Card English" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-sm">{lang === 'ar' ? 'تحميل البطاقة' : 'Download Card'}</span>
              </div>
            </a>
            <a href="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-story-card-LvBYeMDCc52QNNcawFtRMM.png" download className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029164169/KMmJgS8DJyxaj36byhCKeJ/social-story-card-TQ9XfmSHf5CU2naFwCjFJS.webp" alt="Story Card" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-sm">{lang === 'ar' ? 'تحميل الستوري' : 'Download Story'}</span>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${msg}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {labels.whatsapp}
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0088cc] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              {labels.telegram}
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${msg}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1DA1F2] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              {labels.twitter}
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1877F2] text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {labels.facebook}
            </a>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              {copied ? labels.copied : labels.copy}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="py-8 bg-foreground text-white/60">
      <div className="container text-center">
        <div className="mb-4 flex justify-center gap-6 text-sm">
          <a href="/faq" className="hover:text-white transition-colors">
            {lang === "ar" ? "الأسئلة الشائعة" : lang === "fr" ? "FAQ" : lang === "es" ? "Preguntas Frecuentes" : lang === "de" ? "FAQ" : lang === "tr" ? "SSS" : "FAQ"}
          </a>
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            {lang === "ar" ? "سجّل الآن" : "Register"}
          </a>
        </div>
        <p className="text-sm mb-2">© 2024 Feel Great Partner. {t("footer.rights")}</p>
        <p className="text-xs">{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <HowItWorksSection />
      <OpportunitySection />
      <TestimonialsSection />
      <MediaSection />
      <RegistrationForm />
      <ShareSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
