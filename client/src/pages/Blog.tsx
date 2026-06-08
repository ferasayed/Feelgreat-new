import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES: { id: string; labels: Record<string, string> }[] = [
  { id: "all", labels: { ar: "الكل", en: "All", fr: "Tous", es: "Todos", de: "Alle", tr: "Tümü" } },
  { id: "insulin-resistance", labels: { ar: "مقاومة الإنسولين", en: "Insulin Resistance", fr: "Résistance à l'insuline", es: "Resistencia a la insulina", de: "Insulinresistenz", tr: "İnsülin Direnci" } },
  { id: "sustainable-health", labels: { ar: "الصحة المستدامة", en: "Sustainable Health", fr: "Santé durable", es: "Salud sostenible", de: "Nachhaltige Gesundheit", tr: "Sürdürülebilir Sağlık" } },
  { id: "weight-management", labels: { ar: "إدارة الوزن", en: "Weight Loss", fr: "Perte de poids", es: "Pérdida de peso", de: "Gewichtsverlust", tr: "Kilo Verme" } },
  { id: "gut-health", labels: { ar: "صحة الأمعاء", en: "Gut Health", fr: "Santé intestinale", es: "Salud intestinal", de: "Darmgesundheit", tr: "Bağırsak Sağlığı" } },
  { id: "healthy-habits", labels: { ar: "عادات صحية", en: "Healthy Habits", fr: "Habitudes saines", es: "Hábitos saludables", de: "Gesunde Gewohnheiten", tr: "Sağlıklı Alışkanlıklar" } },
  { id: "behavioral-nutrition", labels: { ar: "التغذية السلوكية", en: "Behavioral Nutrition", fr: "Nutrition comportementale", es: "Nutrición conductual", de: "Verhaltensernährung", tr: "Davranışsal Beslenme" } },
  { id: "hormonal-balance", labels: { ar: "التوازن الهرموني", en: "Hormonal Balance", fr: "Équilibre hormonal", es: "Equilibrio hormonal", de: "Hormonelles Gleichgewicht", tr: "Hormonal Denge" } },
  { id: "nutrition", labels: { ar: "التغذية", en: "Nutrition", fr: "Nutrition", es: "Nutrición", de: "Ernährung", tr: "Beslenme" } },
  { id: "mental-wellness", labels: { ar: "الصحة النفسية", en: "Mental Wellness", fr: "Bien-être mental", es: "Bienestar mental", de: "Mentale Gesundheit", tr: "Zihinsel Sağlık" } },
  { id: "lifestyle-medicine", labels: { ar: "طب نمط الحياة", en: "Lifestyle Medicine", fr: "Médecine du mode de vie", es: "Medicina del estilo de vida", de: "Lifestyle-Medizin", tr: "Yaşam Tarzı Tıbbı" } },
  { id: "intermittent-fasting", labels: { ar: "الصيام المتقطع", en: "Intermittent Fasting", fr: "Jeûne intermittent", es: "Ayuno intermitente", de: "Intervallfasten", tr: "Aralıklı Oruç" } },
];

// Helper to get multilingual article field
function getArticleField(article: any, field: string, lang: string): string {
  const langMap: Record<string, string> = { ar: 'Ar', en: 'En', fr: 'Fr', es: 'Es', de: 'De', tr: 'Tr' };
  const suffix = langMap[lang] || 'En';
  return article[`${field}${suffix}`] || article[`${field}En`] || article[`${field}Ar`] || '';
}

const UI_TEXT: Record<string, { blogTitle: string; blogSubtitle: string; byAuthor: string; authorTitle: string; minRead: string; readMore: string; noArticles: string; checkBack: string }> = {
  ar: { blogTitle: '\u0645\u062f\u0648\u0646\u0629 \u0627\u0644\u0635\u062d\u0629 \u0627\u0644\u0645\u0633\u062a\u062f\u0627\u0645\u0629', blogSubtitle: '\u0645\u0642\u0627\u0644\u0627\u062a \u0639\u0644\u0645\u064a\u0629 \u0639\u0646 \u0627\u0644\u0635\u062d\u0629 \u0627\u0644\u0645\u0633\u062a\u062f\u0627\u0645\u0629 \u0648\u0627\u0644\u062a\u063a\u0630\u064a\u0629 \u0627\u0644\u0633\u0644\u0648\u0643\u064a\u0629', byAuthor: '\u0628\u0642\u0644\u0645 \u0641\u0631\u0627\u0633 \u0627\u0644\u0639\u0627\u064a\u062f', authorTitle: '\u0623\u062e\u0635\u0627\u0626\u064a \u0627\u0644\u062a\u063a\u0630\u064a\u0629 \u0627\u0644\u0639\u0644\u0627\u062c\u064a\u0629 \u0648\u0627\u0644\u0633\u0644\u0648\u0643\u064a\u0629', minRead: '\u062f\u0642\u0627\u0626\u0642 \u0642\u0631\u0627\u0621\u0629', readMore: '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064a\u062f', noArticles: '\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0642\u0627\u0644\u0627\u062a \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u062a\u0635\u0646\u064a\u0641 \u0628\u0639\u062f', checkBack: '\u064a\u062a\u0645 \u0646\u0634\u0631 \u0645\u0642\u0627\u0644\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u064a\u0648\u0645\u064a\u0627\u064b - \u0639\u062f \u0642\u0631\u064a\u0628\u0627\u064b!' },
  en: { blogTitle: 'Sustainable Health Blog', blogSubtitle: 'Science-backed articles on sustainable health and behavioral nutrition', byAuthor: 'By Feras Alayed', authorTitle: 'Therapeutic & Behavioral Nutrition Specialist', minRead: 'min read', readMore: 'Read more', noArticles: 'No articles in this category yet', checkBack: 'New articles are published daily - check back soon!' },
  fr: { blogTitle: 'Blog Sant\u00e9 Durable', blogSubtitle: 'Articles scientifiques sur la sant\u00e9 durable et la nutrition comportementale', byAuthor: 'Par Feras Alayed', authorTitle: 'Sp\u00e9cialiste en Nutrition Th\u00e9rapeutique', minRead: 'min de lecture', readMore: 'Lire la suite', noArticles: 'Aucun article dans cette cat\u00e9gorie', checkBack: 'De nouveaux articles sont publi\u00e9s quotidiennement !' },
  es: { blogTitle: 'Blog de Salud Sostenible', blogSubtitle: 'Art\u00edculos cient\u00edficos sobre salud sostenible y nutrici\u00f3n conductual', byAuthor: 'Por Feras Alayed', authorTitle: 'Especialista en Nutrici\u00f3n Terap\u00e9utica', minRead: 'min de lectura', readMore: 'Leer m\u00e1s', noArticles: 'No hay art\u00edculos en esta categor\u00eda', checkBack: '\u00a1Se publican nuevos art\u00edculos diariamente!' },
  de: { blogTitle: 'Blog f\u00fcr Nachhaltige Gesundheit', blogSubtitle: 'Wissenschaftliche Artikel \u00fcber nachhaltige Gesundheit', byAuthor: 'Von Feras Alayed', authorTitle: 'Spezialist f\u00fcr Ern\u00e4hrung', minRead: 'Min. Lesezeit', readMore: 'Weiterlesen', noArticles: 'Noch keine Artikel in dieser Kategorie', checkBack: 'T\u00e4glich werden neue Artikel ver\u00f6ffentlicht!' },
  tr: { blogTitle: 'S\u00fcrd\u00fcr\u00fclebilir Sa\u011fl\u0131k Blogu', blogSubtitle: 'S\u00fcrd\u00fcr\u00fclebilir sa\u011fl\u0131k hakk\u0131nda bilimsel makaleler', byAuthor: 'Feras Alayed taraf\u0131ndan', authorTitle: 'Beslenme Uzman\u0131', minRead: 'dk okuma', readMore: 'Devam\u0131n\u0131 oku', noArticles: 'Bu kategoride hen\u00fcz makale yok', checkBack: 'Her g\u00fcn yeni makaleler yay\u0131nlan\u0131yor!' },
};

export default function Blog() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const t = UI_TEXT[lang] || UI_TEXT.en;
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    document.title = isAr ? 'المدونة | Feel Great - مقالات الصحة المستدامة' : 'Blog | Feel Great - Sustainable Health Articles';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', isAr ? 'مقالات علمية عن الصحة المستدامة، مقاومة الإنسولين، صحة الأمعاء، إنقاص الوزن، والتغذية السلوكية. بقلم فراس العايد.' : 'Science-backed articles on sustainable health, insulin resistance, gut health, weight loss, and behavioral nutrition. By Feras Alayed.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://feelgreat.us.com/blog');
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);
    return () => { document.querySelector('link[rel="canonical"]')?.remove(); };
  }, [isAr]);

  const { data, isLoading } = trpc.blog.list.useQuery({ limit: 50 });

  const articles = data?.articles ?? [];
  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-gradient-to-b from-[#0a1628] to-[#132240] py-16 text-center">
        <div className="container">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm mb-6">
            <span>{t.byAuthor}</span>
            <span className="text-[#c8a951]">•</span>
            <span>{t.authorTitle}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.blogTitle}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t.blogSubtitle}
          </p>
          <p className="text-sm text-gray-400 mt-3">
            {lang === 'ar' ? `${data?.total ?? 0} مقال منشور • محتوى جديد كل يوم`
              : lang === 'fr' ? `${data?.total ?? 0} articles publiés • Nouveau contenu chaque jour`
              : lang === 'es' ? `${data?.total ?? 0} artículos publicados • Contenido nuevo cada día`
              : lang === 'de' ? `${data?.total ?? 0} Artikel veröffentlicht • Täglich neue Inhalte`
              : lang === 'tr' ? `${data?.total ?? 0} makale yayınlandı • Her gün yeni içerik`
              : `${data?.total ?? 0} articles published • New content daily`}
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b py-3">
        <div className="container overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#1a5276] text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.labels[lang] || cat.labels.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="container py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-muted-foreground">
              {t.noArticles}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t.checkBack}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {(article as any).heroImageUrl && (
                  <div className="w-full h-40 overflow-hidden">
                    <img loading="lazy"
                      src={(article as any).heroImageUrl}
                      alt={getArticleField(article, 'title', lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1a5276]/10 text-[#1a5276]">
                    {CATEGORIES.find((c) => c.id === article.category)?.labels[lang] || CATEGORIES.find((c) => c.id === article.category)?.labels.en || article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.readTimeMinutes} {t.minRead}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-[#1a5276] transition-colors mb-2 line-clamp-2">
                  {getArticleField(article, 'title', lang)}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {getArticleField(article, 'excerpt', lang)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString(
                      { ar: 'ar-SA', en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' }[lang] || 'en-US', {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-[#c8a951] group-hover:underline">
                    {t.readMore} →
                  </span>
                </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Cross-links */}
      <section className="py-10 bg-muted/30">
        <div className="container text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === 'ar' ? "كن شريكاً" : lang === 'fr' ? "Devenir partenaire" : lang === 'es' ? "Ser socio" : lang === 'de' ? "Partner werden" : lang === 'tr' ? "Ortak olun" : "Become a Partner"}</a>
            <a href="/founder" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === 'ar' ? "عن المؤسس" : lang === 'fr' ? "Le fondateur" : lang === 'es' ? "El fundador" : lang === 'de' ? "Über den Gründer" : lang === 'tr' ? "Kurucu hakkında" : "About the Founder"}</a>
            <a href="/faq" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === 'ar' ? "الأسئلة الشائعة" : lang === 'fr' ? "FAQ" : lang === 'es' ? "Preguntas frecuentes" : lang === 'de' ? "FAQ" : lang === 'tr' ? "SSS" : "FAQ"}</a>
            <a href="/" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === 'ar' ? "الرئيسية" : lang === 'fr' ? "Accueil" : lang === 'es' ? "Inicio" : lang === 'de' ? "Startseite" : lang === 'tr' ? "Ana Sayfa" : "Home"}</a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0a1628] to-[#1a5276] py-16 text-center">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {lang === 'ar' ? "هل تريد استشارة صحية مجانية؟" : lang === 'fr' ? "Consultation santé gratuite ?" : lang === 'es' ? "¿Consulta de salud gratuita?" : lang === 'de' ? "Kostenlose Gesundheitsberatung?" : lang === 'tr' ? "Ücretsiz sağlık danışmanlığı?" : "Want a Free Health Consultation?"}
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {lang === 'ar' ? "تواصل مع فراس العايد للحصول على خطة صحية مخصصة تناسب أهدافك"
              : lang === 'fr' ? "Contactez Feras Alayed pour un plan de santé personnalisé"
              : lang === 'es' ? "Contacte a Feras Alayed para un plan de salud personalizado"
              : lang === 'de' ? "Kontaktieren Sie Feras Alayed für einen personalisierten Gesundheitsplan"
              : lang === 'tr' ? "Kişisel sağlık planı için Feras Alayed ile iletişime geçin"
              : "Connect with Feras Alayed for a personalized health plan tailored to your goals"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/96877020770?text=أريد استشارة صحية مجانية"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {lang === 'ar' ? "تواصل عبر واتساب" : lang === 'fr' ? "Discuter sur WhatsApp" : lang === 'es' ? "Chatear en WhatsApp" : lang === 'de' ? "Chat auf WhatsApp" : lang === 'tr' ? "WhatsApp'ta sohbet" : "Chat on WhatsApp"}
            </a>
            <a
              href="https://ufeelgreat.com/c/GBP556"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#c8a951] text-[#0a1628] font-bold rounded-lg hover:bg-[#d4b85c] transition-colors"
            >
              {lang === 'ar' ? "ابدأ رحلتك الصحية" : lang === 'fr' ? "Commencez votre parcours santé" : lang === 'es' ? "Comience su viaje de salud" : lang === 'de' ? "Starten Sie Ihre Gesundheitsreise" : lang === 'tr' ? "Sağlık yolculuğunuza başlayın" : "Start Your Health Journey"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
