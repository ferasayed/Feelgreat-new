import { useEffect } from "react";
import { Link } from "wouter";
import { TrendingUp, Target, BarChart3, ArrowUpRight } from "lucide-react";

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  opportunity: "High" | "Medium" | "Low";
  priorityScore: number;
  targetPage: string;
  notes: string;
}

const keywords: KeywordData[] = [
  { keyword: "how to reverse prediabetes naturally", searchVolume: 12100, difficulty: 28, intent: "Informational", opportunity: "High", priorityScore: 95, targetPage: "/topics/prediabetes", notes: "Low competition, high intent. Perfect for pillar page targeting." },
  { keyword: "insulin resistance diet plan", searchVolume: 18100, difficulty: 35, intent: "Informational", opportunity: "High", priorityScore: 92, targetPage: "/topics/insulin-resistance", notes: "High volume, moderate difficulty. Pillar page + supporting articles." },
  { keyword: "weight loss after 40 women", searchVolume: 14800, difficulty: 32, intent: "Informational", opportunity: "High", priorityScore: 90, targetPage: "/topics/weight-loss-after-40", notes: "Exact target demographic. High conversion potential." },
  { keyword: "intermittent fasting for beginners over 40", searchVolume: 9900, difficulty: 25, intent: "Informational", opportunity: "High", priorityScore: 89, targetPage: "/blog", notes: "Low difficulty, growing trend. Article cluster opportunity." },
  { keyword: "gut health supplements that actually work", searchVolume: 8100, difficulty: 30, intent: "Commercial", opportunity: "High", priorityScore: 87, targetPage: "/topics/gut-health", notes: "Commercial intent = high conversion. Product-aware audience." },
  { keyword: "sustainable weight loss without dieting", searchVolume: 6600, difficulty: 22, intent: "Informational", opportunity: "High", priorityScore: 86, targetPage: "/topics/sustainable-health", notes: "Very low competition. Aligns perfectly with brand messaging." },
  { keyword: "metabolic health test at home", searchVolume: 5400, difficulty: 20, intent: "Commercial", opportunity: "High", priorityScore: 85, targetPage: "/health-assessment", notes: "Direct funnel entry point. Assessment page captures this traffic." },
  { keyword: "fiber supplement for blood sugar", searchVolume: 7200, difficulty: 27, intent: "Commercial", opportunity: "High", priorityScore: 84, targetPage: "/topics/insulin-resistance", notes: "Product-aware keyword. High purchase intent." },
  { keyword: "behavioral nutrition coaching", searchVolume: 3600, difficulty: 15, intent: "Commercial", opportunity: "High", priorityScore: 83, targetPage: "/topics/behavioral-nutrition", notes: "Very low competition. Unique positioning opportunity." },
  { keyword: "energy levels after 40", searchVolume: 8800, difficulty: 28, intent: "Informational", opportunity: "High", priorityScore: 82, targetPage: "/topics/energy-fatigue", notes: "High volume, relatable problem. Strong content opportunity." },
  { keyword: "prediabetes symptoms women", searchVolume: 11000, difficulty: 38, intent: "Informational", opportunity: "Medium", priorityScore: 78, targetPage: "/topics/prediabetes", notes: "Higher difficulty but very high volume. Long-term target." },
  { keyword: "healthy aging tips for women over 50", searchVolume: 6200, difficulty: 30, intent: "Informational", opportunity: "Medium", priorityScore: 76, targetPage: "/topics/healthy-aging", notes: "Good alignment with target audience. Moderate competition." },
  { keyword: "how to improve insulin sensitivity naturally", searchVolume: 9100, difficulty: 33, intent: "Informational", opportunity: "Medium", priorityScore: 75, targetPage: "/topics/insulin-resistance", notes: "Strong volume. Requires comprehensive content to rank." },
  { keyword: "yerba mate health benefits", searchVolume: 22000, difficulty: 45, intent: "Informational", opportunity: "Medium", priorityScore: 72, targetPage: "/blog", notes: "Very high volume but competitive. Article series opportunity." },
  { keyword: "4-4-12 intermittent fasting", searchVolume: 4400, difficulty: 18, intent: "Informational", opportunity: "High", priorityScore: 71, targetPage: "/topics/sustainable-health", notes: "Brand-specific term. Easy to own this SERP." },
  { keyword: "menopause weight gain solutions", searchVolume: 7800, difficulty: 35, intent: "Commercial", opportunity: "Medium", priorityScore: 70, targetPage: "/topics/weight-loss-after-40", notes: "Target audience pain point. Moderate difficulty." },
  { keyword: "gut microbiome and weight loss", searchVolume: 5500, difficulty: 32, intent: "Informational", opportunity: "Medium", priorityScore: 68, targetPage: "/topics/gut-health", notes: "Cross-topic opportunity linking gut health and weight loss." },
  { keyword: "nutrition coach online", searchVolume: 12000, difficulty: 48, intent: "Transactional", opportunity: "Low", priorityScore: 65, targetPage: "/about", notes: "High competition but high value. Long-term authority play." },
  { keyword: "best supplements for metabolic health", searchVolume: 4800, difficulty: 35, intent: "Commercial", opportunity: "Medium", priorityScore: 63, targetPage: "/topics/metabolic-health", notes: "Product-aware audience. Moderate competition." },
  { keyword: "feel great unicity reviews", searchVolume: 2900, difficulty: 12, intent: "Navigational", opportunity: "High", priorityScore: 60, targetPage: "/", notes: "Brand term. Must own this SERP. Easy win." },
];

export default function KeywordReport() {
  useEffect(() => {
    document.title = "SEO Keyword Priority Report | Feel Great";
  }, []);

  const getDifficultyColor = (d: number) => {
    if (d <= 20) return "text-green-400 bg-green-400/10";
    if (d <= 35) return "text-amber-400 bg-amber-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getOpportunityColor = (o: string) => {
    if (o === "High") return "text-green-400 bg-green-400/10";
    if (o === "Medium") return "text-amber-400 bg-amber-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getIntentColor = (i: string) => {
    if (i === "Informational") return "text-blue-400 bg-blue-400/10";
    if (i === "Commercial") return "text-purple-400 bg-purple-400/10";
    if (i === "Transactional") return "text-green-400 bg-green-400/10";
    return "text-slate-400 bg-slate-400/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-6 inline-block">Feel Great</Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">SEO Keyword Priority Report</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Top 20 keywords ranked by ROI potential for fastest organic traffic growth in 90 days. Targeting US, UK, Germany, Netherlands, and Sweden markets.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
            <BarChart3 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">178K+</div>
            <div className="text-sm text-slate-400">Total Monthly Volume</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-slate-400">High Opportunity</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-slate-400">Avg. Difficulty</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-center">
            <ArrowUpRight className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">79</div>
            <div className="text-sm text-slate-400">Avg. Priority Score</div>
          </div>
        </div>

        {/* Keyword Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/80">
                  <th className="text-left p-4 font-semibold text-slate-300">#</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Keyword</th>
                  <th className="text-right p-4 font-semibold text-slate-300">Volume</th>
                  <th className="text-center p-4 font-semibold text-slate-300">Difficulty</th>
                  <th className="text-center p-4 font-semibold text-slate-300">Intent</th>
                  <th className="text-center p-4 font-semibold text-slate-300">Opportunity</th>
                  <th className="text-center p-4 font-semibold text-slate-300">Priority</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Target Page</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">{i + 1}</td>
                    <td className="p-4">
                      <div className="font-medium text-white">{kw.keyword}</div>
                      <div className="text-xs text-slate-500 mt-1 max-w-xs">{kw.notes}</div>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-300">{kw.searchVolume.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(kw.difficulty)}`}>
                        {kw.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getIntentColor(kw.intent)}`}>
                        {kw.intent}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getOpportunityColor(kw.opportunity)}`}>
                        {kw.opportunity}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-amber-400/10 text-amber-400 rounded font-bold text-sm">
                        {kw.priorityScore}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={kw.targetPage} className="text-blue-400 hover:text-blue-300 text-xs">
                        {kw.targetPage}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy Notes */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-amber-400">90-Day Quick Wins (Priority 80+)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Target keywords with difficulty &lt; 30 first for fastest rankings</li>
              <li>• Create supporting blog articles for each pillar page keyword</li>
              <li>• Build internal links from blog articles to pillar pages</li>
              <li>• Focus on "how to reverse prediabetes naturally" as #1 priority</li>
              <li>• Own brand terms ("feel great unicity reviews") immediately</li>
              <li>• Publish 3 articles/day targeting long-tail variations</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-blue-400">Long-Term Authority (Priority 60-79)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Build topical authority through comprehensive content clusters</li>
              <li>• Target higher-difficulty keywords after establishing domain authority</li>
              <li>• Create comparison and review content for commercial keywords</li>
              <li>• Build backlinks through guest posting and health partnerships</li>
              <li>• Expand into adjacent topics (menopause, PCOS, thyroid)</li>
              <li>• Monitor rankings weekly and adjust content strategy</li>
            </ul>
          </div>
        </div>

        {/* Market Focus */}
        <div className="mt-10 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Target Market Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { country: "USA", share: "55%", focus: "Prediabetes, Weight Loss" },
              { country: "UK", share: "20%", focus: "Metabolic Health, Aging" },
              { country: "Germany", share: "10%", focus: "Gut Health, Nutrition" },
              { country: "Netherlands", share: "8%", focus: "Sustainable Health" },
              { country: "Sweden", share: "7%", focus: "Healthy Aging, Energy" },
            ].map((m, i) => (
              <div key={i} className="text-center p-3 bg-slate-700/30 rounded-lg">
                <div className="font-bold text-amber-400">{m.country}</div>
                <div className="text-xl font-bold">{m.share}</div>
                <div className="text-xs text-slate-500">{m.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel Roadmap */}
        <div className="mt-10 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 text-green-400">Conversion Funnel Keyword Roadmap</h3>
          <p className="text-sm text-slate-400 mb-6">Keywords mapped to conversion goals: Consultation Booking, Assessment Completion, WhatsApp Contact, and Partner Application.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-bold text-green-400 text-sm mb-2">Consultation Booking</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• nutrition coach online</li>
                <li>• behavioral nutrition coaching</li>
                <li>• metabolic health test at home</li>
                <li>• insulin resistance diet plan</li>
              </ul>
              <p className="text-xs text-green-400 mt-2 font-medium">Target: /health-assessment → WhatsApp</p>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-bold text-blue-400 text-sm mb-2">Assessment Completion</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• how to reverse prediabetes naturally</li>
                <li>• prediabetes symptoms women</li>
                <li>• energy levels after 40</li>
                <li>• gut health supplements</li>
              </ul>
              <p className="text-xs text-blue-400 mt-2 font-medium">Target: /assessments → Lead Capture</p>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-bold text-purple-400 text-sm mb-2">WhatsApp Contact</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• weight loss after 40 women</li>
                <li>• menopause weight gain solutions</li>
                <li>• sustainable weight loss</li>
                <li>• fiber supplement for blood sugar</li>
              </ul>
              <p className="text-xs text-purple-400 mt-2 font-medium">Target: Blog CTA → WhatsApp</p>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-bold text-amber-400 text-sm mb-2">Partner Application</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• feel great unicity reviews</li>
                <li>• health entrepreneurship</li>
                <li>• wellness business opportunity</li>
                <li>• health coaching career</li>
              </ul>
              <p className="text-xs text-amber-400 mt-2 font-medium">Target: /partner-with-feras → Apply</p>
            </div>
          </div>
        </div>

        {/* Keyword Segments */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
            <h3 className="font-bold text-green-400 mb-3">Low Competition (KD ≤ 25)</h3>
            <p className="text-xs text-slate-400 mb-3">Quick wins — rank within 30-60 days</p>
            <ul className="text-sm text-slate-300 space-y-2">
              {keywords.filter(k => k.difficulty <= 25).map((k, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate mr-2">{k.keyword}</span>
                  <span className="text-green-400 font-mono text-xs">{k.difficulty}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
            <h3 className="font-bold text-amber-400 mb-3">Medium Competition (KD 26-40)</h3>
            <p className="text-xs text-slate-400 mb-3">Achievable — rank within 60-90 days</p>
            <ul className="text-sm text-slate-300 space-y-2">
              {keywords.filter(k => k.difficulty > 25 && k.difficulty <= 40).map((k, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate mr-2">{k.keyword}</span>
                  <span className="text-amber-400 font-mono text-xs">{k.difficulty}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h3 className="font-bold text-red-400 mb-3">High Competition (KD 40+)</h3>
            <p className="text-xs text-slate-400 mb-3">Long-term — 90+ days with authority building</p>
            <ul className="text-sm text-slate-300 space-y-2">
              {keywords.filter(k => k.difficulty > 40).map((k, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate mr-2">{k.keyword}</span>
                  <span className="text-red-400 font-mono text-xs">{k.difficulty}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-slate-500 text-sm">
          <p>Report generated for feelgreat.us.com | Target: Women 35-60 | Markets: US, UK, DE, NL, SE</p>
          <p className="mt-1">Data sources: Estimated search volumes based on market research and keyword analysis tools</p>
        </div>
      </div>
    </div>
  );
}
