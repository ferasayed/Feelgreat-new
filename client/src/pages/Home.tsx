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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Unimate Card */}
          <Card className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("products.unimate.title")}</h3>
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
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("products.balance.title")}</h3>
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
  const { t } = useLanguage();

  const testimonials = ["t1", "t2", "t3", "t4"];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("test.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("test.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map(key => (
            <Card key={key} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed italic">"{t(`test.${key}.text`)}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-sm">{t(`test.${key}.name`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`test.${key}.country`)}</p>
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

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 bg-foreground text-white/60">
      <div className="container text-center">
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
      <RegistrationForm />
      <Footer />
      <ChatWidget />
    </div>
  );
}
