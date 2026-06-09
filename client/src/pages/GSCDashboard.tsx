import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Search, TrendingUp, Eye, MousePointer, BarChart3, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function GSCDashboard() {
  const { user } = useAuth();
  const [days, setDays] = useState(28);
  const [inspectUrlInput, setInspectUrlInput] = useState("");

  useEffect(() => {
    document.title = "Google Search Console | Feel Great Admin";
  }, []);

  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = trpc.gsc.status.useQuery(undefined, {
    retry: false,
    enabled: user?.role === "admin",
  });

  const { data: topPages, isLoading: pagesLoading } = trpc.gsc.topPages.useQuery(
    { days },
    { retry: false, enabled: user?.role === "admin" }
  );

  const { data: topQueries, isLoading: queriesLoading } = trpc.gsc.topQueries.useQuery(
    { days },
    { retry: false, enabled: user?.role === "admin" }
  );

  const { data: inspectionResult, refetch: inspectRefetch } = trpc.gsc.inspectUrl.useQuery(
    { url: inspectUrlInput },
    { enabled: false, retry: false }
  );

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Admin access required</p>
      </div>
    );
  }

  const totalClicks = topPages?.data?.reduce((sum, p) => sum + p.clicks, 0) || 0;
  const totalImpressions = topPages?.data?.reduce((sum, p) => sum + p.impressions, 0) || 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
  const avgPosition = topPages?.data?.length
    ? (topPages.data.reduce((sum, p) => sum + p.position, 0) / topPages.data.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#c8a951]" />
            <div>
              <h1 className="text-2xl font-bold">Google Search Console</h1>
              <p className="text-gray-400 text-sm">مراقبة أداء الموقع في محركات البحث</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {status?.connection?.success ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" /> متصل
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <XCircle className="w-3 h-3 mr-1" /> غير متصل
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={() => refetchStatus()} className="border-gray-600 text-gray-300">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#1a2a44] border-gray-700 p-5">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">النقرات (آخر {days} يوم)</p>
                <p className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#1a2a44] border-gray-700 p-5">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">مرات الظهور</p>
                <p className="text-2xl font-bold text-white">{totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#1a2a44] border-gray-700 p-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">نسبة النقر (CTR)</p>
                <p className="text-2xl font-bold text-white">{avgCtr.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          <Card className="bg-[#1a2a44] border-gray-700 p-5">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-[#c8a951]" />
              <div>
                <p className="text-xs text-gray-400">متوسط الترتيب</p>
                <p className="text-2xl font-bold text-white">{avgPosition.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {[7, 14, 28, 90].map(d => (
            <Button
              key={d}
              size="sm"
              variant={days === d ? "default" : "outline"}
              onClick={() => setDays(d)}
              className={days === d ? "bg-[#c8a951] text-black" : "border-gray-600 text-gray-300"}
            >
              {d} يوم
            </Button>
          ))}
        </div>

        {/* Tabs: Pages / Queries / Sitemaps / URL Inspect */}
        <Tabs defaultValue="pages" className="space-y-4">
          <TabsList className="bg-[#1a2a44] border-gray-700">
            <TabsTrigger value="pages">أفضل الصفحات</TabsTrigger>
            <TabsTrigger value="queries">أهم الكلمات المفتاحية</TabsTrigger>
            <TabsTrigger value="sitemaps">خرائط الموقع</TabsTrigger>
            <TabsTrigger value="inspect">فحص URL</TabsTrigger>
          </TabsList>

          {/* Top Pages */}
          <TabsContent value="pages">
            <Card className="bg-[#1a2a44] border-gray-700 p-4">
              {pagesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 bg-gray-700" />)}
                </div>
              ) : topPages?.success && topPages.data?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">الصفحة</TableHead>
                      <TableHead className="text-gray-400 text-center">النقرات</TableHead>
                      <TableHead className="text-gray-400 text-center">الظهور</TableHead>
                      <TableHead className="text-gray-400 text-center">CTR</TableHead>
                      <TableHead className="text-gray-400 text-center">الترتيب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.data.map((row, idx) => (
                      <TableRow key={idx} className="border-gray-700/50">
                        <TableCell className="text-white text-xs max-w-[300px] truncate">
                          {row.keys[0]?.replace("https://feelgreat.us.com", "") || row.keys[0]}
                        </TableCell>
                        <TableCell className="text-center text-blue-400 font-medium">{row.clicks}</TableCell>
                        <TableCell className="text-center text-purple-400">{row.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-green-400">{(row.ctr * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-center text-[#c8a951]">{row.position.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {topPages?.error || "لا توجد بيانات متاحة. تأكد من ربط Google Search Console."}
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Top Queries */}
          <TabsContent value="queries">
            <Card className="bg-[#1a2a44] border-gray-700 p-4">
              {queriesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 bg-gray-700" />)}
                </div>
              ) : topQueries?.success && topQueries.data?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">الكلمة المفتاحية</TableHead>
                      <TableHead className="text-gray-400 text-center">النقرات</TableHead>
                      <TableHead className="text-gray-400 text-center">الظهور</TableHead>
                      <TableHead className="text-gray-400 text-center">CTR</TableHead>
                      <TableHead className="text-gray-400 text-center">الترتيب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topQueries.data.map((row, idx) => (
                      <TableRow key={idx} className="border-gray-700/50">
                        <TableCell className="text-white font-medium">{row.keys[0]}</TableCell>
                        <TableCell className="text-center text-blue-400 font-medium">{row.clicks}</TableCell>
                        <TableCell className="text-center text-purple-400">{row.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-green-400">{(row.ctr * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-center text-[#c8a951]">{row.position.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {topQueries?.error || "لا توجد بيانات متاحة."}
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Sitemaps */}
          <TabsContent value="sitemaps">
            <Card className="bg-[#1a2a44] border-gray-700 p-4">
              {statusLoading ? (
                <Skeleton className="h-20 bg-gray-700" />
              ) : status?.sitemaps && status.sitemaps.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">المسار</TableHead>
                      <TableHead className="text-gray-400 text-center">آخر إرسال</TableHead>
                      <TableHead className="text-gray-400 text-center">الحالة</TableHead>
                      <TableHead className="text-gray-400 text-center">أخطاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status.sitemaps.map((sm, idx) => (
                      <TableRow key={idx} className="border-gray-700/50">
                        <TableCell className="text-white text-xs">{sm.path}</TableCell>
                        <TableCell className="text-center text-gray-300 text-xs">
                          {sm.lastSubmitted ? new Date(sm.lastSubmitted).toLocaleDateString("ar") : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {sm.isPending ? (
                            <Badge className="bg-yellow-500/20 text-yellow-400">قيد المعالجة</Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400">مكتمل</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-red-400">{sm.errors || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-400 text-center py-8">لا توجد خرائط موقع مسجلة.</p>
              )}
            </Card>
          </TabsContent>

          {/* URL Inspection */}
          <TabsContent value="inspect">
            <Card className="bg-[#1a2a44] border-gray-700 p-4 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={inspectUrlInput}
                  onChange={(e) => setInspectUrlInput(e.target.value)}
                  placeholder="https://feelgreat.us.com/blog/..."
                  className="bg-[#0a1628] border-gray-600 text-white"
                />
                <Button
                  onClick={() => inspectRefetch()}
                  disabled={!inspectUrlInput}
                  className="bg-[#c8a951] text-black hover:bg-[#b89a41]"
                >
                  <Search className="w-4 h-4 mr-1" /> فحص
                </Button>
              </div>
              {inspectionResult && (
                <div className="bg-[#0a1628] rounded-lg p-4">
                  {inspectionResult.success ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">حالة الفهرسة:</span>
                        <Badge className={
                          inspectionResult.inspectionResult?.indexStatusResult?.indexingState === "INDEXING_ALLOWED"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }>
                          {inspectionResult.inspectionResult?.indexStatusResult?.indexingState || "غير معروف"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">التغطية:</span>
                        <span className="text-white">{inspectionResult.inspectionResult?.indexStatusResult?.coverageState || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">آخر زحف:</span>
                        <span className="text-white">
                          {inspectionResult.inspectionResult?.indexStatusResult?.lastCrawlTime
                            ? new Date(inspectionResult.inspectionResult.indexStatusResult.lastCrawlTime).toLocaleString("ar")
                            : "-"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-400">{inspectionResult.error}</p>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
