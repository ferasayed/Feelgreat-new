import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function TodayInHealthScience() {
  const { lang } = useLanguage();

  const labels: Record<string, {
    home: string; research: string; pageTitle: string; heroTitle: string; heroSubtitle: string;
    autoUpdated: string; today: string; thisWeek: string; thisMonth: string; mostImpactful: string;
    noStudiesToday: string; noStudiesWeek: string; noStudiesMonth: string;
    evidenceGuide: string; high: string; moderate: string; low: string; preliminary: string;
    highDesc: string; moderateDesc: string; lowDesc: string; preliminaryDesc: string;
    disclaimer: string; preliminaryBadge: string;
  }> = {
    ar: {
      home: "الرئيسية", research: "الأبحاث", pageTitle: "اليوم في العلوم الصحية",
      heroTitle: "اليوم في العلوم الصحية",
      heroSubtitle: "أحدث الاكتشافات العلمية من أفضل الجامعات والمجلات الطبية العالمية، مُلخصة ومُبسطة لك يومياً.",
      autoUpdated: "يُحدّث تلقائياً", today: "اليوم", thisWeek: "هذا الأسبوع",
      thisMonth: "هذا الشهر", mostImpactful: "الأكثر تأثيراً",
      noStudiesToday: "لا توجد دراسات جديدة اليوم بعد. يتم الفحص مرتين يومياً.",
      noStudiesWeek: "لا توجد دراسات هذا الأسبوع بعد.",
      noStudiesMonth: "لا توجد دراسات هذا الشهر بعد.",
      evidenceGuide: "دليل مستويات الأدلة العلمية",
      high: "عالي", moderate: "متوسط", low: "منخفض", preliminary: "أولي",
      highDesc: "تحليل تلوي / مراجعة منهجية", moderateDesc: "تجربة عشوائية / دراسة أترابية",
      lowDesc: "دراسة مقطعية / حالة", preliminaryDesc: "حيوانات / خلايا / بيان صحفي",
      disclaimer: "⚠️ تنبيه: الدراسات المصنفة كـ \"أولية\" أُجريت على حيوانات أو خلايا فقط ولم تُثبت على البشر. لا ينبغي اعتبارها حقائق مثبتة.",
      preliminaryBadge: "أولية",
    },
    en: {
      home: "Home", research: "Research", pageTitle: "Today In Health Science",
      heroTitle: "Today In Health Science",
      heroSubtitle: "Latest scientific discoveries from top universities and medical journals worldwide, summarized and simplified for you daily.",
      autoUpdated: "Auto-Updated", today: "Today", thisWeek: "This Week",
      thisMonth: "This Month", mostImpactful: "Most Impactful",
      noStudiesToday: "No new studies today yet. Checked twice daily.",
      noStudiesWeek: "No studies this week yet.",
      noStudiesMonth: "No studies this month yet.",
      evidenceGuide: "Evidence Level Guide",
      high: "High", moderate: "Moderate", low: "Low", preliminary: "Preliminary",
      highDesc: "Meta-analysis / Systematic Review", moderateDesc: "RCT / Cohort Study",
      lowDesc: "Cross-sectional / Case Study", preliminaryDesc: "Animal / In-vitro / Press Release",
      disclaimer: "⚠️ Note: Studies marked as \"Preliminary\" were conducted on animals or cells only and have not been proven in humans. They should not be considered established facts.",
      preliminaryBadge: "Preliminary",
    },
    fr: {
      home: "Accueil", research: "Recherche", pageTitle: "Aujourd'hui en Sciences de la Santé",
      heroTitle: "Aujourd'hui en Sciences de la Santé",
      heroSubtitle: "Dernières découvertes scientifiques des meilleures universités et revues médicales mondiales, résumées quotidiennement.",
      autoUpdated: "Mise à jour auto", today: "Aujourd'hui", thisWeek: "Cette Semaine",
      thisMonth: "Ce Mois", mostImpactful: "Plus Impactant",
      noStudiesToday: "Pas de nouvelles études aujourd'hui. Vérification biquotidienne.",
      noStudiesWeek: "Pas d'études cette semaine.",
      noStudiesMonth: "Pas d'études ce mois-ci.",
      evidenceGuide: "Guide des Niveaux de Preuve",
      high: "Élevé", moderate: "Modéré", low: "Faible", preliminary: "Préliminaire",
      highDesc: "Méta-analyse / Revue systématique", moderateDesc: "ECR / Étude de cohorte",
      lowDesc: "Étude transversale / Cas", preliminaryDesc: "Animal / In-vitro / Communiqué",
      disclaimer: "⚠️ Note : Les études marquées \"Préliminaire\" ont été menées uniquement sur des animaux ou des cellules et n'ont pas été prouvées chez l'homme.",
      preliminaryBadge: "Préliminaire",
    },
    es: {
      home: "Inicio", research: "Investigación", pageTitle: "Hoy en Ciencias de la Salud",
      heroTitle: "Hoy en Ciencias de la Salud",
      heroSubtitle: "Últimos descubrimientos científicos de las mejores universidades y revistas médicas del mundo, resumidos diariamente.",
      autoUpdated: "Actualización auto", today: "Hoy", thisWeek: "Esta Semana",
      thisMonth: "Este Mes", mostImpactful: "Más Impactante",
      noStudiesToday: "No hay estudios nuevos hoy. Se verifica dos veces al día.",
      noStudiesWeek: "No hay estudios esta semana.",
      noStudiesMonth: "No hay estudios este mes.",
      evidenceGuide: "Guía de Niveles de Evidencia",
      high: "Alto", moderate: "Moderado", low: "Bajo", preliminary: "Preliminar",
      highDesc: "Metaanálisis / Revisión sistemática", moderateDesc: "ECA / Estudio de cohorte",
      lowDesc: "Estudio transversal / Caso", preliminaryDesc: "Animal / In-vitro / Comunicado",
      disclaimer: "⚠️ Nota: Los estudios marcados como \"Preliminar\" se realizaron solo en animales o células y no se han probado en humanos.",
      preliminaryBadge: "Preliminar",
    },
    de: {
      home: "Startseite", research: "Forschung", pageTitle: "Heute in der Gesundheitswissenschaft",
      heroTitle: "Heute in der Gesundheitswissenschaft",
      heroSubtitle: "Neueste wissenschaftliche Entdeckungen aus führenden Universitäten und medizinischen Fachzeitschriften, täglich zusammengefasst.",
      autoUpdated: "Auto-Aktualisiert", today: "Heute", thisWeek: "Diese Woche",
      thisMonth: "Diesen Monat", mostImpactful: "Am Wirkungsvollsten",
      noStudiesToday: "Heute noch keine neuen Studien. Zweimal täglich geprüft.",
      noStudiesWeek: "Diese Woche noch keine Studien.",
      noStudiesMonth: "Diesen Monat noch keine Studien.",
      evidenceGuide: "Leitfaden für Evidenzstufen",
      high: "Hoch", moderate: "Mittel", low: "Niedrig", preliminary: "Vorläufig",
      highDesc: "Metaanalyse / Systematische Übersicht", moderateDesc: "RCT / Kohortenstudie",
      lowDesc: "Querschnittsstudie / Fallstudie", preliminaryDesc: "Tier / In-vitro / Pressemitteilung",
      disclaimer: "⚠️ Hinweis: Als \"Vorläufig\" gekennzeichnete Studien wurden nur an Tieren oder Zellen durchgeführt und sind beim Menschen nicht bewiesen.",
      preliminaryBadge: "Vorläufig",
    },
    tr: {
      home: "Ana Sayfa", research: "Araştırma", pageTitle: "Bugün Sağlık Biliminde",
      heroTitle: "Bugün Sağlık Biliminde",
      heroSubtitle: "Dünyanın önde gelen üniversitelerinden ve tıp dergilerinden en son bilimsel keşifler, sizin için günlük olarak özetlendi.",
      autoUpdated: "Otomatik Güncelleme", today: "Bugün", thisWeek: "Bu Hafta",
      thisMonth: "Bu Ay", mostImpactful: "En Etkili",
      noStudiesToday: "Bugün henüz yeni çalışma yok. Günde iki kez kontrol edilir.",
      noStudiesWeek: "Bu hafta henüz çalışma yok.",
      noStudiesMonth: "Bu ay henüz çalışma yok.",
      evidenceGuide: "Kanıt Düzeyi Rehberi",
      high: "Yüksek", moderate: "Orta", low: "Düşük", preliminary: "Ön",
      highDesc: "Meta-analiz / Sistematik İnceleme", moderateDesc: "RKÇ / Kohort Çalışması",
      lowDesc: "Kesitsel / Vaka Çalışması", preliminaryDesc: "Hayvan / In-vitro / Basın Bülteni",
      disclaimer: "⚠️ Not: \"Ön\" olarak işaretlenen çalışmalar yalnızca hayvanlar veya hücreler üzerinde yapılmıştır ve insanlarda kanıtlanmamıştır.",
      preliminaryBadge: "Ön",
    },
  };
  const l = labels[lang] || labels.en;

  // Fetch all research studies
  const { data, isLoading } = trpc.research.list.useQuery({ limit: 50, offset: 0 });

  // Categorize studies
  const categorized = useMemo(() => {
    if (!data?.studies) return { today: [], thisWeek: [], thisMonth: [], mostImpactful: [] };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const studies = data.studies;

    return {
      today: studies.filter((s: any) => new Date(s.createdAt) >= oneDayAgo),
      thisWeek: studies.filter((s: any) => new Date(s.createdAt) >= oneWeekAgo),
      thisMonth: studies.filter((s: any) => new Date(s.createdAt) >= oneMonthAgo),
      mostImpactful: [...studies].sort((a: any, b: any) => (b.impactScore || 0) - (a.impactScore || 0)).slice(0, 10),
    };
  }, [data]);

  const getTitle = (study: any) => {
    const map: Record<string, string> = { ar: study.titleAr, en: study.titleEn, fr: study.titleFr, es: study.titleEs, de: study.titleDe, tr: study.titleTr };
    return map[lang] || study.titleEn || study.titleAr;
  };
  const getSummary = (study: any) => {
    const map: Record<string, string> = { ar: study.summary30sAr, en: study.summary30sEn, fr: study.summary30sFr, es: study.summary30sEs, de: study.summary30sDe, tr: study.summary30sTr };
    return map[lang] || study.summary30sEn || study.summary30sAr;
  };

  const evidenceLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "moderate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "low": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "preliminary": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const StudyCard = ({ study }: { study: any }) => (
    <Link href={`/research/${study.slug}`}>
      <Card className="h-full hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="text-xs">{study.journal || study.university}</Badge>
            <Badge className={`text-xs ${evidenceLevelColor(study.evidenceLevel)}`}>
              {study.evidenceLevel === "high" ? "🟢" : study.evidenceLevel === "moderate" ? "🔵" : study.evidenceLevel === "low" ? "🟡" : "🔴"} {study.evidenceLevel}
            </Badge>
            {study.isPreliminary && (
              <Badge variant="destructive" className="text-xs">
                {l.preliminaryBadge}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base line-clamp-2 mb-2">
            {getTitle(study)}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {getSummary(study)}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{study.studyType}</span>
            <span>{new Date(study.publishDate || study.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const StudyListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen bg-background ${lang === "ar" ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 py-16">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{l.home}</Link>
            <span className="mx-2">/</span>
            <Link href="/research" className="hover:text-primary">{l.research}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{l.pageTitle}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {l.autoUpdated}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {l.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground">
              {l.heroSubtitle}
            </p>
          </div>

          {/* Source Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["PubMed", "Nature", "JAMA", "The Lancet", "BMJ", "Science", "Cell", "Harvard", "Mayo Clinic", "Cleveland Clinic"].map(source => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl py-12">
        {isLoading ? (
          <StudyListSkeleton />
        ) : (
          <Tabs defaultValue="thisWeek" className="w-full">
            <TabsList className="mb-8 flex-wrap h-auto gap-1">
              <TabsTrigger value="today" className="text-sm">
                {l.today} ({categorized.today.length})
              </TabsTrigger>
              <TabsTrigger value="thisWeek" className="text-sm">
                {l.thisWeek} ({categorized.thisWeek.length})
              </TabsTrigger>
              <TabsTrigger value="thisMonth" className="text-sm">
                {l.thisMonth} ({categorized.thisMonth.length})
              </TabsTrigger>
              <TabsTrigger value="mostImpactful" className="text-sm">
                {l.mostImpactful} ({categorized.mostImpactful.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              {categorized.today.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{l.noStudiesToday}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorized.today.map((study: any) => <StudyCard key={study.slug} study={study} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="thisWeek">
              {categorized.thisWeek.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{l.noStudiesWeek}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorized.thisWeek.map((study: any) => <StudyCard key={study.slug} study={study} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="thisMonth">
              {categorized.thisMonth.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{l.noStudiesMonth}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorized.thisMonth.map((study: any) => <StudyCard key={study.slug} study={study} />)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mostImpactful">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorized.mostImpactful.map((study: any) => <StudyCard key={study.slug} study={study} />)}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Evidence Level Legend */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-lg">{l.evidenceGuide}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{l.high}</p>
                  <p className="text-xs text-muted-foreground">{l.highDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{l.moderate}</p>
                  <p className="text-xs text-muted-foreground">{l.moderateDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{l.low}</p>
                  <p className="text-xs text-muted-foreground">{l.lowDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{l.preliminary}</p>
                  <p className="text-xs text-muted-foreground">{l.preliminaryDesc}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {l.disclaimer}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
