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
  const isAr = lang === "ar";

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
                {isAr ? "أولية" : "Preliminary"}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base line-clamp-2 mb-2">
            {isAr ? study.titleAr : study.titleEn}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {isAr ? study.summary30sAr : study.summary30sEn}
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
    <div className={`min-h-screen bg-background ${isAr ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 py-16">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">{isAr ? "الرئيسية" : "Home"}</Link>
            <span className="mx-2">/</span>
            <Link href="/research" className="hover:text-primary">{isAr ? "الأبحاث" : "Research"}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{isAr ? "اليوم في العلوم الصحية" : "Today In Health Science"}</span>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {isAr ? "يُحدّث تلقائياً" : "Auto-Updated"}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {isAr ? "اليوم في العلوم الصحية" : "Today In Health Science"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isAr 
                ? "أحدث الاكتشافات العلمية من أفضل الجامعات والمجلات الطبية العالمية، مُلخصة ومُبسطة لك يومياً."
                : "Latest scientific discoveries from top universities and medical journals worldwide, summarized and simplified for you daily."}
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
                {isAr ? "اليوم" : "Today"} ({categorized.today.length})
              </TabsTrigger>
              <TabsTrigger value="thisWeek" className="text-sm">
                {isAr ? "هذا الأسبوع" : "This Week"} ({categorized.thisWeek.length})
              </TabsTrigger>
              <TabsTrigger value="thisMonth" className="text-sm">
                {isAr ? "هذا الشهر" : "This Month"} ({categorized.thisMonth.length})
              </TabsTrigger>
              <TabsTrigger value="mostImpactful" className="text-sm">
                {isAr ? "الأكثر تأثيراً" : "Most Impactful"} ({categorized.mostImpactful.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              {categorized.today.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {isAr ? "لا توجد دراسات جديدة اليوم بعد. يتم الفحص مرتين يومياً." : "No new studies today yet. Checked twice daily."}
                    </p>
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
                    <p className="text-muted-foreground">
                      {isAr ? "لا توجد دراسات هذا الأسبوع بعد." : "No studies this week yet."}
                    </p>
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
                    <p className="text-muted-foreground">
                      {isAr ? "لا توجد دراسات هذا الشهر بعد." : "No studies this month yet."}
                    </p>
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
            <CardTitle className="text-lg">{isAr ? "دليل مستويات الأدلة العلمية" : "Evidence Level Guide"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{isAr ? "عالي" : "High"}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? "تحليل تلوي / مراجعة منهجية" : "Meta-analysis / Systematic Review"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{isAr ? "متوسط" : "Moderate"}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? "تجربة عشوائية / دراسة أترابية" : "RCT / Cohort Study"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{isAr ? "منخفض" : "Low"}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? "دراسة مقطعية / حالة" : "Cross-sectional / Case Study"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-sm">{isAr ? "أولي" : "Preliminary"}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? "حيوانات / خلايا / بيان صحفي" : "Animal / In-vitro / Press Release"}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {isAr 
                  ? "⚠️ تنبيه: الدراسات المصنفة كـ \"أولية\" أُجريت على حيوانات أو خلايا فقط ولم تُثبت على البشر. لا ينبغي اعتبارها حقائق مثبتة."
                  : "⚠️ Note: Studies marked as \"Preliminary\" were conducted on animals or cells only and have not been proven in humans. They should not be considered established facts."}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
