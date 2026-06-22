import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Related Articles Component
 * Displays related articles based on current article category/tags
 * Improves internal linking and SEO
 */
export default function RelatedArticles({ currentArticleId, category, limit = 4 }: {
  currentArticleId?: string;
  category?: string;
  limit?: number;
}) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const { data: articles, isLoading } = trpc.blog.list.useQuery(
    { limit: limit + 1, offset: 0 },
    { enabled: true }
  );

  // Filter out current article and limit results
  const relatedArticles = articles?.items
    ?.filter((a) => a.id !== currentArticleId)
    ?.slice(0, limit);

  if (isLoading || !relatedArticles?.length) {
    return null;
  }

  const labels = {
    ar: {
      title: "مقالات ذات صلة",
      readMore: "اقرأ المزيد",
      allArticles: "جميع المقالات",
    },
    en: {
      title: "Related Articles",
      readMore: "Read More",
      allArticles: "All Articles",
    },
    fr: {
      title: "Articles Connexes",
      readMore: "Lire la suite",
      allArticles: "Tous les articles",
    },
    es: {
      title: "Artículos Relacionados",
      readMore: "Leer más",
      allArticles: "Todos los artículos",
    },
    de: {
      title: "Verwandte Artikel",
      readMore: "Mehr lesen",
      allArticles: "Alle Artikel",
    },
    tr: {
      title: "İlgili Makaleler",
      readMore: "Devamını oku",
      allArticles: "Tüm makaleler",
    },
  };

  const l = labels[lang] || labels.en;

  return (
    <section className="mt-16 py-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          {l.title}
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {l.allArticles}
          <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedArticles.map((article) => {
          const title = (article as any)[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || article.titleEn;
          const excerpt = (article as any)[`excerpt${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || article.excerptEn;

          return (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group block bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              {article.heroImageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.heroImageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  {l.readMore}
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Internal Links to Key Pages */}
      <div className="mt-10 p-6 bg-primary/5 rounded-xl border border-primary/10">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {isAr ? "استكشف المزيد من المحتوى" : "Explore More Content"}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/research"
            className="px-4 py-2 rounded-full bg-white border border-border hover:border-primary hover:text-primary transition-colors text-sm"
          >
            {isAr ? "الأبحاث العلمية" : "Scientific Research"}
          </Link>
          <Link
            href="/health-library"
            className="px-4 py-2 rounded-full bg-white border border-border hover:border-primary hover:text-primary transition-colors text-sm"
          >
            {isAr ? "المكتبة الصحية" : "Health Library"}
          </Link>
          <Link
            href="/success-stories"
            className="px-4 py-2 rounded-full bg-white border border-border hover:border-primary hover:text-primary transition-colors text-sm"
          >
            {isAr ? "قصص النجاح" : "Success Stories"}
          </Link>
          <Link
            href="/health-assessment"
            className="px-4 py-2 rounded-full bg-white border border-border hover:border-primary hover:text-primary transition-colors text-sm"
          >
            {isAr ? "اختبار الصحة" : "Health Assessment"}
          </Link>
        </div>
      </div>
    </section>
  );
}
