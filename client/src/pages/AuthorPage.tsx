import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function AuthorPage() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // Fetch author's articles
  const { data: articles } = trpc.blog.list.useQuery({ limit: 12, offset: 0 });
  // Fetch research summaries
  const { data: research } = trpc.research.list.useQuery({ limit: 6, offset: 0 });

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://feelgreat.us.com/#feras-alayed",
    "name": "Feras Alayed",
    "alternateName": "فراس العايد",
    "jobTitle": "Therapeutic & Behavioral Nutrition Specialist",
    "description": "Global Health & Performance Strategist, Leadership Mentor, and Sustainable Health Advocate with expertise in insulin resistance, metabolic health, and behavioral nutrition. Author of 100+ peer-reviewed health articles.",
    "url": "https://feelgreat.us.com/author/feras-alayed",
    "image": "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
    "sameAs": [
      "https://www.instagram.com/use2lose",
      "https://www.tiktok.com/@feras.alayed"
    ],
    "knowsAbout": [
      "Insulin Resistance", "Metabolic Health", "Behavioral Nutrition",
      "Sustainable Health", "Intermittent Fasting", "Gut Health",
      "Weight Management", "Healthy Aging", "Type 2 Diabetes Prevention",
      "Fatty Liver Disease", "Women's Health", "Sleep Optimization",
      "Chronic Inflammation", "Microbiome Health"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "Therapeutic Nutrition Specialist"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "Behavioral Nutrition Coach"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "Health & Performance Strategist"
      }
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Feel Great",
      "url": "https://feelgreat.us.com"
    },
    "mainEntityOfPage": "https://feelgreat.us.com/author/feras-alayed"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://feelgreat.us.com/" },
      { "@type": "ListItem", "position": 2, "name": "Authors", "item": "https://feelgreat.us.com/about" },
      { "@type": "ListItem", "position": 3, "name": "Feras Alayed", "item": "https://feelgreat.us.com/author/feras-alayed" }
    ]
  };

  const credentials = [
    { en: "Therapeutic Nutrition Specialist", ar: "أخصائي التغذية العلاجية" },
    { en: "Behavioral Nutrition Coach", ar: "مدرب التغذية السلوكية" },
    { en: "Health & Performance Strategist", ar: "استراتيجي الصحة والأداء" },
    { en: "Leadership Mentor", ar: "مرشد القيادة" },
    { en: "Sustainable Health Advocate", ar: "مناصر الصحة المستدامة" },
  ];

  const expertiseAreas = [
    { en: "Insulin Resistance & Prediabetes", ar: "مقاومة الأنسولين وما قبل السكري", icon: "🩺" },
    { en: "Metabolic Health Optimization", ar: "تحسين الصحة الأيضية", icon: "⚡" },
    { en: "Behavioral Nutrition Therapy", ar: "العلاج بالتغذية السلوكية", icon: "🧠" },
    { en: "Gut Health & Microbiome", ar: "صحة الأمعاء والميكروبيوم", icon: "🦠" },
    { en: "Sustainable Weight Management", ar: "إدارة الوزن المستدامة", icon: "⚖️" },
    { en: "Intermittent Fasting Protocols", ar: "بروتوكولات الصيام المتقطع", icon: "⏰" },
    { en: "Sleep & Energy Optimization", ar: "تحسين النوم والطاقة", icon: "😴" },
    { en: "Healthy Aging & Longevity", ar: "الشيخوخة الصحية وطول العمر", icon: "🌱" },
    { en: "Women's Hormonal Health", ar: "صحة المرأة الهرمونية", icon: "👩" },
    { en: "Chronic Inflammation Management", ar: "إدارة الالتهاب المزمن", icon: "🔥" },
  ];

  const publications = [
    { en: "100+ Evidence-Based Health Articles", ar: "100+ مقال صحي مبني على الأدلة" },
    { en: "Research Summaries from PubMed, NIH, Nature", ar: "ملخصات أبحاث من PubMed وNIH وNature" },
    { en: "Health Programs & Assessment Tools", ar: "برامج صحية وأدوات تقييم" },
    { en: "Success Stories & Case Studies", ar: "قصص نجاح ودراسات حالة" },
  ];

  useEffect(() => {
    document.title = isAr ? "فراس العايد - أخصائي التغذية العلاجية والسلوكية" : "Feras Alayed - Therapeutic & Behavioral Nutrition Specialist";
    // Inject JSON-LD schemas
    const existingSchemas = document.querySelectorAll('script[data-author-schema]');
    existingSchemas.forEach(el => el.remove());
    const schemaScript1 = document.createElement('script');
    schemaScript1.type = 'application/ld+json';
    schemaScript1.setAttribute('data-author-schema', 'true');
    schemaScript1.textContent = JSON.stringify(authorSchema);
    document.head.appendChild(schemaScript1);
    const schemaScript2 = document.createElement('script');
    schemaScript2.type = 'application/ld+json';
    schemaScript2.setAttribute('data-author-schema', 'true');
    schemaScript2.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(schemaScript2);
    return () => {
      document.querySelectorAll('script[data-author-schema]').forEach(el => el.remove());
    };
  }, [isAr]);

  return (
    <div className={`min-h-screen bg-background ${isAr ? "rtl" : "ltr"}`}>

      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 py-16">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">{isAr ? "الرئيسية" : "Home"}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{isAr ? "فراس العايد" : "Feras Alayed"}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Author Avatar */}
            <img
              src="/manus-storage/feras-professional_115956a2.png"
              alt="Feras Alayed - Therapeutic & Behavioral Nutrition Specialist"
              className="w-32 h-32 rounded-full object-cover object-top shrink-0 shadow-lg ring-4 ring-emerald-200 dark:ring-emerald-800"
            />

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {isAr ? "فراس العايد" : "Feras Alayed"}
              </h1>
              <p className="text-lg text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                {isAr ? "أخصائي التغذية العلاجية والسلوكية | استراتيجي الصحة والأداء العالمي" : "Therapeutic & Behavioral Nutrition Specialist | Global Health & Performance Strategist"}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {isAr 
                  ? "مؤلف أكثر من 100 مقال صحي مبني على الأدلة العلمية من PubMed وNIH والمجلات الطبية الرائدة. يركز على تحويل الأبحاث العلمية المعقدة إلى خطوات عملية قابلة للتطبيق في الحياة اليومية."
                  : "Author of 100+ evidence-based health articles grounded in research from PubMed, NIH, and leading medical journals. Focused on translating complex scientific research into actionable daily health strategies."}
              </p>

              {/* Credentials Badges */}
              <div className="flex flex-wrap gap-2">
                {credentials.map((cred, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {isAr ? cred.ar : cred.en}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-12 space-y-12">
        {/* Expertise Areas */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{isAr ? "مجالات الخبرة" : "Areas of Expertise"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expertiseAreas.map((area, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="text-2xl">{area.icon}</span>
                  <span className="font-medium">{isAr ? area.ar : area.en}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Publications & Contributions */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{isAr ? "المنشورات والمساهمات" : "Publications & Contributions"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publications.map((pub, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <span>{isAr ? pub.ar : pub.en}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Photo Gallery */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{isAr ? "معرض الصور" : "Gallery"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-library_9789048d.jpg" alt="Feras Alayed - Professional" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-speaking_97c75a22.jpg" alt="Feras Alayed - Speaking" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-smile_ab0e9182.jpg" alt="Feras Alayed - Casual" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-training_3e46aa5d.jpg" alt="Feras Alayed - Training" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-casual_c846f5ed.jpg" alt="Feras Alayed - Consultation" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[3/4]">
              <img src="/manus-storage/feras-professional_115956a2.png" alt="Feras Alayed - Professional" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Connected Content - Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isAr ? "أحدث المقالات" : "Latest Articles"}</h2>
            <Link href="/blog" className="text-sm text-primary hover:underline">
              {isAr ? "عرض الكل →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles?.articles?.slice(0, 6).map((article: any) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{article.category}</Badge>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {isAr ? article.titleAr : article.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? article.excerptAr : article.excerptEn}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* Connected Content - Research */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isAr ? "ملخصات الأبحاث" : "Research Summaries"}</h2>
            <Link href="/research" className="text-sm text-primary hover:underline">
              {isAr ? "عرض الكل →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {research?.studies?.slice(0, 4).map((study: any) => (
              <Link key={study.slug} href={`/research/${study.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{study.journal}</Badge>
                      <Badge variant={study.evidenceLevel === "high" ? "default" : "secondary"} className="text-xs">
                        {study.evidenceLevel}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {isAr ? study.titleAr : study.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? study.summary30sAr : study.summary30sEn}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* Connected Pages */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{isAr ? "صفحات مرتبطة" : "Connected Pages"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/success-stories">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-semibold">{isAr ? "قصص النجاح" : "Success Stories"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{isAr ? "تحولات حقيقية مع فراس" : "Real transformations with Feras"}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/health-assessment">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold">{isAr ? "التقييم الصحي" : "Health Assessment"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{isAr ? "تقييم مجاني مع فراس" : "Free assessment with Feras"}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/partner-with-feras">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <h3 className="font-semibold">{isAr ? "الشراكة مع فراس" : "Partner With Feras"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{isAr ? "فرصة عمل صحية" : "Health business opportunity"}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Trust Statement */}
        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-lg mb-2">{isAr ? "التزامنا بالمصداقية العلمية" : "Our Commitment to Scientific Integrity"}</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {isAr 
                ? "جميع المقالات والملخصات البحثية تستند إلى دراسات محكّمة من PubMed وNIH والمجلات الطبية الرائدة. لا ننشر أي ادعاءات علاجية غير مدعومة بالأدلة. نوضح دائماً الفرق بين الدراسات الأولية والنتائج المثبتة على البشر."
                : "All articles and research summaries are grounded in peer-reviewed studies from PubMed, NIH, and leading medical journals. We never publish unsupported therapeutic claims. We always clarify the difference between preliminary studies and proven human results."}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
