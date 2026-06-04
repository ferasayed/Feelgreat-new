import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Globe, Users, TrendingUp, Phone, MapPin, Heart, Star } from "lucide-react";

export default function Founder() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = lang === 'ar' ? 'فراس العايد | أخصائي تغذية علاجية وسلوكية | Presidential Sapphire' : 'Feras Alayed | Therapeutic & Behavioral Nutrition Specialist | Presidential Sapphire';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', lang === 'ar' ? 'تعرف على فراس العايد - أخصائي تغذية علاجية وسلوكية، Presidential Sapphire في يونيسيتي. خبرة دولية في الصحة المستدامة.' : 'Meet Feras Alayed - Therapeutic & Behavioral Nutrition Specialist, Presidential Sapphire at Unicity International. International expertise in sustainable health.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://feelgreat.us.com/founder');
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);
    return () => { document.querySelector('link[rel="canonical"]')?.remove(); };
  }, [lang]);

  const content: Record<string, { title: string; subtitle: string; bio: string[]; achievements: Array<{ label: string; value: string }>; philosophy: string; philosophyTitle: string; cta: string }> = {
    ar: {
      title: "فراس العايد",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "قائد في مجال الصحة المستدامة وبناء الشراكات الدولية مع يونيسيتي.",
        "ساعد مئات الأشخاص على تحسين صحتهم وبناء مصادر دخل إضافية من خلال برنامج Feel Great.",
        "يؤمن بأن الصحة هي أفضل استثمار، وأن كل شخص يستحق حياة أفضل.",
      ],
      achievements: [
        { label: "المرتبة", value: "Presidential Sapphire" },
        { label: "الفريق", value: "500+ شريك" },
        { label: "الدول", value: "15+ دولة" },
        { label: "الخبرة", value: "5+ سنوات" },
      ],
      philosophy: "أؤمن بأن الصحة ليست رفاهية بل حق أساسي. مهمتي هي مساعدة أكبر عدد ممكن من الناس على تحسين صحتهم وبناء حرية مالية حقيقية من خلال نظام مثبت علمياً وفريق داعم.",
      philosophyTitle: "فلسفتي",
      cta: "تواصل مع فراس",
    },
    en: {
      title: "Feras Al-Ayed",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "A leader in sustainable health and international partnership building with Unicity.",
        "Has helped hundreds of people improve their health and build additional income through the Feel Great program.",
        "Believes that health is the best investment, and everyone deserves a better life.",
      ],
      achievements: [
        { label: "Rank", value: "Presidential Sapphire" },
        { label: "Team", value: "500+ Partners" },
        { label: "Countries", value: "15+ Countries" },
        { label: "Experience", value: "5+ Years" },
      ],
      philosophy: "I believe health is not a luxury but a fundamental right. My mission is to help as many people as possible improve their health and build real financial freedom through a scientifically proven system and a supportive team.",
      philosophyTitle: "My Philosophy",
      cta: "Contact Feras",
    },
    fr: {
      title: "Feras Al-Ayed",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "Un leader en santé durable et en construction de partenariats internationaux avec Unicity.",
        "A aidé des centaines de personnes à améliorer leur santé et à construire des revenus supplémentaires.",
        "Croit que la santé est le meilleur investissement.",
      ],
      achievements: [
        { label: "Rang", value: "Presidential Sapphire" },
        { label: "Équipe", value: "500+ Partenaires" },
        { label: "Pays", value: "15+ Pays" },
        { label: "Expérience", value: "5+ Ans" },
      ],
      philosophy: "Je crois que la santé n'est pas un luxe mais un droit fondamental. Ma mission est d'aider le plus de personnes possible.",
      philosophyTitle: "Ma Philosophie",
      cta: "Contacter Feras",
    },
    es: {
      title: "Feras Al-Ayed",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "Un líder en salud sostenible y construcción de asociaciones internacionales con Unicity.",
        "Ha ayudado a cientos de personas a mejorar su salud y construir ingresos adicionales.",
        "Cree que la salud es la mejor inversión.",
      ],
      achievements: [
        { label: "Rango", value: "Presidential Sapphire" },
        { label: "Equipo", value: "500+ Socios" },
        { label: "Países", value: "15+ Países" },
        { label: "Experiencia", value: "5+ Años" },
      ],
      philosophy: "Creo que la salud no es un lujo sino un derecho fundamental. Mi misión es ayudar a la mayor cantidad de personas posible.",
      philosophyTitle: "Mi Filosofía",
      cta: "Contactar a Feras",
    },
    de: {
      title: "Feras Al-Ayed",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "Ein Führungskraft in nachhaltiger Gesundheit und internationalem Partnerschaftsaufbau mit Unicity.",
        "Hat Hunderten von Menschen geholfen, ihre Gesundheit zu verbessern und zusätzliches Einkommen aufzubauen.",
        "Glaubt, dass Gesundheit die beste Investition ist.",
      ],
      achievements: [
        { label: "Rang", value: "Presidential Sapphire" },
        { label: "Team", value: "500+ Partner" },
        { label: "Länder", value: "15+ Länder" },
        { label: "Erfahrung", value: "5+ Jahre" },
      ],
      philosophy: "Ich glaube, dass Gesundheit kein Luxus, sondern ein Grundrecht ist. Meine Mission ist es, so vielen Menschen wie möglich zu helfen.",
      philosophyTitle: "Meine Philosophie",
      cta: "Feras kontaktieren",
    },
    tr: {
      title: "Feras Al-Ayed",
      subtitle: "Presidential Sapphire | Unicity International",
      bio: [
        "Unicity ile sürdürülebilir sağlık ve uluslararası ortaklık oluşturma alanında bir lider.",
        "Yüzlerce kişinin sağlığını iyileştirmesine ve ek gelir oluşturmasına yardımcı oldu.",
        "Sağlığın en iyi yatırım olduğuna inanıyor.",
      ],
      achievements: [
        { label: "Rütbe", value: "Presidential Sapphire" },
        { label: "Ekip", value: "500+ Ortak" },
        { label: "Ülkeler", value: "15+ Ülke" },
        { label: "Deneyim", value: "5+ Yıl" },
      ],
      philosophy: "Sağlığın bir lüks değil, temel bir hak olduğuna inanıyorum. Misyonum mümkün olduğunca çok insana yardımcı olmak.",
      philosophyTitle: "Felsefem",
      cta: "Feras ile İletişime Geçin",
    },
  };

  const c = content[lang] || content.en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 start-0 end-0 z-50 glass-effect shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold text-primary">Feel Great</a>
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gradient-blue text-white border-0">
              <Phone className="w-4 h-4 me-2" />
              {c.cta}
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero pt-24 pb-20 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <span className="text-5xl md:text-7xl font-bold text-white/80">F</span>
              </div>
            </div>
            <div className="text-center md:text-start">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{c.title}</h1>
              <p className="text-lg text-amber-300 font-medium mb-4">{c.subtitle}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-pink-500/20 border border-white/20 text-sm transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  @use2lose
                </a>
                <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7 6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34V9.01a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.42z"/></svg>
                  @feras.alayed
                </a>
                <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-green-500/20 border border-white/20 text-sm transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {c.achievements.map((a, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-2xl font-bold text-gradient-blue mb-1">{a.value}</div>
                <div className="text-xs text-muted-foreground">{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-12">
              {c.bio.map((p, i) => (
                <p key={i} className="text-lg text-foreground/80 leading-relaxed">{p}</p>
              ))}
            </div>

            <Card className="border-0 shadow-xl bg-primary/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  {c.philosophyTitle}
                </h3>
                <p className="text-foreground/80 leading-relaxed italic">"{c.philosophy}"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-gold text-center">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {lang === "ar" ? "هل أنت مستعد لبدء رحلتك؟" : "Ready to Start Your Journey?"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/96877020770?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D9%81%D8%B1%D8%A7%D8%B3" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 py-6 gradient-blue text-white border-0">
                <Phone className="w-5 h-5 me-2" />
                {c.cta}
              </Button>
            </a>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-foreground/30 text-foreground hover:bg-foreground/10 bg-transparent">
                {lang === "ar" ? "سجّل الآن" : "Register Now"}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <h3 className="text-lg font-bold text-foreground mb-4">{lang === "ar" ? "استكشف المزيد" : "Explore More"}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "كن شريكاً" : "Become a Partner"}</a>
            <a href="/blog" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "المدونة الصحية" : "Health Blog"}</a>
            <a href="/faq" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a>
            <a href="/blog?category=behavioral-nutrition" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "التغذية السلوكية" : "Behavioral Nutrition"}</a>
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
