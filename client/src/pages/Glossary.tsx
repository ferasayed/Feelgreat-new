import { useState, useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowLeft, ExternalLink } from "lucide-react";

const translations = {
  ar: {
    title: "معجم المصطلحات الصحية",
    subtitle: "دليلك الشامل لفهم المصطلحات الطبية والصحية المستخدمة في مقالاتنا",
    searchPlaceholder: "ابحث عن مصطلح...",
    allCategories: "الكل",
    noResults: "لم يتم العثور على نتائج",
    relatedTerms: "مصطلحات ذات صلة",
    relatedArticles: "مقالات ذات صلة",
    sources: "المصادر العلمية",
    back: "العودة للمعجم",
    definition: "التعريف",
    categories: {
      nutrition: "التغذية",
      metabolism: "الأيض",
      "gut-health": "صحة الأمعاء",
      "weight-management": "إدارة الوزن",
      "mental-health": "الصحة النفسية",
      hormones: "الهرمونات",
      supplements: "المكملات",
      "intermittent-fasting": "الصيام المتقطع",
    } as Record<string, string>,
  },
  en: {
    title: "Health Glossary",
    subtitle: "Your comprehensive guide to understanding medical and health terms used in our articles",
    searchPlaceholder: "Search for a term...",
    allCategories: "All",
    noResults: "No results found",
    relatedTerms: "Related Terms",
    relatedArticles: "Related Articles",
    sources: "Scientific Sources",
    back: "Back to Glossary",
    definition: "Definition",
    categories: {
      nutrition: "Nutrition",
      metabolism: "Metabolism",
      "gut-health": "Gut Health",
      "weight-management": "Weight Management",
      "mental-health": "Mental Health",
      hormones: "Hormones",
      supplements: "Supplements",
      "intermittent-fasting": "Intermittent Fasting",
    } as Record<string, string>,
  },
};

function GlossaryList() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;
  const isRtl = lang === "ar";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: terms, isLoading } = trpc.glossary.list.useQuery(
    selectedCategory ? { category: selectedCategory } : undefined
  );

  // Inject DefinedTerm Schema
  useEffect(() => {
    if (!terms || terms.length === 0) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: lang === "ar" ? "معجم المصطلحات الصحية - Feel Great" : "Health Glossary - Feel Great",
      description: t.subtitle,
      url: "https://feelgreat.us.com/glossary",
      hasDefinedTerm: terms.map((term: any) => ({
        "@type": "DefinedTerm",
        name: lang === "ar" ? term.termAr : term.termEn,
        description: lang === "ar" ? term.definitionAr : term.definitionEn,
        url: `https://feelgreat.us.com/glossary/${term.slug}`,
        inDefinedTermSet: "https://feelgreat.us.com/glossary",
      })),
    };

    const scriptEl = document.createElement("script");
    scriptEl.id = "glossary-schema";
    scriptEl.type = "application/ld+json";
    scriptEl.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    // Set meta
    document.title = `${t.title} | Feel Great`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t.subtitle);

    return () => {
      document.getElementById("glossary-schema")?.remove();
    };
  }, [terms, lang]);

  const filteredTerms = useMemo(() => {
    if (!terms) return [];
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter((term: any) =>
      term.termAr.toLowerCase().includes(q) ||
      term.termEn.toLowerCase().includes(q) ||
      term.definitionAr.toLowerCase().includes(q) ||
      term.definitionEn.toLowerCase().includes(q)
    );
  }, [terms, search]);

  const categories = useMemo(() => {
    if (!terms) return [];
    const cats = Array.from(new Set(terms.map((t: any) => t.category)));
    return cats.sort();
  }, [terms]);

  // Group terms alphabetically
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach((term: any) => {
      const letter = (lang === "ar" ? term.termAr : term.termEn).charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredTerms, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container max-w-5xl space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0a1628] via-[#1a3a5c] to-[#0a1628] py-16">
        <div className="container max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-[#c8a951]" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">{t.title}</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t.subtitle}</p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="container max-w-5xl py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t.allCategories}
          </Badge>
          {categories.map((cat: string) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            >
              {t.categories[cat] || cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="container max-w-5xl pb-16">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t.noResults}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedTerms.map(([letter, terms]) => (
              <div key={letter}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-[#c8a951]">{letter}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {(terms as any[]).map((term: any) => (
                    <Link key={term.slug} href={`/glossary/${term.slug}`}>
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border/50 hover:border-[#c8a951]/30">
                        <h3 className="font-semibold text-foreground mb-1">
                          {lang === "ar" ? term.termAr : term.termEn}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lang === "ar" ? term.definitionAr : term.definitionEn}
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {t.categories[term.category] || term.category}
                        </Badge>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GlossaryDetail() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;
  const isRtl = lang === "ar";
  const [, params] = useRoute("/glossary/:slug");
  const slug = params?.slug || "";

  const { data: term, isLoading } = trpc.glossary.getBySlug.useQuery({ slug }, { enabled: !!slug });

  useEffect(() => {
    if (!term) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: lang === "ar" ? term.termAr : term.termEn,
      description: lang === "ar" ? term.definitionAr : term.definitionEn,
      url: `https://feelgreat.us.com/glossary/${term.slug}`,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Feel Great Health Glossary",
        url: "https://feelgreat.us.com/glossary",
      },
    };

    document.title = `${lang === "ar" ? term.termAr : term.termEn} - ${t.title} | Feel Great`;

    const scriptEl = document.createElement("script");
    scriptEl.id = "glossary-term-schema";
    scriptEl.type = "application/ld+json";
    scriptEl.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    return () => {
      document.getElementById("glossary-term-schema")?.remove();
    };
  }, [term, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container max-w-3xl space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!term) return null;

  const relatedTerms = (term.relatedTerms as string[] | null) || [];
  const relatedArticles = (term.relatedArticles as string[] | null) || [];
  const sources = (term.sources as Array<{ title: string; url: string }> | null) || [];

  return (
    <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`}>
      <div className="container max-w-3xl py-12">
        {/* Back button */}
        <Link href="/glossary">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Button>
        </Link>

        {/* Term Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">
            {t.categories[term.category] || term.category}
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {lang === "ar" ? term.termAr : term.termEn}
          </h1>
          {lang === "ar" && (
            <p className="text-muted-foreground text-sm italic">{term.termEn}</p>
          )}
          {lang !== "ar" && (
            <p className="text-muted-foreground text-sm italic">{term.termAr}</p>
          )}
        </div>

        {/* Definition */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800/40">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">{t.definition}</h2>
          <p className="text-foreground leading-relaxed">
            {lang === "ar" ? term.definitionAr : term.definitionEn}
          </p>
        </Card>

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{t.relatedTerms}</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((slug: string) => (
                <Link key={slug} href={`/glossary/${slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    {slug.replace(/-/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{t.relatedArticles}</h2>
            <div className="space-y-2">
              {relatedArticles.map((slug: string) => (
                <Link key={slug} href={`/blog/${slug}`}>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{slug.replace(/-/g, " ")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">{t.sources}</h2>
            <div className="space-y-2">
              {sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlossaryList;
export { GlossaryDetail };
