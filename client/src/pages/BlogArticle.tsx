import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState, useMemo } from "react";
import ArticleComments from "@/components/ArticleComments";
import ShareButtons from "@/components/ShareButtons";
import FloatingShareBar from "@/components/FloatingShareBar";
import UnifiedCTA from "@/components/UnifiedCTA";
import RelatedArticles from "@/components/RelatedArticles";

// Helper to get multilingual article field
function getField(article: any, field: string, lang: string): string {
  const langMap: Record<string, string> = { ar: 'Ar', en: 'En', fr: 'Fr', es: 'Es', de: 'De', tr: 'Tr' };
  const suffix = langMap[lang] || 'En';
  return article[`${field}${suffix}`] || article[`${field}En`] || article[`${field}Ar`] || '';
}

const ARTICLE_UI: Record<string, { home: string; blog: string; minRead: string; words: string; author: string; authorTitle: string; published: string; updated: string; notFound: string; backToBlog: string }> = {
  ar: { home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', blog: '\u0627\u0644\u0645\u062f\u0648\u0646\u0629', minRead: '\u062f\u0642\u0627\u0626\u0642 \u0642\u0631\u0627\u0621\u0629', words: '\u0643\u0644\u0645\u0629', author: '\u0641\u0631\u0627\u0633 \u0627\u0644\u0639\u0627\u064a\u062f', authorTitle: '\u0623\u062e\u0635\u0627\u0626\u064a \u0627\u0644\u062a\u063a\u0630\u064a\u0629 \u0627\u0644\u0639\u0644\u0627\u062c\u064a\u0629 \u0648\u0627\u0644\u0633\u0644\u0648\u0643\u064a\u0629', published: '\u0646\u064f\u0634\u0631: ', updated: '\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b: ', notFound: '\u0627\u0644\u0645\u0642\u0627\u0644 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f', backToBlog: '\u2190 \u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0645\u062f\u0648\u0646\u0629' },
  en: { home: 'Home', blog: 'Blog', minRead: 'min read', words: 'words', author: 'Feras Alayed', authorTitle: 'Therapeutic & Behavioral Nutrition Specialist', published: 'Published: ', updated: 'Updated: ', notFound: 'Article not found', backToBlog: '\u2190 Back to Blog' },
  fr: { home: 'Accueil', blog: 'Blog', minRead: 'min de lecture', words: 'mots', author: 'Feras Alayed', authorTitle: 'Sp\u00e9cialiste en Nutrition Th\u00e9rapeutique', published: 'Publi\u00e9 : ', updated: 'Mis \u00e0 jour : ', notFound: 'Article non trouv\u00e9', backToBlog: '\u2190 Retour au blog' },
  es: { home: 'Inicio', blog: 'Blog', minRead: 'min de lectura', words: 'palabras', author: 'Feras Alayed', authorTitle: 'Especialista en Nutrici\u00f3n Terap\u00e9utica', published: 'Publicado: ', updated: 'Actualizado: ', notFound: 'Art\u00edculo no encontrado', backToBlog: '\u2190 Volver al blog' },
  de: { home: 'Startseite', blog: 'Blog', minRead: 'Min. Lesezeit', words: 'W\u00f6rter', author: 'Feras Alayed', authorTitle: 'Ern\u00e4hrungsspezialist', published: 'Ver\u00f6ffentlicht: ', updated: 'Aktualisiert: ', notFound: 'Artikel nicht gefunden', backToBlog: '\u2190 Zur\u00fcck zum Blog' },
  tr: { home: 'Ana Sayfa', blog: 'Blog', minRead: 'dk okuma', words: 'kelime', author: 'Feras Alayed', authorTitle: 'Beslenme Uzman\u0131', published: 'Yay\u0131nlanma: ', updated: 'G\u00fcncelleme: ', notFound: 'Makale bulunamad\u0131', backToBlog: '\u2190 Bloga d\u00f6n' },
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const t = ARTICLE_UI[lang] || ARTICLE_UI.en;

  const { data: article, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Track article view (once per session per article)
  const viewTracked = useRef<string | null>(null);
  const recordView = trpc.blog.recordView.useMutation();
  useEffect(() => {
    if (article && viewTracked.current !== article.slug) {
      viewTracked.current = article.slug;
      const visitorId = localStorage.getItem("fg-visitor-id") || `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      if (!localStorage.getItem("fg-visitor-id")) localStorage.setItem("fg-visitor-id", visitorId);
      recordView.mutate({
        articleId: article.id,
        visitorId,
        referrer: document.referrer || undefined,
      });
    }
  }, [article]);

  // Inject structured data (Article Schema, FAQ Schema, Breadcrumb Schema, Author Schema)
  useEffect(() => {
    if (article) {
      const title = getField(article, 'title', lang);
      document.title = `${title} | Feel Great`;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      const desc = getField(article, 'excerpt', lang);
      if (metaDesc) metaDesc.setAttribute("content", desc);

      // Remove existing schemas
      document.getElementById("article-schema")?.remove();
      document.getElementById("faq-schema")?.remove();
      document.getElementById("breadcrumb-schema")?.remove();
      document.getElementById("author-schema")?.remove();

      // === Article + NewsArticle Schema (dual type for Google News eligibility) ===
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": ["Article", "NewsArticle"],
        headline: title,
        description: desc,
        image: article.heroImageUrl || undefined,
        author: {
          "@type": "Person",
          "@id": "https://feelgreat.us.com/#feras-alayed",
          name: "Feras Alayed",
          jobTitle: "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor",
          url: "https://feelgreat.us.com/feras-alayed",
          sameAs: [
            "https://www.instagram.com/use2lose",
            "https://www.tiktok.com/@feras.alayed"
          ]
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://feelgreat.us.com/#organization",
          name: "Feel Great Health by Feras Alayed",
          url: "https://feelgreat.us.com",
          logo: {
            "@type": "ImageObject",
            url: "https://feelgreat.us.com/manus-storage/feel-great-complete_44bb8752.png",
            width: 600,
            height: 60
          }
        },
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://feelgreat.us.com/blog/${article.slug}`
        },
        wordCount: getField(article, 'content', lang).split(/\s+/).length,
        timeRequired: `PT${article.readTimeMinutes}M`,
        inLanguage: lang,
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-headline", ".article-summary", ".key-takeaways", ".tldr-summary"]
        },
        articleSection: article.category,
      };

      const articleScriptEl = document.createElement("script");
      articleScriptEl.id = "article-schema";
      articleScriptEl.type = "application/ld+json";
      articleScriptEl.textContent = JSON.stringify(articleSchema);
      document.head.appendChild(articleScriptEl);

      // === Breadcrumb Schema ===
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.home,
            item: "https://feelgreat.us.com"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t.blog,
            item: "https://feelgreat.us.com/blog"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.category,
            item: `https://feelgreat.us.com/blog?category=${article.category}`
          },
          {
            "@type": "ListItem",
            position: 4,
            name: title,
            item: `https://feelgreat.us.com/blog/${article.slug}`
          }
        ]
      };

      const breadcrumbScriptEl = document.createElement("script");
      breadcrumbScriptEl.id = "breadcrumb-schema";
      breadcrumbScriptEl.type = "application/ld+json";
      breadcrumbScriptEl.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScriptEl);

      // === Author/Person Schema ===
      const authorSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://feelgreat.us.com/#feras-alayed",
        name: "Feras Alayed",
        alternateName: "فراس العايد",
        jobTitle: "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor",
        description: "Global educator, speaker, entrepreneur, therapeutic and behavioral nutrition specialist, and leadership mentor dedicated to helping people create meaningful transformation in health, mindset, leadership, and financial future.",
        url: "https://feelgreat.us.com/feras-alayed",
        image: "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
        sameAs: [
          "https://www.instagram.com/use2lose",
          "https://www.tiktok.com/@feras.alayed"
        ],
        knowsAbout: [
          "Therapeutic Nutrition",
          "Behavioral Nutrition",
          "Insulin Resistance",
          "Metabolic Health",
          "Sustainable Health",
          "Intermittent Fasting",
          "Gut Health",
          "Weight Management"
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Professional Certification",
            name: "Therapeutic & Behavioral Nutrition Specialist"
          }
        ]
      };

      const authorScriptEl = document.createElement("script");
      authorScriptEl.id = "author-schema";
      authorScriptEl.type = "application/ld+json";
      authorScriptEl.textContent = JSON.stringify(authorSchema);
      document.head.appendChild(authorScriptEl);

      // === FAQ Schema ===
      try {
        const keywords = article.keywords || "";
        const faqSchemaMatch = keywords.match(/FAQ_SCHEMA:(\{.*?\})(?=\||$)/);
        if (faqSchemaMatch && faqSchemaMatch[1]) {
          const faqSchemaEl = document.createElement("script");
          faqSchemaEl.id = "faq-schema";
          faqSchemaEl.type = "application/ld+json";
          faqSchemaEl.textContent = faqSchemaMatch[1];
          document.head.appendChild(faqSchemaEl);
        }
      } catch (e) {
        // ignore FAQ schema parse errors
      }

      // === HowTo Schema ===
      document.getElementById("howto-schema")?.remove();
      try {
        const keywords = article.keywords || "";
        const howToMatch = keywords.match(/HOWTO_SCHEMA:(\{.*\})$/);
        if (howToMatch && howToMatch[1]) {
          const howToSchemaEl = document.createElement("script");
          howToSchemaEl.id = "howto-schema";
          howToSchemaEl.type = "application/ld+json";
          howToSchemaEl.textContent = howToMatch[1];
          document.head.appendChild(howToSchemaEl);
        }
      } catch (e) {
        // ignore HowTo schema parse errors
      }

      // === Canonical URL ===
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', `https://feelgreat.us.com/blog/${article.slug}`);
      if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);

      return () => {
        document.getElementById("article-schema")?.remove();
        document.getElementById("faq-schema")?.remove();
        document.getElementById("howto-schema")?.remove();
        document.getElementById("breadcrumb-schema")?.remove();
        document.getElementById("author-schema")?.remove();
        document.querySelector('link[rel="canonical"]')?.remove();
      };
    }
  }, [article, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container max-w-3xl space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {t.notFound}
          </p>
          <Link href="/blog" className="text-[#1a5276] hover:underline font-medium">
            {t.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const content = getField(article, 'content', lang);
  const title = getField(article, 'title', lang);
  const excerpt = getField(article, 'excerpt', lang);

  const localeMap: Record<string, string> = { ar: 'ar-SA', en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' };
  const dateLocale = localeMap[lang] || 'en-US';

  const publishDate = new Date(article.createdAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Always show an update date (use updatedAt or fallback to createdAt) for "محدَّث 2026" SEO benefit
  const rawUpdateDate = article.updatedAt || article.createdAt;
  const updateDate = new Date(rawUpdateDate).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#0a1628] border-b border-white/10 py-3">
        <div className="container max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              {t.home}
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              {t.blog}
            </Link>
            <span className="text-gray-600">/</span>
            <Link href={`/blog?category=${article.category}`} className="hover:text-white transition-colors">
              {article.category}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300 truncate max-w-[200px]">{title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      {article.heroImageUrl && (
        <div className="w-full max-h-[400px] overflow-hidden">
          <img
            src={article.heroImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Article Header */}
      <header className="bg-gradient-to-b from-[#0a1628] to-[#132240] py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#c8a951]/20 text-[#c8a951]">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">
              {article.readTimeMinutes} {t.minRead}
            </span>
            {article.wordCount && article.wordCount > 0 && (
              <span className="text-xs text-gray-400">
                {article.wordCount.toLocaleString()} {t.words}
              </span>
            )}
          </div>
          <h1 className="article-headline text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="article-summary text-gray-300 text-lg">{excerpt}</p>

          {/* Author & EEAT Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <img loading="lazy"
                src="/manus-storage/feras-professional_115956a2.png"
                alt="Feras Alayed"
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <div>
                <p className="text-white font-medium text-sm">
                  {t.author}
                </p>
                <p className="text-gray-400 text-xs">
                  {t.authorTitle}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 sm:ms-auto">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {t.published}{publishDate}
              </span>
              <span className="flex items-center gap-1 font-medium text-green-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {t.updated}{updateDate}
              </span>
            </div>
          </div>

          {/* Scientific Review Badge */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/30 border border-green-700/40 w-fit">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs text-green-300">
              {lang === 'ar' ? "تمت المراجعة العلمية • المحتوى تعليمي ولا يُغني عن استشارة الطبيب"
                : lang === 'fr' ? "Révisé scientifiquement • Contenu éducatif, ne remplace pas un avis médical"
                : lang === 'es' ? "Revisado científicamente • Contenido educativo, no sustituye el consejo médico"
                : lang === 'de' ? "Wissenschaftlich geprüft • Bildungsinhalte, kein Ersatz für ärztlichen Rat"
                : lang === 'tr' ? "Bilimsel olarak incelendi • Eğitim amaçlı, tıbbi tavsiye yerine geçmez"
                : "Scientifically Reviewed • Educational content, not a substitute for medical advice"}
            </span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      {content && <TableOfContents content={content} isAr={isAr} lang={lang} />}

      {/* Article Content */}
      <article className="container max-w-3xl py-12">
        <div
          className="article-content prose prose-lg max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:border-border
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-muted-foreground
            prose-strong:text-foreground
            prose-a:text-[#1a5276] prose-a:underline hover:prose-a:text-[#c8a951]
            prose-blockquote:border-[#c8a951] prose-blockquote:bg-muted/50 prose-blockquote:rounded-lg prose-blockquote:py-2 prose-blockquote:px-4
            [&_.key-takeaways]:bg-gradient-to-r [&_.key-takeaways]:from-emerald-50 [&_.key-takeaways]:to-teal-50 [&_.key-takeaways]:dark:from-emerald-950/30 [&_.key-takeaways]:dark:to-emerald-950/30 [&_.key-takeaways]:rounded-xl [&_.key-takeaways]:p-6 [&_.key-takeaways]:mb-8 [&_.key-takeaways]:border [&_.key-takeaways]:border-emerald-200 [&_.key-takeaways]:dark:border-emerald-800/40
            [&_.key-takeaways_h2]:text-lg [&_.key-takeaways_h2]:font-bold [&_.key-takeaways_h2]:text-emerald-800 [&_.key-takeaways_h2]:dark:text-emerald-300 [&_.key-takeaways_h2]:border-0 [&_.key-takeaways_h2]:mt-0 [&_.key-takeaways_h2]:mb-3 [&_.key-takeaways_h2]:pb-0
            [&_.key-takeaways_ul]:space-y-2 [&_.key-takeaways_ul]:list-none [&_.key-takeaways_ul]:pl-0
            [&_.key-takeaways_li]:text-sm [&_.key-takeaways_li]:text-emerald-900 [&_.key-takeaways_li]:dark:text-emerald-200 [&_.key-takeaways_li]:pl-5 [&_.key-takeaways_li]:relative [&_.key-takeaways_li]:before:content-['✓'] [&_.key-takeaways_li]:before:absolute [&_.key-takeaways_li]:before:left-0 [&_.key-takeaways_li]:before:text-emerald-600
            [&_.tldr-summary]:bg-gradient-to-r [&_.tldr-summary]:from-blue-50 [&_.tldr-summary]:to-indigo-50 [&_.tldr-summary]:dark:from-blue-950/30 [&_.tldr-summary]:dark:to-indigo-950/30 [&_.tldr-summary]:rounded-xl [&_.tldr-summary]:p-6 [&_.tldr-summary]:mb-8 [&_.tldr-summary]:border [&_.tldr-summary]:border-blue-200 [&_.tldr-summary]:dark:border-blue-800/40 [&_.tldr-summary]:relative
            [&_.tldr-summary_h2]:text-lg [&_.tldr-summary_h2]:font-bold [&_.tldr-summary_h2]:text-blue-800 [&_.tldr-summary_h2]:dark:text-blue-300 [&_.tldr-summary_h2]:border-0 [&_.tldr-summary_h2]:mt-0 [&_.tldr-summary_h2]:mb-3 [&_.tldr-summary_h2]:pb-0
            [&_.tldr-summary_p]:text-sm [&_.tldr-summary_p]:text-blue-900 [&_.tldr-summary_p]:dark:text-blue-200 [&_.tldr-summary_p]:leading-relaxed [&_.tldr-summary_p]:mb-0
            [&_.people-also-ask]:bg-gradient-to-r [&_.people-also-ask]:from-amber-50 [&_.people-also-ask]:to-orange-50 [&_.people-also-ask]:dark:from-amber-950/30 [&_.people-also-ask]:dark:to-orange-950/30 [&_.people-also-ask]:rounded-xl [&_.people-also-ask]:p-6 [&_.people-also-ask]:my-8 [&_.people-also-ask]:border [&_.people-also-ask]:border-amber-200 [&_.people-also-ask]:dark:border-amber-800/40
            [&_.people-also-ask_h2]:text-lg [&_.people-also-ask_h2]:font-bold [&_.people-also-ask_h2]:text-amber-800 [&_.people-also-ask_h2]:dark:text-amber-300 [&_.people-also-ask_h2]:border-0 [&_.people-also-ask_h2]:mt-0 [&_.people-also-ask_h2]:mb-4 [&_.people-also-ask_h2]:pb-0
            [&_.paa-item]:bg-white/60 [&_.paa-item]:dark:bg-white/5 [&_.paa-item]:rounded-lg [&_.paa-item]:p-4 [&_.paa-item]:mb-3 [&_.paa-item]:border [&_.paa-item]:border-amber-100 [&_.paa-item]:dark:border-amber-800/30
            [&_.paa-item_h3]:text-base [&_.paa-item_h3]:font-semibold [&_.paa-item_h3]:text-amber-900 [&_.paa-item_h3]:dark:text-amber-200 [&_.paa-item_h3]:mb-2
            [&_.paa-item_p]:text-sm [&_.paa-item_p]:text-foreground/80 [&_.paa-item_p]:mb-0
            [&_.faq-item]:bg-muted/30 [&_.faq-item]:rounded-lg [&_.faq-item]:p-4 [&_.faq-item]:mb-3 [&_.faq-item]:border [&_.faq-item]:border-border
            [&_.faq-item_h3]:text-base [&_.faq-item_h3]:font-semibold [&_.faq-item_h3]:text-foreground [&_.faq-item_h3]:mb-2
            [&_.article-cta]:bg-gradient-to-r [&_.article-cta]:from-[#0a1628] [&_.article-cta]:to-[#1a5276] [&_.article-cta]:rounded-xl [&_.article-cta]:p-8 [&_.article-cta]:mt-12 [&_.article-cta]:text-center
            [&_.article-cta_h2]:text-white [&_.article-cta_h2]:text-xl [&_.article-cta_h2]:border-0
            [&_.article-cta_p]:text-gray-300
            [&_.cta-buttons]:flex [&_.cta-buttons]:flex-col [&_.cta-buttons]:sm:flex-row [&_.cta-buttons]:gap-3 [&_.cta-buttons]:justify-center [&_.cta-buttons]:mt-4
            [&_.cta-whatsapp]:bg-green-500 [&_.cta-whatsapp]:text-white [&_.cta-whatsapp]:px-6 [&_.cta-whatsapp]:py-3 [&_.cta-whatsapp]:rounded-lg [&_.cta-whatsapp]:font-bold [&_.cta-whatsapp]:no-underline [&_.cta-whatsapp]:hover:bg-green-600
            [&_.cta-partner]:bg-[#c8a951] [&_.cta-partner]:text-[#0a1628] [&_.cta-partner]:px-6 [&_.cta-partner]:py-3 [&_.cta-partner]:rounded-lg [&_.cta-partner]:font-bold [&_.cta-partner]:no-underline [&_.cta-partner]:hover:bg-[#d4b85c]
            [&_.cta-assess]:bg-[#1a5276] [&_.cta-assess]:text-white [&_.cta-assess]:px-6 [&_.cta-assess]:py-3 [&_.cta-assess]:rounded-lg [&_.cta-assess]:font-bold [&_.cta-assess]:no-underline [&_.cta-assess]:hover:bg-[#1e6a9c]
            [&_.cta-stories]:bg-white/10 [&_.cta-stories]:text-white [&_.cta-stories]:px-6 [&_.cta-stories]:py-3 [&_.cta-stories]:rounded-lg [&_.cta-stories]:font-medium [&_.cta-stories]:no-underline [&_.cta-stories]:border [&_.cta-stories]:border-white/30 [&_.cta-stories]:hover:bg-white/20
            [&_.pillar-link]:text-gray-400 [&_.pillar-link]:text-sm [&_.pillar-link]:mt-4 [&_.pillar-link_a]:text-[#c8a951] [&_.pillar-link_a]:no-underline [&_.pillar-link_a]:hover:underline
            [&_.cta-btn]:inline-block [&_.cta-btn]:bg-amber-500 [&_.cta-btn]:text-slate-900 [&_.cta-btn]:px-6 [&_.cta-btn]:py-3 [&_.cta-btn]:rounded-lg [&_.cta-btn]:font-bold [&_.cta-btn]:no-underline [&_.cta-btn]:hover:bg-amber-400 [&_.cta-btn]:transition-colors [&_.cta-btn]:mt-2
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      {/* Unified CTA Section - Convert Readers to Clients */}
      <UnifiedCTA isAr={isAr} lang={lang} />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="container max-w-3xl pb-8">
          <div className="flex flex-wrap gap-2">
            {(article.tags as string[]).map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Cluster Navigation */}
      {article.pillarId && (
        <ClusterNavigation pillarId={article.pillarId} currentSlug={article.slug} isAr={isAr} lang={lang} />
      )}

      {/* Share & CTA */}
      <div className="container max-w-3xl pb-12">
        <div className="border-t pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <ShareButtons
              url={`/blog/${article.slug}`}
              title={title}
              description={excerpt}
              lang={lang}
              contentType="article"
              contentSlug={article.slug}
            />
            <a
              href="https://wa.me/96877020770?text=قرأت مقالك وأريد استشارة صحية"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
            >
              {lang === 'ar' ? "احجز استشارة مجانية" : lang === 'fr' ? "Réservez une consultation gratuite" : lang === 'es' ? "Reserve una consulta gratuita" : lang === 'de' ? "Kostenlose Beratung buchen" : lang === 'tr' ? "Ücretsiz danışma ayırtın" : "Book Free Consultation"}
            </a>
          </div>
        </div>
      </div>

      {/* Author Bio Box - E-E-A-T Enhancement */}
      <AuthorBioBox isAr={isAr} lang={lang} />

      {/* Comments Section */}
      <div className="container max-w-3xl pb-8">
        <ArticleComments articleId={article.id} />
      </div>

      {/* Related Success Stories */}
      <RelatedSuccessStories category={article.category} isAr={isAr} lang={lang} />

      {/* Related Articles - Internal Linking for SEO */}
      <RelatedArticles currentArticleId={article.id} category={article.category} limit={4} />

      {/* Floating Share Bar - appears on scroll */}
      <FloatingShareBar
        url={`/blog/${article.slug}`}
        title={title}
        description={excerpt}
        lang={lang}
        showAfter={500}
        contentType="article"
        contentSlug={article.slug}
      />

      {/* Medical Disclaimer Footer */}
      <div className="bg-muted/30 border-t py-6">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <p className="font-semibold mb-1">
                {lang === 'ar' ? "إخلاء مسؤولية طبية" : lang === 'fr' ? "Avertissement médical" : lang === 'es' ? "Descargo de responsabilidad médica" : lang === 'de' ? "Medizinischer Haftungsausschluss" : lang === 'tr' ? "Tıbbi sorumluluk reddi" : "Medical Disclaimer"}
              </p>
              <p>
                {lang === 'ar' ? "هذا المحتوى تعليمي ومعلوماتي فقط ولا يُعد بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص أو العلاج. استشر طبيبك دائماً قبل إجراء أي تغييرات في نظامك الغذائي أو نمط حياتك."
                  : lang === 'fr' ? "Ce contenu est uniquement à des fins éducatives et informatives et ne remplace pas un avis médical professionnel. Consultez toujours votre médecin avant de modifier votre alimentation ou votre mode de vie."
                  : lang === 'es' ? "Este contenido es solo con fines educativos e informativos y no sustituye el consejo médico profesional. Consulte siempre a su médico antes de realizar cambios en su dieta o estilo de vida."
                  : lang === 'de' ? "Dieser Inhalt dient nur zu Bildungs- und Informationszwecken und ersetzt keine professionelle medizinische Beratung. Konsultieren Sie immer Ihren Arzt, bevor Sie Änderungen an Ihrer Ernährung oder Ihrem Lebensstil vornehmen."
                  : lang === 'tr' ? "Bu içerik yalnızca eğitim ve bilgilendirme amaçlıdır ve profesyonel tıbbi tavsiyenin yerini almaz. Diyetinizde veya yaşam tarzınızda değişiklik yapmadan önce her zaman doktorunuza danışın."
                  : "This content is for educational and informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician before making any changes to your diet or lifestyle."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Interactive Table of Contents Component
// ============================================================
function TableOfContents({ content, isAr, lang }: { content: string; isAr: boolean; lang?: string }) {
  const tocLabel = lang === 'fr' ? 'Table des matières' : lang === 'es' ? 'Tabla de contenidos' : lang === 'de' ? 'Inhaltsverzeichnis' : lang === 'tr' ? 'İçindekiler' : isAr ? 'محتويات المقال' : 'Table of Contents';
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from HTML content
  const headings = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    return Array.from(elements).map((el, index) => {
      const text = el.textContent || "";
      const id = `heading-${index}`;
      const level = el.tagName === "H2" ? 2 : 3;
      return { id, text, level };
    });
  }, [content]);

  // Add IDs to headings in the article after render
  useEffect(() => {
    const articleEl = document.querySelector(".article-content");
    if (!articleEl) return;
    const elements = articleEl.querySelectorAll("h2, h3");
    elements.forEach((el, index) => {
      el.id = `heading-${index}`;
    });
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    const articleEl = document.querySelector(".article-content");
    if (articleEl) {
      const elements = articleEl.querySelectorAll("h2, h3");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [content]);

  if (headings.length < 3) return null; // Only show TOC for articles with 3+ headings

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="container max-w-3xl pt-8">
      <nav
        className="rounded-xl border bg-muted/20 overflow-hidden transition-all duration-200"
        aria-label="Table of Contents"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#c8a951]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="font-semibold text-sm text-foreground">
              {tocLabel}
            </span>
            <span className="text-xs text-muted-foreground">({headings.length})</span>
          </div>
          <svg
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="px-5 pb-4 border-t border-border/50">
            <ol className="space-y-1 pt-3">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={`${heading.level === 3 ? (isAr ? "pr-4" : "pl-4") : ""}`}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-start text-sm py-1.5 px-2 rounded-md transition-all duration-150 hover:bg-muted/50 ${
                      activeId === heading.id
                        ? "text-[#1a5276] font-medium bg-[#1a5276]/5 border-s-2 border-[#c8a951]"
                        : "text-muted-foreground hover:text-foreground"
                    } ${heading.level === 3 ? "text-xs" : "font-medium"}`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </nav>
    </div>
  );
}

// ============================================================
// Content Cluster Navigation Component
// ============================================================
function ClusterNavigation({ pillarId, currentSlug, isAr, lang }: { pillarId: string; currentSlug: string; isAr: boolean; lang?: string }) {
  const { data } = trpc.blog.getByPillar.useQuery({ pillarId, limit: 20 });
  const clusterArticles = (data ?? []).filter((a) => a.slug !== currentSlug).slice(0, 8);

  if (clusterArticles.length === 0) return null;

  const PILLAR_NAMES: Record<string, { ar: string; en: string }> = {
    "sustainable-health": { ar: "الصحة المستدامة", en: "Sustainable Health" },
    "insulin-resistance": { ar: "مقاومة الأنسولين", en: "Insulin Resistance" },
    "diabetes": { ar: "إدارة السكري", en: "Diabetes Management" },
    "gut-health": { ar: "صحة الأمعاء", en: "Gut Health" },
    "fatty-liver": { ar: "الكبد الدهني", en: "Fatty Liver" },
    "weight-management": { ar: "إدارة الوزن", en: "Weight Management" },
    "behavioral-nutrition": { ar: "التغذية السلوكية", en: "Behavioral Nutrition" },
    "intermittent-fasting": { ar: "الصيام المتقطع", en: "Intermittent Fasting" },
    "sleep-energy": { ar: "النوم والطاقة", en: "Sleep & Energy" },
    "womens-health": { ar: "صحة المرأة", en: "Women's Health" },
    "chronic-inflammation": { ar: "الالتهابات المزمنة", en: "Chronic Inflammation" },
    "heart-health": { ar: "صحة القلب", en: "Heart Health" },
    "mental-nutrition": { ar: "الصحة النفسية والتغذية", en: "Mental Health & Nutrition" },
  };

  const pillarName = PILLAR_NAMES[pillarId] || { ar: pillarId, en: pillarId };

  return (
    <div className="container max-w-3xl pb-8">
      <div className="rounded-xl border bg-muted/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#c8a951]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h3 className="font-bold text-sm">
            {isAr ? `📚 المزيد من سلسلة: ${pillarName.ar}` : lang === 'fr' ? `📚 Plus de : ${pillarName.en}` : lang === 'es' ? `📚 Más de: ${pillarName.en}` : lang === 'de' ? `📚 Mehr aus: ${pillarName.en}` : lang === 'tr' ? `📚 Daha fazla: ${pillarName.en}` : `📚 More from: ${pillarName.en}`}
          </h3>
        </div>
        <div className="grid gap-2">
          {clusterArticles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a951] flex-shrink-0" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">
                {getField(a, 'title', lang || 'en')}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href={`/topics/${pillarId}`}
          className="inline-flex items-center gap-1 mt-4 text-xs text-[#c8a951] hover:underline font-medium"
        >
          {isAr ? `اقرأ دليل ${pillarName.ar} الشامل ←` : lang === 'fr' ? `Lire le guide complet ${pillarName.en} →` : lang === 'es' ? `Leer la guía completa de ${pillarName.en} →` : lang === 'de' ? `Den vollständigen ${pillarName.en} Leitfaden lesen →` : lang === 'tr' ? `${pillarName.en} tam kılavuzunu oku →` : `Read the full ${pillarName.en} guide →`}
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// Related Success Stories Component
// ============================================================
function RelatedSuccessStories({ category, isAr, lang }: { category: string; isAr: boolean; lang?: string }) {
  // Map article categories to success story categories
  const CATEGORY_MAP: Record<string, string> = {
    "insulin-resistance": "insulin-resistance",
    "diabetes": "diabetes",
    "weight-management": "weight-loss",
    "gut-health": "gut-health",
    "sleep-energy": "energy",
    "fatty-liver": "weight-loss",
    "sustainable-health": "diverse",
    "behavioral-nutrition": "diverse",
    "chronic-inflammation": "diverse",
    "womens-health": "diverse",
    "heart-health": "diverse",
    "mental-nutrition": "diverse",
    "intermittent-fasting": "weight-loss",
  };

  const storyCategory = CATEGORY_MAP[category] || "diverse";
  const { data: stories } = trpc.reviews.byCategory.useQuery(
    { category: storyCategory, limit: 3 },
    { enabled: !!storyCategory }
  );

  return (
    <div className="bg-gradient-to-r from-[#0a1628] to-[#132240] py-10">
      <div className="container max-w-3xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {isAr ? '💪 قصص نجاح حقيقية' : lang === 'fr' ? '💪 Histoires de réussite' : lang === 'es' ? '💪 Historias de éxito reales' : lang === 'de' ? '💪 Echte Erfolgsgeschichten' : lang === 'tr' ? '💪 Gerçek başarı hikayeleri' : '💪 Real Success Stories'}
          </h3>
          <p className="text-sm text-gray-400">
            {isAr ? 'أشخاص حقيقيون حققوا نتائج ملموسة في رحلتهم الصحية' : lang === 'fr' ? 'De vraies personnes avec de vrais résultats' : lang === 'es' ? 'Personas reales con resultados tangibles' : lang === 'de' ? 'Echte Menschen mit greifbaren Ergebnissen' : lang === 'tr' ? 'Gerçek insanlar, gerçek sonuçlar' : 'Real people who achieved tangible results in their health journey'}
          </p>
        </div>

        {/* Display actual success stories if available */}
        {stories && stories.length > 0 && (
          <div className="grid gap-3 mb-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-[#c8a951]">
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{story.name} • {story.country}</span>
                </div>
                <p className="text-sm text-white font-medium mb-1">{story.title}</p>
                <p className="text-xs text-gray-300 line-clamp-2">{story.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={`/success-stories?category=${storyCategory}`}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c8a951] text-[#0a1628] rounded-lg font-medium hover:bg-[#d4b85c] transition-colors text-sm cursor-pointer">
              {isAr ? 'اقرأ قصص النجاح' : lang === 'fr' ? 'Lire les témoignages' : lang === 'es' ? 'Leer historias de éxito' : lang === 'de' ? 'Erfolgsgeschichten lesen' : lang === 'tr' ? 'Başarı hikayelerini oku' : 'Read Success Stories'}
            </span>
          </Link>
          <a
            href="https://wa.me/96877020770?text=أريد أن أبدأ رحلتي الصحية"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
          >
            {isAr ? 'ابدأ رحلتك الآن' : lang === 'fr' ? 'Commencez votre parcours' : lang === 'es' ? 'Comience su viaje' : lang === 'de' ? 'Starten Sie Ihre Reise' : lang === 'tr' ? 'Yolculuğunuza başlayın' : 'Start Your Journey'}
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Author Bio Box Component (E-E-A-T SEO Enhancement)
// ============================================================
function AuthorBioBox({ isAr, lang }: { isAr: boolean; lang: string }) {
  const authorBio = {
    ar: {
      name: "فراس العايد",
      title: "أخصائي التغذية العلاجية والسلوكية",
      credentials: ["مدرج في PDR (المرجع الطبي الأمريكي)", "50+ دراسة سريرية", "12+ سنة خبرة", "حائز على Presidential Sapphire"],
      description: "فراس العايد هو خبير في الصحة المستدامة والتغذية السلوكية، يساعد الناس على تحويل صحتهم وعقليتهم وحياتهم في أكثر من 30 دولة حول العالم.",
      cta: "تعرّف أكثر على فراس"
    },
    en: {
      name: "Feras Alayed",
      title: "Therapeutic & Behavioral Nutrition Specialist",
      credentials: ["Listed in PDR (Physicians' Desk Reference)", "50+ Clinical Studies", "12+ Years Experience", "Presidential Sapphire Award"],
      description: "Feras Alayed is a Global Health & Performance Strategist, helping people transform their health, mindset, and life across 30+ countries with science-backed behavioral nutrition.",
      cta: "Learn more about Feras"
    },
    fr: {
      name: "Feras Alayed",
      title: "Spécialiste en Nutrition Thérapeutique",
      credentials: ["Référencé dans le PDR américain", "50+ études cliniques", "12+ années d'expérience"],
      description: "Feras Alayed est un stratège mondial de la santé, aidant les gens à transformer leur santé et leur vie.",
      cta: "En savoir plus sur Feras"
    },
    es: {
      name: "Feras Alayed",
      title: "Especialista en Nutrición Terapéutica",
      credentials: ["Listado en el PDR estadounidense", "50+ estudios clínicos", "12+ años de experiencia"],
      description: "Feras Alayed es un estratega global de salud, ayudando a las personas a transformar su salud y vida.",
      cta: "Más información sobre Feras"
    },
    de: {
      name: "Feras Alayed",
      title: "Ernährungsspezialist",
      credentials: ["Im PDR (US-Arzneimittelverzeichnis) gelistet", "50+ klinische Studien", "12+ Jahre Erfahrung"],
      description: "Feras Alayed ist ein globaler Gesundheitsstratege, der Menschen hilft, ihre Gesundheit und ihr Leben zu transformieren.",
      cta: "Mehr über Feras erfahren"
    },
    tr: {
      name: "Feras Alayed",
      title: "Terapötik Beslenme Uzmanı",
      credentials: ["PDR'de listelenmiştir", "50+ klinik çalışma", "12+ yıl deneyim"],
      description: "Feras Alayed, insanların sağlık ve yaşamlarını dönüştürmelerine yardımcı olan küresel bir sağlık stratejistidir.",
      cta: "Feras hakkında daha fazla bilgi"
    }
  };

  const bio = authorBio[lang as keyof typeof authorBio] || authorBio.en;

  return (
    <section className="bg-gradient-to-r from-primary/5 to-transparent border-y border-primary/10 py-8">
      <div className="container max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Author Image */}
          <div className="flex-shrink-0">
            <img
              src="/manus-storage/feras-professional.png"
              alt={bio.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "https://ui-avatars.com/api/?name=Feras+Alayed&background=1a365d&color=fff&size=128";
              }}
            />
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {isAr ? "عن المؤلف" : "About the Author"}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">{bio.name}</h3>
            <p className="text-primary font-medium text-sm md:text-base mb-3">{bio.title}</p>

            {/* Credentials Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {bio.credentials.map((cred, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {cred}
                </span>
              ))}
            </div>

            <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
              {bio.description}
            </p>

            <Link
              href="/feras-alayed"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
            >
              {bio.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Related Articles Component
// ============================================================
function RelatedArticles({ category, currentSlug, isAr, lang }: { category: string; currentSlug: string; isAr: boolean; lang?: string }) {
  const { data } = trpc.blog.getByCategory.useQuery({ category, limit: 4 });
  const related = (data ?? []).filter((a) => a.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="bg-muted/30 py-12">
      <div className="container max-w-5xl">
        <h2 className="text-xl font-bold mb-6">
          {isAr ? 'مقالات ذات صلة' : lang === 'fr' ? 'Articles connexes' : lang === 'es' ? 'Artículos relacionados' : lang === 'de' ? 'Verwandte Artikel' : lang === 'tr' ? 'İlgili makaleler' : 'Related Articles'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {related.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group rounded-lg border bg-card p-4 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-sm group-hover:text-[#1a5276] transition-colors line-clamp-2 mb-2">
                {getField(article, 'title', lang || 'en')}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {getField(article, 'excerpt', lang || 'en')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
