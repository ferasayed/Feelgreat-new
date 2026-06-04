import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const { data: article, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Update page title and meta when article loads
  useEffect(() => {
    if (article) {
      const title = isAr ? article.titleAr : article.titleEn;
      document.title = `${title} | Feel Great`;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      const desc = isAr ? article.excerptAr : article.excerptEn;
      if (metaDesc) metaDesc.setAttribute("content", desc);

      // Add Article Schema
      const existingSchema = document.getElementById("article-schema");
      if (existingSchema) existingSchema.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: isAr ? article.titleAr : article.titleEn,
        description: isAr ? article.excerptAr : article.excerptEn,
        author: {
          "@type": "Person",
          name: "Feras Alayed",
          jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
          url: "https://feelgreat.us.com/founder",
        },
        publisher: {
          "@type": "Organization",
          name: "Feel Great",
          url: "https://feelgreat.us.com",
        },
        datePublished: article.createdAt,
        mainEntityOfPage: `https://feelgreat.us.com/blog/${article.slug}`,
        wordCount: (isAr ? article.contentAr : article.contentEn).split(/\s+/).length,
        timeRequired: `PT${article.readTimeMinutes}M`,
      };

      const scriptEl = document.createElement("script");
      scriptEl.id = "article-schema";
      scriptEl.type = "application/ld+json";
      scriptEl.textContent = JSON.stringify(schema);
      document.head.appendChild(scriptEl);

      // Add FAQ Schema if available in keywords field
      const existingFaqSchema = document.getElementById("faq-schema");
      if (existingFaqSchema) existingFaqSchema.remove();

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

      return () => {
        const el = document.getElementById("article-schema");
        if (el) el.remove();
        const faqEl = document.getElementById("faq-schema");
        if (faqEl) faqEl.remove();
      };
    }
  }, [article, isAr]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container max-w-3xl space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={isAr ? "rtl" : "ltr"}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-6">
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

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Article Header */}
      <header className="bg-gradient-to-b from-[#0a1628] to-[#132240] py-16">
        <div className="container max-w-3xl">
          <Link href="/blog" className="text-gray-400 hover:text-white text-sm mb-4 inline-block transition-colors">
            {isAr ? "← العودة للمدونة" : "← Back to Blog"}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#c8a951]/20 text-[#c8a951]">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">
              {article.readTimeMinutes} {isAr ? "دقائق قراءة" : "min read"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(article.createdAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-gray-300 text-lg">{excerpt}</p>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#c8a951] flex items-center justify-center text-[#0a1628] font-bold text-sm">
              FA
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                {isAr ? "فراس العايد" : "Feras Alayed"}
              </p>
              <p className="text-gray-400 text-xs">
                {isAr ? "أخصائي التغذية العلاجية والسلوكية" : "Therapeutic & Behavioral Nutrition Specialist"}
              </p>
            </div>
          </div>
        </div>
      </header>

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

      {/* Related Articles */}
      <RelatedArticles category={article.category} currentSlug={article.slug} isAr={isAr} />
    </div>
  );
}

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
