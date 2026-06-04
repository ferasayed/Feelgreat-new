import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "insulin-resistance", labelAr: "مقاومة الإنسولين", labelEn: "Insulin Resistance" },
  { id: "sustainable-health", labelAr: "الصحة المستدامة", labelEn: "Sustainable Health" },
  { id: "weight-management", labelAr: "إدارة الوزن", labelEn: "Weight Loss" },
  { id: "gut-health", labelAr: "صحة الأمعاء", labelEn: "Gut Health" },
  { id: "healthy-habits", labelAr: "عادات صحية", labelEn: "Healthy Habits" },
  { id: "behavioral-nutrition", labelAr: "التغذية السلوكية", labelEn: "Behavioral Nutrition" },
  { id: "hormonal-balance", labelAr: "التوازن الهرموني", labelEn: "Hormonal Balance" },
  { id: "nutrition", labelAr: "التغذية", labelEn: "Nutrition" },
  { id: "mental-wellness", labelAr: "الصحة النفسية", labelEn: "Mental Wellness" },
  { id: "lifestyle-medicine", labelAr: "طب نمط الحياة", labelEn: "Lifestyle Medicine" },
  { id: "intermittent-fasting", labelAr: "الصيام المتقطع", labelEn: "Intermittent Fasting" },
];

export default function Blog() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
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
            <span>{isAr ? "بقلم فراس العايد" : "By Feras Alayed"}</span>
            <span className="text-[#c8a951]">•</span>
            <span>{isAr ? "أخصائي التغذية العلاجية والسلوكية" : "Therapeutic & Behavioral Nutrition Specialist"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {isAr ? "مدونة الصحة المستدامة" : "Sustainable Health Blog"}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {isAr
              ? "مقالات علمية يومية عن الصحة، التغذية، والعافية - محتوى متجدد يومياً"
              : "Daily science-backed articles on health, nutrition, and wellness"}
          </p>
          <p className="text-sm text-gray-400 mt-3">
            {isAr
              ? `${data?.total ?? 0} مقال منشور • محتوى جديد كل يوم`
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
                {isAr ? cat.labelAr : cat.labelEn}
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
              {isAr ? "لا توجد مقالات في هذا التصنيف بعد" : "No articles in this category yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isAr ? "يتم نشر مقالات جديدة يومياً - عد قريباً!" : "New articles are published daily - check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1a5276]/10 text-[#1a5276]">
                    {CATEGORIES.find((c) => c.id === article.category)?.[isAr ? "labelAr" : "labelEn"] ?? article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-[#1a5276] transition-colors mb-2 line-clamp-2">
                  {isAr ? article.titleAr : article.titleEn}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {isAr ? article.excerptAr : article.excerptEn}
                </p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-[#c8a951] group-hover:underline">
                    {isAr ? "اقرأ المزيد" : "Read more"} →
                  </span>
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
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "كن شريكاً" : "Become a Partner"}</a>
            <a href="/founder" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "عن المؤسس" : "About the Founder"}</a>
            <a href="/faq" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "الأسئلة الشائعة" : "FAQ"}</a>
            <a href="/" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "الرئيسية" : "Home"}</a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0a1628] to-[#1a5276] py-16 text-center">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {isAr ? "هل تريد استشارة صحية مجانية؟" : "Want a Free Health Consultation?"}
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            {isAr
              ? "تواصل مع فراس العايد للحصول على خطة صحية مخصصة تناسب أهدافك"
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
              {isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
            <a
              href="https://ufeelgreat.com/c/GBP556"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#c8a951] text-[#0a1628] font-bold rounded-lg hover:bg-[#d4b85c] transition-colors"
            >
              {isAr ? "ابدأ رحلتك الصحية" : "Start Your Health Journey"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
