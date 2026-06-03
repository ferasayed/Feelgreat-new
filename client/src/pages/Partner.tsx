import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, Users, DollarSign, GraduationCap, Globe, Award, TrendingUp, Phone, Sparkles, Target, Clock, Heart } from "lucide-react";

function PartnerNavbar() {
  const { lang } = useLanguage();
  return (
    <nav className="fixed top-0 start-0 end-0 z-50 glass-effect shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="text-xl font-bold text-primary">Feel Great</a>
        <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="gradient-blue text-white border-0">
            <Phone className="w-4 h-4 me-2" />
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </Button>
        </a>
      </div>
    </nav>
  );
}

function IncomeCalculator() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState(10);
  const [teamSize, setTeamSize] = useState(5);

  const avgOrderValue = 150; // USD
  const commissionRate = 0.25;
  const teamBonus = 0.10;

  const personalIncome = customers * avgOrderValue * commissionRate;
  const teamIncome = teamSize * 5 * avgOrderValue * teamBonus;
  const totalMonthly = personalIncome + teamIncome;

  const labels: Record<string, Record<string, string>> = {
    ar: { title: "حاسبة الدخل التقديرية", customers: "عدد عملائك الشخصيين", team: "عدد أعضاء فريقك", personal: "دخلك الشخصي", teamIncome: "عمولة الفريق", total: "الدخل الشهري التقديري", disclaimer: "* الأرقام تقديرية وتعتمد على الأداء الفعلي", perMonth: "شهرياً" },
    en: { title: "Estimated Income Calculator", customers: "Your Personal Customers", team: "Your Team Members", personal: "Personal Income", teamIncome: "Team Commission", total: "Estimated Monthly Income", disclaimer: "* Figures are estimates based on actual performance", perMonth: "per month" },
    fr: { title: "Calculateur de Revenus Estimés", customers: "Vos Clients Personnels", team: "Membres de Votre Équipe", personal: "Revenu Personnel", teamIncome: "Commission d'Équipe", total: "Revenu Mensuel Estimé", disclaimer: "* Les chiffres sont des estimations", perMonth: "par mois" },
    es: { title: "Calculadora de Ingresos Estimados", customers: "Tus Clientes Personales", team: "Miembros de Tu Equipo", personal: "Ingreso Personal", teamIncome: "Comisión de Equipo", total: "Ingreso Mensual Estimado", disclaimer: "* Las cifras son estimaciones", perMonth: "por mes" },
    de: { title: "Geschätzter Einkommensrechner", customers: "Ihre persönlichen Kunden", team: "Ihre Teammitglieder", personal: "Persönliches Einkommen", teamIncome: "Team-Provision", total: "Geschätztes Monatseinkommen", disclaimer: "* Zahlen sind Schätzungen", perMonth: "pro Monat" },
    tr: { title: "Tahmini Gelir Hesaplayıcı", customers: "Kişisel Müşterileriniz", team: "Ekip Üyeleriniz", personal: "Kişisel Gelir", teamIncome: "Ekip Komisyonu", total: "Tahmini Aylık Gelir", disclaimer: "* Rakamlar tahminidir", perMonth: "aylık" },
  };
  const l = labels[lang] || labels.en;

  return (
    <section className="py-24 gradient-section">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              Income Calculator
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{l.title}</h2>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">{l.customers}: <span className="text-primary font-bold">{customers}</span></label>
                    <input type="range" min="1" max="50" value={customers} onChange={e => setCustomers(Number(e.target.value))} className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">{l.team}: <span className="text-primary font-bold">{teamSize}</span></label>
                    <input type="range" min="0" max="50" value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                </div>

                <div className="space-y-4 bg-primary/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.personal}</span>
                    <span className="font-bold text-green-600">${personalIncome.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{l.teamIncome}</span>
                    <span className="font-bold text-green-600">${teamIncome.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{l.total}</span>
                      <div className="text-end">
                        <span className="text-2xl font-bold text-gradient-gold">${totalMonthly.toFixed(0)}</span>
                        <span className="text-xs text-muted-foreground block">{l.perMonth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">{l.disclaimer}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function Partner() {
  const { lang } = useLanguage();

  const steps: Record<string, Array<{ num: string; title: string; desc: string }>> = {
    ar: [
      { num: "01", title: "سجّل حسابك", desc: "أنشئ حسابك المجاني على منصة يونيسيتي وابدأ رحلتك" },
      { num: "02", title: "جرّب المنتج", desc: "ابدأ باستخدام نظام Feel Great بنفسك واختبر النتائج" },
      { num: "03", title: "شارك تجربتك", desc: "شارك قصتك مع من حولك وساعدهم على تحسين صحتهم" },
      { num: "04", title: "ابنِ فريقك", desc: "ادعُ آخرين للانضمام وابنِ شبكة شركاء ناجحة" },
      { num: "05", title: "اكسب ونمّي دخلك", desc: "احصل على عمولات متنامية من مبيعاتك ومبيعات فريقك" },
    ],
    en: [
      { num: "01", title: "Create Your Account", desc: "Sign up for free on the Unicity platform and start your journey" },
      { num: "02", title: "Try the Product", desc: "Start using the Feel Great system yourself and experience results" },
      { num: "03", title: "Share Your Story", desc: "Share your experience with others and help them improve their health" },
      { num: "04", title: "Build Your Team", desc: "Invite others to join and build a successful partner network" },
      { num: "05", title: "Earn & Grow", desc: "Get growing commissions from your sales and your team's sales" },
    ],
    fr: [
      { num: "01", title: "Créez Votre Compte", desc: "Inscrivez-vous gratuitement sur la plateforme Unicity" },
      { num: "02", title: "Essayez le Produit", desc: "Utilisez le système Feel Great et expérimentez les résultats" },
      { num: "03", title: "Partagez Votre Histoire", desc: "Partagez votre expérience et aidez les autres" },
      { num: "04", title: "Construisez Votre Équipe", desc: "Invitez d'autres personnes à rejoindre votre réseau" },
      { num: "05", title: "Gagnez et Grandissez", desc: "Obtenez des commissions croissantes" },
    ],
    es: [
      { num: "01", title: "Crea Tu Cuenta", desc: "Regístrate gratis en la plataforma Unicity" },
      { num: "02", title: "Prueba el Producto", desc: "Usa el sistema Feel Great y experimenta los resultados" },
      { num: "03", title: "Comparte Tu Historia", desc: "Comparte tu experiencia y ayuda a otros" },
      { num: "04", title: "Construye Tu Equipo", desc: "Invita a otros a unirse a tu red" },
      { num: "05", title: "Gana y Crece", desc: "Obtén comisiones crecientes" },
    ],
    de: [
      { num: "01", title: "Konto Erstellen", desc: "Registrieren Sie sich kostenlos auf der Unicity-Plattform" },
      { num: "02", title: "Produkt Testen", desc: "Verwenden Sie das Feel Great System selbst" },
      { num: "03", title: "Geschichte Teilen", desc: "Teilen Sie Ihre Erfahrung mit anderen" },
      { num: "04", title: "Team Aufbauen", desc: "Laden Sie andere ein, Ihrem Netzwerk beizutreten" },
      { num: "05", title: "Verdienen und Wachsen", desc: "Erhalten Sie wachsende Provisionen" },
    ],
    tr: [
      { num: "01", title: "Hesap Oluşturun", desc: "Unicity platformuna ücretsiz kaydolun" },
      { num: "02", title: "Ürünü Deneyin", desc: "Feel Great sistemini kendiniz kullanın" },
      { num: "03", title: "Hikayenizi Paylaşın", desc: "Deneyiminizi başkalarıyla paylaşın" },
      { num: "04", title: "Ekibinizi Kurun", desc: "Başkalarını ağınıza katılmaya davet edin" },
      { num: "05", title: "Kazanın ve Büyüyün", desc: "Artan komisyonlar elde edin" },
    ],
  };

  const s = steps[lang] || steps.en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PartnerNavbar />

      {/* Hero */}
      <section className="gradient-hero pt-24 pb-16 text-white">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {lang === "ar" ? "فرصة شراكة حقيقية" : "A Real Partnership Opportunity"}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {lang === "ar" ? "كيف تصبح شريكاً في Feel Great؟" : "How to Become a Feel Great Partner?"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {lang === "ar" ? "خطوات بسيطة لبدء رحلتك في بناء دخل إضافي مستدام مع فريق داعم" : "Simple steps to start building sustainable additional income with a supportive team"}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {s.map((step, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl gradient-blue text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  {i < s.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-2"></div>}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Calculator */}
      <IncomeCalculator />

      {/* CTA */}
      <section className="py-16 gradient-hero text-white text-center">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {lang === "ar" ? "مستعد للبدء؟" : "Ready to Start?"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-10 py-6 gradient-gold text-foreground font-bold border-0 hover:opacity-90">
                {lang === "ar" ? "سجّل كشريك الآن" : "Register as Partner"}
                <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
              </Button>
            </a>
            <a href="https://wa.me/96877020770?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%83%D8%B4%D8%B1%D9%8A%D9%83" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Phone className="w-5 h-5 me-2" />
                {lang === "ar" ? "تواصل مع فراس" : "Contact Feras"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-foreground text-white/60 text-center">
        <div className="container">
          <a href="/" className="text-white font-bold hover:text-white/80 transition-colors">← {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}</a>
          <p className="text-xs mt-4">© 2024 Feel Great. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
