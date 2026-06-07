import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check, X, Shield, Award, FlaskConical, Globe, Star } from "lucide-react";

const labels: Record<string, {
  title: string;
  subtitle: string;
  cta: string;
  back: string;
  category: string;
  feelGreat: string;
  competitors: string;
  winner: string;
  whyTitle: string;
  whySubtitle: string;
  guaranteeTitle: string;
  guaranteeText: string;
}> = {
  ar: {
    title: "لماذا Feel Great هو الخيار الأفضل؟",
    subtitle: "مقارنة موضوعية مع البدائل المتاحة في السوق",
    cta: "ابدأ تجربتك الآن",
    back: "العودة للرئيسية",
    category: "المعيار",
    feelGreat: "Feel Great",
    competitors: "المنافسون",
    winner: "الفائز",
    whyTitle: "ما الذي يجعل Feel Great مختلفاً؟",
    whySubtitle: "نظام علمي متكامل وليس مجرد مكمل غذائي",
    guaranteeTitle: "ضمان استرداد الأموال خلال 60 يوماً",
    guaranteeText: "جرّب Feel Great بدون مخاطرة. إذا لم تلاحظ فرقاً خلال 60 يوماً، استرد أموالك كاملة.",
  },
  en: {
    title: "Why Feel Great is the Best Choice?",
    subtitle: "An objective comparison with market alternatives",
    cta: "Start Your Journey Now",
    back: "Back to Home",
    category: "Criteria",
    feelGreat: "Feel Great",
    competitors: "Competitors",
    winner: "Winner",
    whyTitle: "What Makes Feel Great Different?",
    whySubtitle: "A complete scientific system, not just a supplement",
    guaranteeTitle: "60-Day Money-Back Guarantee",
    guaranteeText: "Try Feel Great risk-free. If you don't notice a difference within 60 days, get a full refund.",
  },
  fr: {
    title: "Pourquoi Feel Great est le meilleur choix?",
    subtitle: "Comparaison objective avec les alternatives du marché",
    cta: "Commencez maintenant",
    back: "Retour à l'accueil",
    category: "Critère",
    feelGreat: "Feel Great",
    competitors: "Concurrents",
    winner: "Gagnant",
    whyTitle: "Qu'est-ce qui rend Feel Great différent?",
    whySubtitle: "Un système scientifique complet, pas un simple supplément",
    guaranteeTitle: "Garantie de remboursement de 60 jours",
    guaranteeText: "Essayez Feel Great sans risque. Si vous ne remarquez pas de différence en 60 jours, remboursement complet.",
  },
  es: {
    title: "¿Por qué Feel Great es la mejor opción?",
    subtitle: "Comparación objetiva con las alternativas del mercado",
    cta: "Comienza ahora",
    back: "Volver al inicio",
    category: "Criterio",
    feelGreat: "Feel Great",
    competitors: "Competidores",
    winner: "Ganador",
    whyTitle: "¿Qué hace diferente a Feel Great?",
    whySubtitle: "Un sistema científico completo, no solo un suplemento",
    guaranteeTitle: "Garantía de devolución de 60 días",
    guaranteeText: "Prueba Feel Great sin riesgo. Si no notas diferencia en 60 días, reembolso completo.",
  },
  de: {
    title: "Warum ist Feel Great die beste Wahl?",
    subtitle: "Objektiver Vergleich mit Markt-Alternativen",
    cta: "Jetzt starten",
    back: "Zurück zur Startseite",
    category: "Kriterium",
    feelGreat: "Feel Great",
    competitors: "Wettbewerber",
    winner: "Gewinner",
    whyTitle: "Was macht Feel Great anders?",
    whySubtitle: "Ein vollständiges wissenschaftliches System, nicht nur ein Nahrungsergänzungsmittel",
    guaranteeTitle: "60-Tage-Geld-zurück-Garantie",
    guaranteeText: "Testen Sie Feel Great risikofrei. Wenn Sie in 60 Tagen keinen Unterschied bemerken, volle Rückerstattung.",
  },
  tr: {
    title: "Neden Feel Great en iyi seçim?",
    subtitle: "Piyasa alternatifleriyle objektif karşılaştırma",
    cta: "Şimdi başlayın",
    back: "Ana sayfaya dön",
    category: "Kriter",
    feelGreat: "Feel Great",
    competitors: "Rakipler",
    winner: "Kazanan",
    whyTitle: "Feel Great'i farklı kılan nedir?",
    whySubtitle: "Sadece bir takviye değil, eksiksiz bir bilimsel sistem",
    guaranteeTitle: "60 Gün Para İade Garantisi",
    guaranteeText: "Feel Great'i risksiz deneyin. 60 gün içinde fark görmezseniz, tam geri ödeme.",
  },
};

interface ComparisonRow {
  category: Record<string, string>;
  feelGreat: Record<string, string>;
  competitors: Record<string, string>;
  fgWins: boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    category: { ar: "الدعم العلمي", en: "Scientific Backing", fr: "Soutien scientifique", es: "Respaldo científico", de: "Wissenschaftliche Unterstützung", tr: "Bilimsel destek" },
    feelGreat: { ar: "50+ دراسة سريرية، شهادة Informed-Sport", en: "50+ clinical studies, Informed-Sport certified", fr: "50+ études cliniques, certifié Informed-Sport", es: "50+ estudios clínicos, certificado Informed-Sport", de: "50+ klinische Studien, Informed-Sport zertifiziert", tr: "50+ klinik çalışma, Informed-Sport sertifikalı" },
    competitors: { ar: "دراسات محدودة أو غير موجودة", en: "Limited or no studies", fr: "Études limitées ou inexistantes", es: "Estudios limitados o inexistentes", de: "Begrenzte oder keine Studien", tr: "Sınırlı veya hiç çalışma yok" },
    fgWins: true,
  },
  {
    category: { ar: "تقنية الألياف", en: "Fiber Technology", fr: "Technologie des fibres", es: "Tecnología de fibra", de: "Fasertechnologie", tr: "Lif teknolojisi" },
    feelGreat: { ar: "Biosphere Fiber حاصلة على براءة اختراع - 5 ألياف ذائبة", en: "Patented Biosphere Fiber - 5 soluble fibers", fr: "Biosphere Fiber breveté - 5 fibres solubles", es: "Biosphere Fiber patentada - 5 fibras solubles", de: "Patentierte Biosphere Fiber - 5 lösliche Fasern", tr: "Patentli Biosphere Fiber - 5 çözünür lif" },
    competitors: { ar: "ألياف عادية بدون تقنية خاصة", en: "Regular fiber without special technology", fr: "Fibres ordinaires sans technologie spéciale", es: "Fibra regular sin tecnología especial", de: "Gewöhnliche Fasern ohne Spezialtechnologie", tr: "Özel teknolojisi olmayan normal lif" },
    fgWins: true,
  },
  {
    category: { ar: "مستخلص المتة", en: "Yerba Mate Extract", fr: "Extrait de Yerba Maté", es: "Extracto de Yerba Mate", de: "Yerba Mate Extrakt", tr: "Yerba Mate özütü" },
    feelGreat: { ar: "375 ضعف حمض الكلوروجينيك - عملية تنقية 5 خطوات", en: "375x chlorogenic acids - 5-step purification", fr: "375x acides chlorogéniques - purification en 5 étapes", es: "375x ácidos clorogénicos - purificación de 5 pasos", de: "375x Chlorogensäuren - 5-Stufen-Reinigung", tr: "375x klorojenik asit - 5 adımlı arıtma" },
    competitors: { ar: "مستخلصات عادية بتركيز منخفض", en: "Regular extracts with low concentration", fr: "Extraits ordinaires à faible concentration", es: "Extractos regulares de baja concentración", de: "Gewöhnliche Extrakte mit niedriger Konzentration", tr: "Düşük konsantrasyonlu normal özütler" },
    fgWins: true,
  },
  {
    category: { ar: "الضمان", en: "Guarantee", fr: "Garantie", es: "Garantía", de: "Garantie", tr: "Garanti" },
    feelGreat: { ar: "60 يوم استرداد كامل بدون شروط", en: "60-day full refund, no questions asked", fr: "Remboursement complet de 60 jours", es: "Reembolso completo de 60 días", de: "60 Tage volle Rückerstattung", tr: "60 gün tam geri ödeme" },
    competitors: { ar: "30 يوم أو بدون ضمان", en: "30 days or no guarantee", fr: "30 jours ou sans garantie", es: "30 días o sin garantía", de: "30 Tage oder keine Garantie", tr: "30 gün veya garanti yok" },
    fgWins: true,
  },
  {
    category: { ar: "التواجد العالمي", en: "Global Presence", fr: "Présence mondiale", es: "Presencia global", de: "Globale Präsenz", tr: "Küresel varlık" },
    feelGreat: { ar: "50+ دولة، 30+ سنة خبرة", en: "50+ countries, 30+ years experience", fr: "50+ pays, 30+ ans d'expérience", es: "50+ países, 30+ años de experiencia", de: "50+ Länder, 30+ Jahre Erfahrung", tr: "50+ ülke, 30+ yıl deneyim" },
    competitors: { ar: "محلي أو إقليمي فقط", en: "Local or regional only", fr: "Local ou régional uniquement", es: "Solo local o regional", de: "Nur lokal oder regional", tr: "Sadece yerel veya bölgesel" },
    fgWins: true,
  },
  {
    category: { ar: "فرصة الدخل", en: "Income Opportunity", fr: "Opportunité de revenu", es: "Oportunidad de ingresos", de: "Einkommensmöglichkeit", tr: "Gelir fırsatı" },
    feelGreat: { ar: "عضوية مجانية + عمولة 25% + فريق", en: "Free membership + 25% commission + team", fr: "Adhésion gratuite + 25% commission + équipe", es: "Membresía gratis + 25% comisión + equipo", de: "Kostenlose Mitgliedschaft + 25% Provision + Team", tr: "Ücretsiz üyelik + %25 komisyon + ekip" },
    competitors: { ar: "رسوم اشتراك + عمولات أقل", en: "Subscription fees + lower commissions", fr: "Frais d'abonnement + commissions inférieures", es: "Cuotas de suscripción + comisiones menores", de: "Abonnementgebühren + niedrigere Provisionen", tr: "Abonelik ücretleri + düşük komisyonlar" },
    fgWins: true,
  },
  {
    category: { ar: "نظام الصيام المتقطع", en: "Intermittent Fasting Support", fr: "Support du jeûne intermittent", es: "Soporte de ayuno intermitente", de: "Intervallfasten-Unterstützung", tr: "Aralıklı oruç desteği" },
    feelGreat: { ar: "نظام 4-4-12 متكامل - Unimate لا يكسر الصيام", en: "Complete 4-4-12 system - Unimate doesn't break fast", fr: "Système 4-4-12 complet - Unimate ne rompt pas le jeûne", es: "Sistema 4-4-12 completo - Unimate no rompe el ayuno", de: "Komplettes 4-4-12 System - Unimate bricht Fasten nicht", tr: "Tam 4-4-12 sistemi - Unimate orucu bozmaz" },
    competitors: { ar: "لا يدعم الصيام المتقطع", en: "No intermittent fasting support", fr: "Pas de support du jeûne intermittent", es: "Sin soporte de ayuno intermitente", de: "Keine Intervallfasten-Unterstützung", tr: "Aralıklı oruç desteği yok" },
    fgWins: true,
  },
  {
    category: { ar: "السعر الشهري", en: "Monthly Cost", fr: "Coût mensuel", es: "Costo mensual", de: "Monatliche Kosten", tr: "Aylık maliyet" },
    feelGreat: { ar: "~$130-150 (أقل من قهوة يومية)", en: "~$130-150 (less than daily coffee)", fr: "~130-150$ (moins qu'un café quotidien)", es: "~$130-150 (menos que un café diario)", de: "~130-150$ (weniger als täglicher Kaffee)", tr: "~$130-150 (günlük kahveden az)" },
    competitors: { ar: "$80-200+ مع نتائج غير مضمونة", en: "$80-200+ with uncertain results", fr: "80-200$+ avec résultats incertains", es: "$80-200+ con resultados inciertos", de: "80-200$+ mit unsicheren Ergebnissen", tr: "$80-200+ belirsiz sonuçlarla" },
    fgWins: true,
  },
];

const differentiators: Record<string, { icon: typeof Shield; title: string; desc: string }[]> = {
  ar: [
    { icon: FlaskConical, title: "50+ دراسة علمية", desc: "مدعوم بأبحاث سريرية منشورة في مجلات علمية محكّمة" },
    { icon: Shield, title: "Informed-Sport", desc: "شهادة خلو من المواد المحظورة - معتمد للرياضيين المحترفين" },
    { icon: Award, title: "براءات اختراع", desc: "تقنية Biosphere Fiber وعملية تنقية Unimate الخماسية حصرية" },
    { icon: Globe, title: "50+ دولة", desc: "شركة عالمية بخبرة 30+ سنة وأكثر من 800 موظف" },
    { icon: Star, title: "ضمان 60 يوم", desc: "جرّب بدون مخاطرة - استرداد كامل إذا لم تكن راضياً" },
  ],
  en: [
    { icon: FlaskConical, title: "50+ Scientific Studies", desc: "Backed by peer-reviewed clinical research published in scientific journals" },
    { icon: Shield, title: "Informed-Sport Certified", desc: "Tested for banned substances - approved for professional athletes" },
    { icon: Award, title: "Patented Technology", desc: "Exclusive Biosphere Fiber technology and 5-step Unimate purification" },
    { icon: Globe, title: "50+ Countries", desc: "Global company with 30+ years experience and 800+ employees" },
    { icon: Star, title: "60-Day Guarantee", desc: "Try risk-free - full refund if you're not satisfied" },
  ],
  fr: [
    { icon: FlaskConical, title: "50+ études scientifiques", desc: "Soutenu par des recherches cliniques publiées" },
    { icon: Shield, title: "Certifié Informed-Sport", desc: "Testé pour les substances interdites" },
    { icon: Award, title: "Technologie brevetée", desc: "Biosphere Fiber et purification Unimate exclusives" },
    { icon: Globe, title: "50+ pays", desc: "Entreprise mondiale avec 30+ ans d'expérience" },
    { icon: Star, title: "Garantie 60 jours", desc: "Essayez sans risque - remboursement complet" },
  ],
  es: [
    { icon: FlaskConical, title: "50+ estudios científicos", desc: "Respaldado por investigación clínica publicada" },
    { icon: Shield, title: "Certificado Informed-Sport", desc: "Probado para sustancias prohibidas" },
    { icon: Award, title: "Tecnología patentada", desc: "Biosphere Fiber y purificación Unimate exclusivas" },
    { icon: Globe, title: "50+ países", desc: "Empresa global con 30+ años de experiencia" },
    { icon: Star, title: "Garantía 60 días", desc: "Prueba sin riesgo - reembolso completo" },
  ],
  de: [
    { icon: FlaskConical, title: "50+ wissenschaftliche Studien", desc: "Unterstützt durch veröffentlichte klinische Forschung" },
    { icon: Shield, title: "Informed-Sport zertifiziert", desc: "Getestet auf verbotene Substanzen" },
    { icon: Award, title: "Patentierte Technologie", desc: "Exklusive Biosphere Fiber und Unimate-Reinigung" },
    { icon: Globe, title: "50+ Länder", desc: "Globales Unternehmen mit 30+ Jahren Erfahrung" },
    { icon: Star, title: "60-Tage-Garantie", desc: "Risikofrei testen - volle Rückerstattung" },
  ],
  tr: [
    { icon: FlaskConical, title: "50+ bilimsel çalışma", desc: "Yayınlanmış klinik araştırmalarla desteklenen" },
    { icon: Shield, title: "Informed-Sport sertifikalı", desc: "Yasaklı maddeler için test edilmiş" },
    { icon: Award, title: "Patentli teknoloji", desc: "Özel Biosphere Fiber ve Unimate arıtma" },
    { icon: Globe, title: "50+ ülke", desc: "30+ yıl deneyime sahip küresel şirket" },
    { icon: Star, title: "60 gün garanti", desc: "Risksiz deneyin - tam geri ödeme" },
  ],
};

export default function Comparison() {
  const { lang } = useLanguage();
  const l = labels[lang] || labels.en;
  const diffs = differentiators[lang] || differentiators.en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-20 pt-24">
        <div className="container text-center">
          <a href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> {l.back}
          </a>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{l.title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{l.subtitle}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-start font-bold text-sm uppercase tracking-wide text-muted-foreground border-b-2 border-border">{l.category}</th>
                  <th className="p-4 text-start font-bold text-sm uppercase tracking-wide text-primary border-b-2 border-primary">{l.feelGreat}</th>
                  <th className="p-4 text-start font-bold text-sm uppercase tracking-wide text-muted-foreground border-b-2 border-border">{l.competitors}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="p-4 font-medium text-sm border-b border-border">{row.category[lang] || row.category.en}</td>
                    <td className="p-4 text-sm border-b border-border">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-foreground font-medium">{row.feelGreat[lang] || row.feelGreat.en}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm border-b border-border">
                      <div className="flex items-start gap-2">
                        <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{row.competitors[lang] || row.competitors.en}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-16 gradient-section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{l.whyTitle}</h2>
            <p className="text-muted-foreground text-lg">{l.whySubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {diffs.map((d, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <d.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{d.title}</h3>
                  <p className="text-sm text-muted-foreground">{d.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee + CTA */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{l.guaranteeTitle}</h2>
            <p className="text-muted-foreground text-lg mb-8">{l.guaranteeText}</p>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-10 py-6 gradient-blue text-white border-0 hover:opacity-90">
                {l.cta} <ArrowRight className="w-5 h-5 ms-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
