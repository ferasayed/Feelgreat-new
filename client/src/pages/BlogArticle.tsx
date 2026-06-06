import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState, useMemo } from "react";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

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
      const title = isAr ? article.titleAr : article.titleEn;
      document.title = `${title} | Feel Great`;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      const desc = isAr ? article.excerptAr : article.excerptEn;
      if (metaDesc) metaDesc.setAttribute("content", desc);

      // Remove existing schemas
      document.getElementById("article-schema")?.remove();
      document.getElementById("faq-schema")?.remove();
      document.getElementById("breadcrumb-schema")?.remove();
      document.getElementById("author-schema")?.remove();

      // === Article Schema ===
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: desc,
        image: article.heroImageUrl || undefined,
        author: {
          "@type": "Person",
          name: "Feras Alayed",
          jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
          url: "https://feelgreat.us.com/founder",
          sameAs: [
            "https://www.instagram.com/use2lose",
            "https://www.tiktok.com/@feras.alayed"
          ]
        },
        publisher: {
          "@type": "Organization",
          name: "Feel Great",
          url: "https://feelgreat.us.com",
          logo: {
            "@type": "ImageObject",
            url: "https://feelgreat.us.com/favicon.ico"
          }
        },
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        mainEntityOfPage: `https://feelgreat.us.com/blog/${article.slug}`,
        wordCount: (isAr ? article.contentAr : article.contentEn).split(/\s+/).length,
        timeRequired: `PT${article.readTimeMinutes}M`,
        inLanguage: isAr ? "ar" : "en",
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
            name: isAr ? "الرئيسية" : "Home",
            item: "https://feelgreat.us.com"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isAr ? "المدونة" : "Blog",
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
        name: "Feras Alayed",
        alternateName: "فراس العايد",
        jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
        description: "Founder of the Health Investor concept, Presidential Sapphire partner at Unicity International. Specializes in sustainable health, behavioral nutrition, and metabolic health optimization.",
        url: "https://feelgreat.us.com/founder",
        image: "https://feelgreat.us.com/founder",
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
        const faqSchemaMatch = keywords.match(/FAQ_SCHEMA:(\{.*\})/);
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

      // === Canonical URL ===
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', `https://feelgreat.us.com/blog/${article.slug}`);
      if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);

      return () => {
        document.getElementById("article-schema")?.remove();
        document.getElementById("faq-schema")?.remove();
        document.getElementById("breadcrumb-schema")?.remove();
        document.getElementById("author-schema")?.remove();
        document.querySelector('link[rel="canonical"]')?.remove();
      };
    }
  }, [article, isAr]);

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
            {isAr ? "المقال غير موجود" : "Article not found"}
          </p>
          <Link href="/blog" className="text-[#1a5276] hover:underline font-medium">
            {isAr ? "← العودة للمدونة" : "← Back to Blog"}
          </Link>
        </div>
      </div>
    );
  }

  const content = isAr ? article.contentAr : article.contentEn;
  const title = isAr ? article.titleAr : article.titleEn;
  const excerpt = isAr ? article.excerptAr : article.excerptEn;

  const publishDate = new Date(article.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updateDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#0a1628] border-b border-white/10 py-3">
        <div className="container max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              {isAr ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              {isAr ? "المدونة" : "Blog"}
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

      {/* Article Header */}
      <header className="bg-gradient-to-b from-[#0a1628] to-[#132240] py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#c8a951]/20 text-[#c8a951]">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">
              {article.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
            </span>
            {article.wordCount && article.wordCount > 0 && (
              <span className="text-xs text-gray-400">
                {article.wordCount.toLocaleString()} {isAr ? "كلمة" : "words"}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-gray-300 text-lg">{excerpt}</p>

          {/* Author & EEAT Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="/manus-storage/feras-professional_115956a2.png"
                alt="Feras Alayed"
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <div>
                <p className="text-white font-medium text-sm">
                  {isAr ? "فراس العايد" : "Feras Alayed"}
                </p>
                <p className="text-gray-400 text-xs">
                  {isAr ? "أخصائي التغذية العلاجية والسلوكية" : "Therapeutic & Behavioral Nutrition Specialist"}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 sm:ms-auto">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {isAr ? "نُشر: " : "Published: "}{publishDate}
              </span>
              {updateDate && updateDate !== publishDate && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  {isAr ? "آخر تحديث: " : "Updated: "}{updateDate}
                </span>
              )}
            </div>
          </div>

          {/* Scientific Review Badge */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/30 border border-green-700/40 w-fit">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs text-green-300">
              {isAr
                ? "تمت المراجعة العلمية • المحتوى تعليمي ولا يُغني عن استشارة الطبيب"
                : "Scientifically Reviewed • Educational content, not a substitute for medical advice"}
            </span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      {content && <TableOfContents content={content} isAr={isAr} />}

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
          "
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

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
        <ClusterNavigation pillarId={article.pillarId} currentSlug={article.slug} isAr={isAr} />
      )}

      {/* Share & CTA */}
      <div className="container max-w-3xl pb-12">
        <div className="border-t pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {isAr ? "شارك المقال:" : "Share:"}
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(`https://feelgreat.us.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                𝕏
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title} https://feelgreat.us.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20 transition-colors text-xs font-bold"
              >
                W
              </a>
            </div>
            <a
              href="https://wa.me/96877020770?text=قرأت مقالك وأريد استشارة صحية"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
            >
              {isAr ? "احجز استشارة مجانية" : "Book Free Consultation"}
            </a>
          </div>
        </div>
      </div>

      {/* Related Success Stories */}
      <RelatedSuccessStories category={article.category} isAr={isAr} />

      {/* Related Articles */}
      <RelatedArticles category={article.category} currentSlug={article.slug} isAr={isAr} />

      {/* Medical Disclaimer Footer */}
      <div className="bg-muted/30 border-t py-6">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <p className="font-semibold mb-1">
                {isAr ? "إخلاء مسؤولية طبية" : "Medical Disclaimer"}
              </p>
              <p>
                {isAr
                  ? "هذا المحتوى تعليمي ومعلوماتي فقط ولا يُعد بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص أو العلاج. استشر طبيبك دائماً قبل إجراء أي تغييرات في نظامك الغذائي أو نمط حياتك."
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
function TableOfContents({ content, isAr }: { content: string; isAr: boolean }) {
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
              {isAr ? "محتويات المقال" : "Table of Contents"}
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
function ClusterNavigation({ pillarId, currentSlug, isAr }: { pillarId: string; currentSlug: string; isAr: boolean }) {
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
            {isAr ? `📚 المزيد من سلسلة: ${pillarName.ar}` : `📚 More from: ${pillarName.en}`}
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
                {isAr ? a.titleAr : a.titleEn}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href={`/topics/${pillarId}`}
          className="inline-flex items-center gap-1 mt-4 text-xs text-[#c8a951] hover:underline font-medium"
        >
          {isAr ? `اقرأ دليل ${pillarName.ar} الشامل ←` : `Read the full ${pillarName.en} guide →`}
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// Related Success Stories Component
// ============================================================
function RelatedSuccessStories({ category, isAr }: { category: string; isAr: boolean }) {
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
            {isAr ? "💪 قصص نجاح حقيقية" : "💪 Real Success Stories"}
          </h3>
          <p className="text-sm text-gray-400">
            {isAr
              ? "أشخاص حقيقيون حققوا نتائج ملموسة في رحلتهم الصحية"
              : "Real people who achieved tangible results in their health journey"}
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
              {isAr ? "اقرأ قصص النجاح" : "Read Success Stories"}
            </span>
          </Link>
          <a
            href="https://wa.me/96877020770?text=أريد أن أبدأ رحلتي الصحية"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
          >
            {isAr ? "ابدأ رحلتك الآن" : "Start Your Journey"}
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Related Articles Component
// ============================================================
function RelatedArticles({ category, currentSlug, isAr }: { category: string; currentSlug: string; isAr: boolean }) {
  const { data } = trpc.blog.getByCategory.useQuery({ category, limit: 4 });
  const related = (data ?? []).filter((a) => a.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="bg-muted/30 py-12">
      <div className="container max-w-5xl">
        <h2 className="text-xl font-bold mb-6">
          {isAr ? "مقالات ذات صلة" : "Related Articles"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {related.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group rounded-lg border bg-card p-4 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-sm group-hover:text-[#1a5276] transition-colors line-clamp-2 mb-2">
                {isAr ? article.titleAr : article.titleEn}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {isAr ? article.excerptAr : article.excerptEn}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
