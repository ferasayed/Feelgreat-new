import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EVIDENCE_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  moderate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  preliminary: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "very-low": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const EVIDENCE_LABELS: Record<string, { ar: string; en: string }> = {
  high: { ar: "دليل قوي", en: "Strong Evidence" },
  moderate: { ar: "دليل متوسط", en: "Moderate Evidence" },
  low: { ar: "دليل ضعيف", en: "Low Evidence" },
  preliminary: { ar: "أولي", en: "Preliminary" },
  "very-low": { ar: "ضعيف جداً", en: "Very Low" },
};

export default function ResearchStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [readingLevel, setReadingLevel] = useState<"30s" | "1min" | "3min" | "full">("1min");

  const { data: study, isLoading, error } = trpc.research.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  useEffect(() => {
    if (study) {
      document.title = isAr ? study.titleAr : study.titleEn;
    }
  }, [study, isAr]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-4xl space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isAr ? "الدراسة غير موجودة" : "Study Not Found"}</h1>
          <Link href="/research">
            <span className="text-primary hover:underline">{isAr ? "العودة للأبحاث" : "Back to Research"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = isAr ? study.titleAr : study.titleEn;
  const evidenceLabel = EVIDENCE_LABELS[study.evidenceLevel] || { ar: study.evidenceLevel, en: study.evidenceLevel };
  const evidenceColor = EVIDENCE_COLORS[study.evidenceLevel] || "bg-gray-100 text-gray-800";

  const getSummaryContent = () => {
    switch (readingLevel) {
      case "30s": return isAr ? study.summary30sAr : study.summary30sEn;
      case "1min": return isAr ? study.summary1minAr : study.summary1minEn;
      case "3min": return isAr ? study.summary3minAr : study.summary3minEn;
      case "full": return isAr ? study.fullAnalysisAr : study.fullAnalysisEn;
    }
  };

  const healthImplications = isAr ? study.healthImplicationsAr : study.healthImplicationsEn;
  const feelGreatConnection = isAr ? study.feelGreatConnectionAr : study.feelGreatConnection;
  const keyFindings = study.keyFindings as Array<{ findingEn: string; findingAr: string }>;
  const strengthsWeaknesses = study.strengthsWeaknesses as { strengths: string[]; weaknesses: string[] } | null;

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/"><span className="hover:text-foreground">{isAr ? "الرئيسية" : "Home"}</span></Link>
            <span>/</span>
            <Link href="/research"><span className="hover:text-foreground">{isAr ? "الأبحاث" : "Research"}</span></Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{title}</span>
          </nav>
        </div>
      </div>

      <article className="container max-w-4xl py-10">
        {/* Header */}
        <header className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={evidenceColor}>
              {isAr ? evidenceLabel.ar : evidenceLabel.en}
            </Badge>
            <Badge variant="outline">{study.studyType}</Badge>
            {study.isPreliminary && (
              <Badge variant="destructive" className="bg-amber-500">
                {isAr ? "⚠️ دراسة أولية - ليست مثبتة على البشر" : "⚠️ Preliminary - Not proven in humans"}
              </Badge>
            )}
            {!study.isHumanStudy && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {isAr ? "دراسة على الحيوانات/الخلايا" : "Animal/Cell Study"}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>

          {/* Hero Image */}
          {study.heroImageUrl && (
            <div className="rounded-xl overflow-hidden mb-6">
              <img src={study.heroImageUrl} alt={title} className="w-full aspect-[21/9] object-cover" />
            </div>
          )}

          {/* Study Metadata Table */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
              {isAr ? "بيانات الدراسة" : "Study Information"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{isAr ? "المجلة:" : "Journal:"}</span>
                <span className="font-medium ms-2">{study.journal}</span>
              </div>
              {study.university && (
                <div>
                  <span className="text-muted-foreground">{isAr ? "الجامعة:" : "University:"}</span>
                  <span className="font-medium ms-2">{study.university}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">{isAr ? "تاريخ النشر:" : "Published:"}</span>
                <span className="font-medium ms-2">
                  {new Date(study.publishDate).toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              {study.participantCount && (
                <div>
                  <span className="text-muted-foreground">{isAr ? "عدد المشاركين:" : "Participants:"}</span>
                  <span className="font-medium ms-2">{study.participantCount.toLocaleString()}</span>
                </div>
              )}
              {study.doi && (
                <div>
                  <span className="text-muted-foreground">DOI:</span>
                  <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noopener noreferrer" className="font-medium ms-2 text-primary hover:underline">
                    {study.doi}
                  </a>
                </div>
              )}
              {study.authors && (
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">{isAr ? "الباحثون:" : "Authors:"}</span>
                  <span className="font-medium ms-2">{study.authors}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <a
                href={study.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {isAr ? "اقرأ الدراسة الأصلية" : "Read Original Study"}
              </a>
            </div>
          </div>
        </header>

        {/* Reading Level Selector */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {isAr ? "اختر مستوى القراءة:" : "Choose Reading Level:"}
          </h2>
          <Tabs value={readingLevel} onValueChange={(v) => setReadingLevel(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="30s" className="text-xs md:text-sm">
                {isAr ? "30 ثانية" : "30 Seconds"}
              </TabsTrigger>
              <TabsTrigger value="1min" className="text-xs md:text-sm">
                {isAr ? "دقيقة" : "1 Minute"}
              </TabsTrigger>
              <TabsTrigger value="3min" className="text-xs md:text-sm">
                {isAr ? "3 دقائق" : "3 Minutes"}
              </TabsTrigger>
              <TabsTrigger value="full" className="text-xs md:text-sm">
                {isAr ? "التحليل الكامل" : "Full Analysis"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        {/* Summary Content */}
        <section className="mb-8 bg-card rounded-xl p-6 border border-border/50">
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
            <p className="text-foreground leading-relaxed whitespace-pre-line">{getSummaryContent()}</p>
          </div>
        </section>

        {/* Key Findings */}
        {keyFindings && keyFindings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isAr ? "أهم النتائج" : "Key Findings"}
            </h2>
            <div className="space-y-3">
              {keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/30">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-foreground">{isAr ? finding.findingAr : finding.findingEn}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Health Implications */}
        {healthImplications && (
          <section className="mb-8 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              {isAr ? "ماذا يعني هذا لصحتك؟" : "What Does This Mean for Your Health?"}
            </h2>
            <p className="text-foreground leading-relaxed whitespace-pre-line">{healthImplications}</p>
          </section>
        )}

        {/* Strengths & Weaknesses */}
        {strengthsWeaknesses && (
          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-5 border border-green-200/50 dark:border-green-800/30">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isAr ? "نقاط القوة" : "Strengths"}
              </h3>
              <ul className="space-y-2">
                {strengthsWeaknesses.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-5 border border-red-200/50 dark:border-red-800/30">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {isAr ? "نقاط الضعف / المحدوديات" : "Weaknesses / Limitations"}
              </h3>
              <ul className="space-y-2">
                {strengthsWeaknesses.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Feel Great Connection (subtle) */}
        {feelGreatConnection && (
          <section className="mb-8 bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-xl">🌿</span>
              {isAr ? "الصلة بنمط الحياة الصحي" : "Connection to Healthy Lifestyle"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{feelGreatConnection}</p>
          </section>
        )}

        {/* Preliminary Study Warning */}
        {study.isPreliminary && (
          <div className="mb-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  {isAr ? "تنبيه مهم حول هذه الدراسة" : "Important Note About This Study"}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {isAr
                    ? "هذه دراسة أولية (على الحيوانات أو الخلايا). النتائج لا تُعد إثباتاً على البشر ولا يمكن تعميمها. يجب انتظار تجارب سريرية على البشر لتأكيد هذه النتائج."
                    : "This is a preliminary study (animal or cell-based). Results are not proof in humans and cannot be generalized. Clinical human trials are needed to confirm these findings."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Original Study Link */}
        <section className="mb-8 text-center">
          <a
            href={study.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {isAr ? "اقرأ الدراسة الأصلية كاملة" : "Read Full Original Study"}
          </a>
        </section>

        {/* Disclaimer */}
        <footer className="border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            {isAr
              ? "⚕️ هذا المحتوى تعليمي بحت وليس بديلاً عن الاستشارة الطبية. لا نقدم أي ادعاءات علاجية. استشر طبيبك دائماً قبل اتخاذ أي قرار صحي."
              : "⚕️ This content is purely educational and not a substitute for medical advice. We make no therapeutic claims. Always consult your doctor before making health decisions."}
          </p>
          <div className="mt-4">
            <Link href="/research">
              <span className="text-primary hover:underline text-sm">
                ← {isAr ? "العودة لمركز الأبحاث" : "Back to Research Hub"}
              </span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
