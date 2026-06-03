import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowUp, Phone } from "lucide-react";

export default function Blog() {
  const { lang } = useLanguage();

  const articles: Record<string, Array<{ title: string; excerpt: string; date: string; readTime: string; category: string }>> = {
    ar: [
      { title: "ما هو الصيام المتقطع وكيف يساعدك Feel Great؟", excerpt: "تعرّف على العلاقة بين الصيام المتقطع ونظام Feel Great وكيف يمكنك تحقيق نتائج أفضل بدون جوع أو حرمان.", date: "2024-03-15", readTime: "5 دقائق", category: "الصحة" },
      { title: "كيف تبدأ مشروعك الخاص مع يونيسيتي؟", excerpt: "دليل شامل للمبتدئين حول كيفية بناء مصدر دخل إضافي مع برنامج الشراكة في يونيسيتي.", date: "2024-03-10", readTime: "7 دقائق", category: "الشراكة" },
      { title: "فوائد الألياف الذائبة لصحة الجهاز الهضمي", excerpt: "اكتشف كيف تعمل الألياف الذائبة في Balance على تحسين صحة أمعائك ودعم التمثيل الغذائي.", date: "2024-03-05", readTime: "4 دقائق", category: "التغذية" },
      { title: "قصة نجاح: من 101 كيلو إلى 72 كيلو", excerpt: "قصة حقيقية لعميلة خسرت 29.5 كيلو مع Feel Great بدون حمية قاسية أو تمارين مرهقة.", date: "2024-02-28", readTime: "6 دقائق", category: "قصص نجاح" },
      { title: "Unimate: مشروب الطاقة الذكي", excerpt: "تعرّف على مكونات Unimate وكيف يختلف عن مشروبات الطاقة التقليدية في دعم التركيز والأداء.", date: "2024-02-20", readTime: "5 دقائق", category: "المنتجات" },
      { title: "5 عادات صباحية تغيّر حياتك", excerpt: "اكتشف العادات الصباحية التي يتبعها الشركاء الناجحون في يونيسيتي لبدء يومهم بطاقة عالية.", date: "2024-02-15", readTime: "4 دقائق", category: "نمط الحياة" },
    ],
    en: [
      { title: "What is Intermittent Fasting and How Does Feel Great Help?", excerpt: "Learn about the relationship between intermittent fasting and the Feel Great system for better results without hunger.", date: "2024-03-15", readTime: "5 min", category: "Health" },
      { title: "How to Start Your Own Business with Unicity?", excerpt: "A comprehensive guide for beginners on building additional income with Unicity's partnership program.", date: "2024-03-10", readTime: "7 min", category: "Partnership" },
      { title: "Benefits of Soluble Fiber for Digestive Health", excerpt: "Discover how soluble fiber in Balance improves gut health and supports metabolism.", date: "2024-03-05", readTime: "4 min", category: "Nutrition" },
      { title: "Success Story: From 101kg to 72kg", excerpt: "A real story of a client who lost 29.5kg with Feel Great without strict dieting.", date: "2024-02-28", readTime: "6 min", category: "Success Stories" },
      { title: "Unimate: The Smart Energy Drink", excerpt: "Learn about Unimate's ingredients and how it differs from traditional energy drinks.", date: "2024-02-20", readTime: "5 min", category: "Products" },
      { title: "5 Morning Habits That Change Your Life", excerpt: "Discover the morning habits of successful Unicity partners for high-energy days.", date: "2024-02-15", readTime: "4 min", category: "Lifestyle" },
    ],
    fr: [
      { title: "Qu'est-ce que le jeûne intermittent et comment Feel Great aide ?", excerpt: "Découvrez la relation entre le jeûne intermittent et le système Feel Great.", date: "2024-03-15", readTime: "5 min", category: "Santé" },
      { title: "Comment démarrer votre entreprise avec Unicity ?", excerpt: "Guide complet pour les débutants sur la construction de revenus supplémentaires.", date: "2024-03-10", readTime: "7 min", category: "Partenariat" },
      { title: "Bienfaits des fibres solubles pour la digestion", excerpt: "Comment les fibres solubles dans Balance améliorent votre santé intestinale.", date: "2024-03-05", readTime: "4 min", category: "Nutrition" },
      { title: "Histoire de réussite : De 101kg à 72kg", excerpt: "Une histoire vraie de perte de 29,5kg avec Feel Great.", date: "2024-02-28", readTime: "6 min", category: "Réussites" },
      { title: "Unimate : La boisson énergétique intelligente", excerpt: "Les ingrédients d'Unimate et ses différences avec les boissons énergétiques.", date: "2024-02-20", readTime: "5 min", category: "Produits" },
      { title: "5 habitudes matinales qui changent votre vie", excerpt: "Les habitudes des partenaires Unicity à succès.", date: "2024-02-15", readTime: "4 min", category: "Style de vie" },
    ],
    es: [
      { title: "¿Qué es el ayuno intermitente y cómo ayuda Feel Great?", excerpt: "Aprende sobre la relación entre el ayuno intermitente y el sistema Feel Great.", date: "2024-03-15", readTime: "5 min", category: "Salud" },
      { title: "¿Cómo iniciar tu negocio con Unicity?", excerpt: "Guía completa para principiantes sobre la construcción de ingresos adicionales.", date: "2024-03-10", readTime: "7 min", category: "Asociación" },
      { title: "Beneficios de la fibra soluble para la digestión", excerpt: "Cómo la fibra soluble en Balance mejora tu salud intestinal.", date: "2024-03-05", readTime: "4 min", category: "Nutrición" },
      { title: "Historia de éxito: De 101kg a 72kg", excerpt: "Una historia real de pérdida de 29,5kg con Feel Great.", date: "2024-02-28", readTime: "6 min", category: "Éxitos" },
      { title: "Unimate: La bebida energética inteligente", excerpt: "Los ingredientes de Unimate y sus diferencias.", date: "2024-02-20", readTime: "5 min", category: "Productos" },
      { title: "5 hábitos matutinos que cambian tu vida", excerpt: "Los hábitos de los socios exitosos de Unicity.", date: "2024-02-15", readTime: "4 min", category: "Estilo de vida" },
    ],
    de: [
      { title: "Was ist Intervallfasten und wie hilft Feel Great?", excerpt: "Erfahren Sie mehr über die Beziehung zwischen Intervallfasten und dem Feel Great System.", date: "2024-03-15", readTime: "5 Min", category: "Gesundheit" },
      { title: "Wie starten Sie Ihr Geschäft mit Unicity?", excerpt: "Ein umfassender Leitfaden für Anfänger zum Aufbau zusätzlicher Einnahmen.", date: "2024-03-10", readTime: "7 Min", category: "Partnerschaft" },
      { title: "Vorteile löslicher Ballaststoffe für die Verdauung", excerpt: "Wie lösliche Ballaststoffe in Balance Ihre Darmgesundheit verbessern.", date: "2024-03-05", readTime: "4 Min", category: "Ernährung" },
      { title: "Erfolgsgeschichte: Von 101kg auf 72kg", excerpt: "Eine wahre Geschichte über 29,5kg Gewichtsverlust mit Feel Great.", date: "2024-02-28", readTime: "6 Min", category: "Erfolge" },
      { title: "Unimate: Das intelligente Energiegetränk", excerpt: "Die Inhaltsstoffe von Unimate und seine Unterschiede.", date: "2024-02-20", readTime: "5 Min", category: "Produkte" },
      { title: "5 Morgenroutinen, die Ihr Leben verändern", excerpt: "Die Gewohnheiten erfolgreicher Unicity-Partner.", date: "2024-02-15", readTime: "4 Min", category: "Lebensstil" },
    ],
    tr: [
      { title: "Aralıklı Oruç Nedir ve Feel Great Nasıl Yardımcı Olur?", excerpt: "Aralıklı oruç ve Feel Great sistemi arasındaki ilişkiyi öğrenin.", date: "2024-03-15", readTime: "5 dk", category: "Sağlık" },
      { title: "Unicity ile İşinizi Nasıl Kurarsınız?", excerpt: "Ek gelir oluşturma konusunda yeni başlayanlar için kapsamlı rehber.", date: "2024-03-10", readTime: "7 dk", category: "Ortaklık" },
      { title: "Çözünür Lifin Sindirim Sağlığına Faydaları", excerpt: "Balance'daki çözünür lifin bağırsak sağlığınızı nasıl iyileştirdiğini keşfedin.", date: "2024-03-05", readTime: "4 dk", category: "Beslenme" },
      { title: "Başarı Hikayesi: 101kg'dan 72kg'a", excerpt: "Feel Great ile 29,5kg veren bir müşterinin gerçek hikayesi.", date: "2024-02-28", readTime: "6 dk", category: "Başarılar" },
      { title: "Unimate: Akıllı Enerji İçeceği", excerpt: "Unimate'in içerikleri ve geleneksel enerji içeceklerinden farkları.", date: "2024-02-20", readTime: "5 dk", category: "Ürünler" },
      { title: "Hayatınızı Değiştiren 5 Sabah Alışkanlığı", excerpt: "Başarılı Unicity ortaklarının sabah rutinleri.", date: "2024-02-15", readTime: "4 dk", category: "Yaşam Tarzı" },
    ],
  };

  const arts = articles[lang] || articles.en;
  const categoryColors: Record<string, string> = {
    "الصحة": "bg-green-100 text-green-700", "Health": "bg-green-100 text-green-700", "Santé": "bg-green-100 text-green-700", "Salud": "bg-green-100 text-green-700", "Gesundheit": "bg-green-100 text-green-700", "Sağlık": "bg-green-100 text-green-700",
    "الشراكة": "bg-blue-100 text-blue-700", "Partnership": "bg-blue-100 text-blue-700", "Partenariat": "bg-blue-100 text-blue-700", "Asociación": "bg-blue-100 text-blue-700", "Partnerschaft": "bg-blue-100 text-blue-700", "Ortaklık": "bg-blue-100 text-blue-700",
    "التغذية": "bg-amber-100 text-amber-700", "Nutrition": "bg-amber-100 text-amber-700", "Ernährung": "bg-amber-100 text-amber-700", "Beslenme": "bg-amber-100 text-amber-700",
    "قصص نجاح": "bg-purple-100 text-purple-700", "Success Stories": "bg-purple-100 text-purple-700", "Réussites": "bg-purple-100 text-purple-700", "Éxitos": "bg-purple-100 text-purple-700", "Erfolge": "bg-purple-100 text-purple-700", "Başarılar": "bg-purple-100 text-purple-700",
    "المنتجات": "bg-primary/10 text-primary", "Products": "bg-primary/10 text-primary", "Produits": "bg-primary/10 text-primary", "Productos": "bg-primary/10 text-primary", "Produkte": "bg-primary/10 text-primary", "Ürünler": "bg-primary/10 text-primary",
    "نمط الحياة": "bg-rose-100 text-rose-700", "Lifestyle": "bg-rose-100 text-rose-700", "Style de vie": "bg-rose-100 text-rose-700", "Estilo de vida": "bg-rose-100 text-rose-700", "Lebensstil": "bg-rose-100 text-rose-700", "Yaşam Tarzı": "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
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

      {/* Header */}
      <section className="pt-24 pb-12 bg-white border-b border-border">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {lang === "ar" ? "المدونة" : "Blog"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "ar" ? "مقالات ونصائح حول الصحة المستدامة وبناء الدخل" : "Articles and tips on sustainable health and income building"}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {arts.map((article, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[article.category] || 'bg-muted text-muted-foreground'}`}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-section text-center">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {lang === "ar" ? "هل لديك أسئلة؟ تواصل معنا" : "Have Questions? Contact Us"}
          </h2>
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gradient-blue text-white border-0">
              <Phone className="w-5 h-5 me-2" />
              WhatsApp
            </Button>
          </a>
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
