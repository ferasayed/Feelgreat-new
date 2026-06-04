import { useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BarChart3, FileText, Globe, TrendingUp, Users, MessageCircle, ArrowUpRight, Calendar, Target, Zap } from "lucide-react";

export default function GrowthDashboard() {
  useEffect(() => {
    document.title = "Growth Dashboard | Feel Great";
  }, []);

  // Fetch article stats from the blog procedure
  const { data: articles } = trpc.blog.list.useQuery({ limit: 1000 });

  const totalArticles = articles?.articles?.length ?? 0;
  const publishedArticles = articles?.articles?.filter((a: any) => a.status === "published")?.length ?? 0;

  // Category breakdown
  const categories: Record<string, number> = {};
  articles?.articles?.forEach((a: any) => {
    const cat = a.category || "Uncategorized";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // Language breakdown
  const languages: Record<string, number> = {};
  articles?.articles?.forEach((a: any) => {
    const lang = a.language || "en";
    languages[lang] = (languages[lang] || 0) + 1;
  });

  // Recent articles (last 7)
  const recentArticles = articles?.articles?.slice(0, 7) ?? [];

  // Pages on site (static count)
  const sitePages = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About / Credentials" },
    { path: "/partner", name: "Partner" },
    { path: "/founder", name: "Founder" },
    { path: "/blog", name: "Blog" },
    { path: "/faq", name: "FAQ" },
    { path: "/topics", name: "Topics Hub" },
    { path: "/health", name: "Health Conditions" },
    { path: "/health-assessment", name: "Health Assessment Funnel" },
    { path: "/business-opportunity", name: "Business Opportunity Funnel" },
    { path: "/keywords", name: "Keyword Report" },
  ];

  const pillarPages = [
    "Sustainable Health", "Insulin Resistance", "Prediabetes",
    "Weight Loss After 40", "Metabolic Health", "Gut Health",
    "Healthy Aging", "Energy & Fatigue", "Behavioral Nutrition"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/" className="text-amber-400 font-bold text-xl mb-2 inline-block">Feel Great</Link>
            <h1 className="text-3xl font-bold">Growth Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Content & SEO performance tracking for feelgreat.us.com</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>Target: US, UK, DE, NL, SE</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          <MetricCard icon={FileText} label="Total Articles" value={totalArticles.toString()} color="text-blue-400" />
          <MetricCard icon={Globe} label="Published" value={publishedArticles.toString()} color="text-green-400" />
          <MetricCard icon={Target} label="Pillar Pages" value="9" color="text-purple-400" />
          <MetricCard icon={BarChart3} label="Site Pages" value={(sitePages.length + pillarPages.length + totalArticles).toString()} color="text-amber-400" />
          <MetricCard icon={TrendingUp} label="Keywords Tracked" value="20" color="text-cyan-400" />
          <MetricCard icon={Zap} label="Articles/Day" value="3" color="text-red-400" />
        </div>

        {/* Content Performance Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Category Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" /> Content by Category
            </h3>
            {Object.keys(categories).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 truncate">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / totalArticles) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No articles generated yet. Content engine produces 3 articles daily.</p>
            )}
          </div>

          {/* Language Distribution */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" /> Content by Language
            </h3>
            {Object.keys(languages).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang, count]) => {
                  const langNames: Record<string, string> = { en: "English", ar: "Arabic", de: "German", fr: "French", es: "Spanish", tr: "Turkish", nl: "Dutch", sv: "Swedish" };
                  return (
                    <div key={lang} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{langNames[lang] || lang}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(count / totalArticles) * 100}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Articles will be generated in English (primary) with Arabic support.</p>
            )}
          </div>

          {/* Pillar Pages Status */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Authority Pillar Pages
            </h3>
            <div className="space-y-2">
              {pillarPages.map((page) => (
                <div key={page} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-slate-300">{page}</span>
                  <span className="text-xs text-green-400 ml-auto">3000+ words</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-10">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" /> Recent Articles
          </h3>
          {recentArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Title</th>
                    <th className="text-left p-3 text-slate-400">Category</th>
                    <th className="text-left p-3 text-slate-400">Language</th>
                    <th className="text-right p-3 text-slate-400">Words</th>
                    <th className="text-left p-3 text-slate-400">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((article: any) => (
                    <tr key={article.id} className="border-b border-slate-700/50">
                      <td className="p-3">
                        <Link href={`/blog/${article.slug}`} className="text-blue-400 hover:text-blue-300">
                          {article.title?.substring(0, 50)}...
                        </Link>
                      </td>
                      <td className="p-3 text-slate-400">{article.category}</td>
                      <td className="p-3 text-slate-400">{article.language}</td>
                      <td className="p-3 text-right text-slate-400">{article.wordCount}</td>
                      <td className="p-3 text-slate-500 text-xs">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Draft"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No articles generated yet.</p>
              <p className="text-slate-600 text-sm mt-1">The content engine generates 3 articles daily at 6:00, 12:00, and 18:00 UTC.</p>
            </div>
          )}
        </div>

        {/* Site Structure */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" /> Site Pages
            </h3>
            <div className="space-y-2">
              {sitePages.map((page) => (
                <div key={page.path} className="flex items-center justify-between text-sm">
                  <Link href={page.path} className="text-blue-400 hover:text-blue-300">{page.name}</Link>
                  <span className="text-slate-500 font-mono text-xs">{page.path}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" /> SEO Checklist
            </h3>
            <div className="space-y-2">
              {[
                { item: "Dynamic meta titles on all pages", done: true },
                { item: "Meta descriptions on all pages", done: true },
                { item: "Canonical URLs (dynamic per page)", done: true },
                { item: "JSON-LD Schema (Organization, WebSite, FAQ, Article)", done: true },
                { item: "Sitemap.xml with absolute URLs", done: true },
                { item: "Robots.txt optimized", done: true },
                { item: "Internal cross-links on all pages", done: true },
                { item: "9 Authority pillar pages (3000+ words)", done: true },
                { item: "Automated content engine (3/day)", done: true },
                { item: "Conversion funnels (Health + Business)", done: true },
                { item: "Keyword priority report (20 keywords)", done: true },
                { item: "Core Web Vitals optimization", done: false },
                { item: "Backlink building campaign", done: false },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${check.done ? "bg-green-400/20 border-green-400" : "border-slate-600"}`}>
                    {check.done && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <span className={check.done ? "text-slate-300" : "text-slate-500"}>{check.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Targets */}
        <div className="bg-gradient-to-r from-amber-400/5 to-amber-500/5 border border-amber-400/20 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-amber-400" /> Weekly Growth Targets
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">Content Production</p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• 21 new articles per week (3/day)</li>
                <li>• Target: 630 articles in 90 days</li>
                <li>• Mix: 70% informational, 30% commercial</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Traffic Goals (90-day)</p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• Month 1: 500-1,000 organic visits</li>
                <li>• Month 2: 2,000-5,000 organic visits</li>
                <li>• Month 3: 5,000-15,000 organic visits</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Conversion Goals</p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• 5-10 health assessments/week</li>
                <li>• 2-5 WhatsApp conversations/week</li>
                <li>• 1-3 consultation bookings/week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
