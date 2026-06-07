import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText, TrendingUp, Image, Share2, BarChart3,
  Eye, EyeOff, Copy, ExternalLink, Calendar, Target,
  Zap, Globe, BookOpen, Sparkles, Clock, Instagram, Send, Play, ImagePlus
} from "lucide-react";
import { toast } from "sonner";

const PILLARS = [
  { id: "sustainable-health", nameAr: "الصحة المستدامة", nameEn: "Sustainable Health" },
  { id: "insulin-resistance", nameAr: "مقاومة الأنسولين", nameEn: "Insulin Resistance" },
  { id: "diabetes", nameAr: "السكري", nameEn: "Diabetes" },
  { id: "gut-health", nameAr: "صحة الأمعاء", nameEn: "Gut Health" },
  { id: "fatty-liver", nameAr: "الكبد الدهني", nameEn: "Fatty Liver" },
  { id: "weight-management", nameAr: "إدارة الوزن", nameEn: "Weight Management" },
  { id: "behavioral-nutrition", nameAr: "التغذية السلوكية", nameEn: "Behavioral Nutrition" },
  { id: "intermittent-fasting", nameAr: "الصيام المتقطع", nameEn: "Intermittent Fasting" },
  { id: "sleep-energy", nameAr: "النوم والطاقة", nameEn: "Sleep & Energy" },
  { id: "womens-health", nameAr: "صحة المرأة", nameEn: "Women's Health" },
  { id: "chronic-inflammation", nameAr: "الالتهابات المزمنة", nameEn: "Chronic Inflammation" },
  { id: "heart-health", nameAr: "صحة القلب", nameEn: "Heart Health" },
  { id: "mental-nutrition", nameAr: "الصحة النفسية والتغذية", nameEn: "Mental Health & Nutrition" },
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("تم النسخ!");
}

function ArticleDetailDialog({ article }: { article: any }) {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <DialogContent className="max-w-4xl max-h-[85vh]">
      <DialogHeader>
        <DialogTitle className="text-lg">{article.titleEn}</DialogTitle>
        <p className="text-sm text-muted-foreground">{article.titleAr}</p>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">سوشيال</TabsTrigger>
          <TabsTrigger value="meta">بيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <ScrollArea className="h-[50vh]">
            <div className="space-y-4">
              {article.heroImageUrl && (
                <img src={article.heroImageUrl} alt="" className="w-full h-48 object-cover rounded-lg" />
              )}
              <div>
                <h4 className="font-semibold mb-2">English Content</h4>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.contentEn?.slice(0, 2000) + "..." }} />
              </div>
              <Separator />
              <div dir="rtl">
                <h4 className="font-semibold mb-2">المحتوى العربي</h4>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.contentAr?.slice(0, 2000) + "..." }} />
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Target Keyword</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-medium">{article.targetKeyword || "—"}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Vol: {article.keywordVolume || "?"}</Badge>
                    <Badge variant="outline">Diff: {article.keywordDifficulty || "?"}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Meta Title (EN)</CardTitle></CardHeader>
                <CardContent><p className="text-sm">{article.metaTitleEn || article.titleEn}</p></CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Meta Description (EN)</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{article.metaDescriptionEn || "—"}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">FAQ Schema</CardTitle></CardHeader>
              <CardContent>
                {article.faqSchema?.map((faq: any, i: number) => (
                  <div key={i} className="mb-2">
                    <p className="font-medium text-sm">Q: {faq.question}</p>
                    <p className="text-sm text-muted-foreground">A: {faq.answer?.slice(0, 100)}...</p>
                  </div>
                )) || <p className="text-sm text-muted-foreground">No FAQ schema</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <ScrollArea className="h-[50vh]">
            <div className="space-y-4">
              {[
                { label: "Facebook", icon: "📘", content: article.socialFacebook },
                { label: "LinkedIn", icon: "💼", content: article.socialLinkedin },
                { label: "Instagram Carousel", icon: "📸", content: article.socialInstagram },
                { label: "Reels Script (30s)", icon: "🎬", content: article.socialReelsScript },
                { label: "TikTok Script (30s)", icon: "🎵", content: article.socialTiktokScript },
              ].map((item) => (
                <Card key={item.label}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{item.icon} {item.label}</CardTitle>
                      {item.content && (
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.content)}>
                          <Copy className="h-3 w-3 mr-1" /> نسخ
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{item.content || "لم يتم التوليد بعد"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="meta" className="mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Slug:</span> <span className="font-mono">{article.slug}</span></div>
            <div><span className="text-muted-foreground">Status:</span> <Badge>{article.status || (article.isPublished ? "published" : "draft")}</Badge></div>
            <div><span className="text-muted-foreground">Pillar:</span> {article.pillarId || article.category}</div>
            <div><span className="text-muted-foreground">Word Count:</span> {article.wordCount || "?"}</div>
            <div><span className="text-muted-foreground">Read Time:</span> {article.readTimeMinutes} min</div>
            <div><span className="text-muted-foreground">Language:</span> {article.language || "both"}</div>
            <div><span className="text-muted-foreground">Created:</span> {new Date(article.createdAt).toLocaleDateString()}</div>
            <div><span className="text-muted-foreground">Published:</span> {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}</div>
            <div className="col-span-2"><span className="text-muted-foreground">Tags:</span> {(article.tags || []).join(", ")}</div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

function PublishToInstagramButton({ articleId }: { articleId: number }) {
  const prepareMutation = trpc.blog.prepareInstagramPost.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const result = await prepareMutation.mutateAsync({ articleId });
      // Copy the caption and show instructions
      await navigator.clipboard.writeText(result.caption);
      toast.success(
        `تم تجهيز منشور إنستغرام!\nالكابشن تم نسخه. الصورة: ${result.imageUrl}`,
        { duration: 8000 }
      );
    } catch (e: any) {
      toast.error(e.message || "فشل في تجهيز المنشور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-pink-500 hover:text-pink-600"
      onClick={handlePublish}
      disabled={isLoading}
      title="نشر على إنستغرام"
    >
      <Instagram className="h-3 w-3" />
    </Button>
  );
}

function BatchImageRegenButton() {
  const batchMutation = trpc.blog.batchRegenerateImages.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBatchRegen = async () => {
    setIsLoading(true);
    try {
      const result = await batchMutation.mutateAsync();
      toast.success(result.message || "تم بدء إعادة توليد الصور", { duration: 5000 });
    } catch (e: any) {
      toast.error("فشل في بدء إعادة توليد الصور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={handleBatchRegen}
      disabled={isLoading}
    >
      <ImagePlus className="h-3 w-3" />
      {isLoading ? "جاري التوليد..." : "توليد صور المحتوى"}
    </Button>
  );
}

function ManualTriggerButton() {
  const triggerMutation = trpc.schedule.triggerArticleGen.useMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handleTrigger = async () => {
    setIsLoading(true);
    try {
      const result = await triggerMutation.mutateAsync();
      toast.info(result.message || "تم إرسال طلب التوليد", { duration: 5000 });
    } catch (e: any) {
      toast.error("فشل في تشغيل التوليد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      onClick={handleTrigger}
      disabled={isLoading}
    >
      <Play className="h-3 w-3" />
      {isLoading ? "جاري التوليد..." : "توليد مقال الآن"}
    </Button>
  );
}

export default function ContentEngine() {
  useEffect(() => {
    document.title = "Content Engine | Feel Great";
  }, []);

  const { data: articles, isLoading } = trpc.blog.adminList.useQuery({ limit: 100 });
  const { data: stats } = trpc.blog.stats.useQuery();
  const { data: scheduleJobs } = trpc.schedule.list.useQuery();
  const updateMutation = trpc.blog.adminUpdate.useMutation();
  const utils = trpc.useUtils();

  const togglePublish = async (id: number, currentState: boolean) => {
    await updateMutation.mutateAsync({ id, isPublished: !currentState });
    utils.blog.adminList.invalidate();
  };

  const articleList = articles || [];
  const publishedCount = articleList.filter((a: any) => a.isPublished).length;
  const draftCount = articleList.filter((a: any) => !a.isPublished).length;
  const withImages = articleList.filter((a: any) => a.heroImageUrl).length;
  const withSocial = articleList.filter((a: any) => a.socialFacebook).length;
  const totalWords = articleList.reduce((sum: number, a: any) => sum + (a.wordCount || 0), 0);

  // Cluster breakdown
  const clusterCounts: Record<string, number> = {};
  articleList.forEach((a: any) => {
    const cluster = a.clusterId || a.category || "other";
    clusterCounts[cluster] = (clusterCounts[cluster] || 0) + 1;
  });

  // Cron jobs info
  const articleJobs = (scheduleJobs as any)?.jobs?.filter((j: any) => j.name?.includes("article-gen")) || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            محرك المحتوى الذكي
          </h1>
          <p className="text-muted-foreground mt-1">نظام توليد ونشر المقالات الصحية الأوتوماتيكي</p>
        </div>
        <div className="flex items-center gap-2">
          <BatchImageRegenButton />
          <ManualTriggerButton />
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {articleJobs.length} وظائف مجدولة
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">إجمالي المقالات</span>
            </div>
            <p className="text-2xl font-bold mt-1">{articleList.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">منشور</span>
            </div>
            <p className="text-2xl font-bold mt-1">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">مسودة</span>
            </div>
            <p className="text-2xl font-bold mt-1">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">مع صور</span>
            </div>
            <p className="text-2xl font-bold mt-1">{withImages}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-muted-foreground">محتوى سوشيال</span>
            </div>
            <p className="text-2xl font-bold mt-1">{withSocial}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-500" />
              <span className="text-sm text-muted-foreground">إجمالي الكلمات</span>
            </div>
            <p className="text-2xl font-bold mt-1">{(totalWords / 1000).toFixed(0)}k</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Pillars Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            المحاور الصحية (13 محور)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{pillar.nameAr}</p>
                  <p className="text-xs text-muted-foreground">{pillar.nameEn}</p>
                </div>
                <Badge variant="secondary">{clusterCounts[pillar.id] || 0}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Jobs */}
      {articleJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              الجدولة التلقائية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {articleJobs.map((job: any) => (
                <div key={job.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{job.name}</p>
                    <p className="text-xs text-muted-foreground">{job.description || job.cron}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">نشط</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            جميع المقالات ({articleList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">العنوان</th>
                  <th className="text-center p-2">المحور</th>
                  <th className="text-center p-2">الكلمة المفتاحية</th>
                  <th className="text-center p-2">كلمات</th>
                  <th className="text-center p-2">صورة</th>
                  <th className="text-center p-2">سوشيال</th>
                  <th className="text-center p-2">الحالة</th>
                  <th className="text-center p-2">التاريخ</th>
                  <th className="text-center p-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {articleList.map((article: any) => (
                  <tr key={article.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 max-w-[200px]">
                      <p className="font-medium truncate text-xs">{article.titleAr}</p>
                      <p className="text-xs text-muted-foreground truncate">{article.titleEn}</p>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-xs">
                        {PILLARS.find(p => p.id === (article.clusterId || article.category))?.nameAr || article.category}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      <span className="text-xs">{article.targetKeyword || "—"}</span>
                    </td>
                    <td className="text-center p-2 text-xs">{article.wordCount || "?"}</td>
                    <td className="text-center p-2">
                      {article.heroImageUrl ? <span className="text-green-500">✓</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="text-center p-2">
                      {article.socialFacebook ? <span className="text-green-500">✓</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="text-center p-2">
                      <Badge variant={article.isPublished ? "default" : "secondary"} className="text-xs">
                        {article.isPublished ? "منشور" : "مسودة"}
                      </Badge>
                    </td>
                    <td className="text-center p-2 text-xs">
                      {new Date(article.createdAt).toLocaleDateString("ar")}
                    </td>
                    <td className="text-center p-2">
                      <div className="flex items-center gap-1 justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <ArticleDetailDialog article={article} />
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => togglePublish(article.id, article.isPublished)}
                        >
                          {article.isPublished ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                        {article.heroImageUrl && article.socialInstagram && (
                          <PublishToInstagramButton articleId={article.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
