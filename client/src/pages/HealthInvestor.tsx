import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Heart, Brain, Shield, Zap, DollarSign, Clock, Activity, BarChart3, Target, CheckCircle, Star } from "lucide-react";

export default function HealthInvestor() {
  useEffect(() => {
    document.title = "Health Investor | Invest In Your Health Today, Build Your Impact Tomorrow | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Become a Health Investor. The most profitable investment you'll ever make is in your own health. Discover how investing in metabolic health creates compound returns in energy, productivity, longevity, and quality of life.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-green-400/5" />
        <div className="container max-w-5xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <div className="text-center mb-6">
            <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
                A New Paradigm in Health
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Become a <span className="text-amber-400">Health Investor</span>
              </h1>
              <p className="text-xl text-slate-300 mb-4 leading-relaxed">
                The most profitable investment you'll ever make isn't in stocks, real estate, or crypto. It's in your own health.
              </p>
              <p className="text-lg text-slate-400 mb-8">
                Health Investing is the philosophy that every dollar, minute, and decision you put into your metabolic health generates compound returns in energy, productivity, longevity, relationships, and quality of life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/assessments" className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-2">
                  Calculate Your Health ROI <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 transition-colors">
                  Meet Feras Alayed
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/manus-storage/feras-portrait-2_61f1860f.jpg"
                alt="Feras Alayed - Health Investor Philosophy"
                className="rounded-2xl shadow-2xl max-h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">The Cost of NOT Investing in Health</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
          Most people treat health as an expense. Smart people treat it as an investment with measurable returns.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-6">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 rotate-180" /> The Cost of Neglect
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> Average American spends $12,500/year on healthcare (reactive)</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> Chronic disease costs the US $4.1 trillion annually</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> Lost productivity from poor health: $530 billion/year</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> Type 2 diabetes lifetime cost: $283,000 per person</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> 88% of Americans have suboptimal metabolic health</li>
            </ul>
          </div>
          <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-6">
            <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> The Return on Health Investment
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-400">•</span> Every $1 in prevention saves $5.60 in treatment costs</li>
              <li className="flex items-start gap-2"><span className="text-green-400">•</span> Healthy employees are 3x more productive</li>
              <li className="flex items-start gap-2"><span className="text-green-400">•</span> Optimal metabolic health adds 10-15 quality years of life</li>
              <li className="flex items-start gap-2"><span className="text-green-400">•</span> Better sleep = 29% increase in cognitive performance</li>
              <li className="flex items-start gap-2"><span className="text-green-400">•</span> Reduced insulin resistance = sustained energy all day</li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Health Investor Framework */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">The Health Investor Framework</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          Like financial investing, health investing follows principles of compound growth, diversification, and long-term thinking.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: TrendingUp, title: "Compound Health Returns", desc: "Small daily investments in nutrition, movement, and sleep compound into extraordinary long-term health outcomes. A 1% improvement daily = 37x better in a year.", color: "text-green-400 bg-green-400/10" },
            { icon: Shield, title: "Risk Management", desc: "Proactive health management is your insurance policy against chronic disease. Prevention costs pennies compared to treatment.", color: "text-blue-400 bg-blue-400/10" },
            { icon: BarChart3, title: "Diversified Portfolio", desc: "True health wealth comes from investing across all dimensions: metabolic health, mental resilience, sleep quality, stress management, and relationships.", color: "text-purple-400 bg-purple-400/10" },
            { icon: Clock, title: "Time In Market", desc: "The earlier you start investing in health, the greater the compound effect. But it's never too late — the second best time is now.", color: "text-amber-400 bg-amber-400/10" },
            { icon: Brain, title: "Knowledge Capital", desc: "Understanding your body's signals, metabolic markers, and behavioral patterns is the foundation of smart health investing.", color: "text-cyan-400 bg-cyan-400/10" },
            { icon: Target, title: "Measurable Outcomes", desc: "Track your health metrics like you track financial returns: energy levels, sleep quality, metabolic markers, body composition, and cognitive performance.", color: "text-red-400 bg-red-400/10" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-400/30 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 5 Pillars of Health Investment */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">The 5 Pillars of Health Investment</h2>
        <div className="space-y-6">
          {[
            { num: "01", title: "Metabolic Capital", desc: "Your metabolic health is your primary asset. Insulin sensitivity, blood sugar stability, and cellular energy production determine everything else. The Feel Great system optimizes this foundation.", icon: Activity },
            { num: "02", title: "Behavioral Wealth", desc: "Your habits are your daily deposits. Every healthy meal, every movement session, every quality sleep night compounds. Behavioral nutrition ensures these deposits become automatic.", icon: Brain },
            { num: "03", title: "Energy Dividends", desc: "When your metabolic health is optimized, you receive daily energy dividends: sustained focus, stable mood, physical vitality, and mental clarity. These dividends fund everything else in life.", icon: Zap },
            { num: "04", title: "Longevity Bonds", desc: "Investing in health today buys you time tomorrow. Not just more years, but more quality years — active, independent, vibrant years with the people you love.", icon: Heart },
            { num: "05", title: "Impact Equity", desc: "Your health transformation becomes your greatest asset for helping others. As a Health Investor, you can build a purpose-driven business sharing what you've learned.", icon: DollarSign },
          ].map((pillar, i) => (
            <div key={i} className="flex gap-6 items-start bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-amber-400/20 transition-colors">
              <div className="text-3xl font-bold text-amber-400/30 shrink-0 w-12">{pillar.num}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <pillar.icon className="w-5 h-5 text-amber-400" />
                  {pillar.title}
                </h3>
                <p className="text-slate-400">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health ROI Calculator Preview */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-400/5 to-green-400/5 border border-amber-400/20 rounded-2xl p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Health ROI</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Consider this: If you invest $150/month in your metabolic health today, here's what the compound returns look like:
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs mb-1">Year 1</p>
              <p className="text-2xl font-bold text-green-400">$4,200</p>
              <p className="text-slate-400 text-xs">saved in medical costs</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs mb-1">Year 3</p>
              <p className="text-2xl font-bold text-green-400">$18,000</p>
              <p className="text-slate-400 text-xs">in productivity gains</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs mb-1">Year 5</p>
              <p className="text-2xl font-bold text-green-400">$45,000</p>
              <p className="text-slate-400 text-xs">total health wealth</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs mb-1">Lifetime</p>
              <p className="text-2xl font-bold text-amber-400">$283,000</p>
              <p className="text-slate-400 text-xs">in disease prevention</p>
            </div>
          </div>
          <p className="text-center text-slate-500 text-xs italic">
            *Estimates based on CDC, WHO, and Harvard Health research on preventive health economics. Individual results vary.
          </p>
        </div>
      </section>

      {/* Who Is a Health Investor */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Who Is a Health Investor?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-amber-400">A Health Investor is someone who:</h3>
            <ul className="space-y-3">
              {[
                "Sees health as their most valuable asset, not an afterthought",
                "Makes proactive decisions today for a better tomorrow",
                "Understands that energy and vitality are the currency of success",
                "Invests in prevention rather than paying for treatment",
                "Tracks their health metrics with the same attention as their finances",
                "Builds sustainable habits rather than chasing quick fixes",
                "Inspires others to make the same investment in themselves",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">The Health Investor Mindset</h3>
            <div className="space-y-4">
              {[
                { old: "\"I can't afford to eat healthy\"", new: "\"I can't afford NOT to invest in my health\"" },
                { old: "\"I'll start when I have time\"", new: "\"My health creates the time and energy I need\"" },
                { old: "\"Health products are expensive\"", new: "\"Disease is expensive. Prevention is an investment\"" },
                { old: "\"I'm too old to change\"", new: "\"The compound effect works at any age\"" },
              ].map((shift, i) => (
                <div key={i} className="border-l-2 border-amber-400/30 pl-4">
                  <p className="text-red-400/70 text-sm line-through">{shift.old}</p>
                  <p className="text-green-400 text-sm font-medium">{shift.new}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feras's Philosophy */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 text-center">
          <img
            src="/manus-storage/feras-portrait-1_d1f8a83f.png"
            alt="Feras Alayed"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-6 border-2 border-amber-400/30"
          />
          <blockquote className="text-xl text-slate-200 italic max-w-2xl mx-auto mb-4">
            "True success happens when health, purpose, leadership, and financial growth evolve together. You can't build a great life on a broken body. Invest in your health first — everything else follows."
          </blockquote>
          <p className="text-amber-400 font-medium">— Feras Alayed</p>
          <p className="text-slate-500 text-sm">Global Trainer & Health Strategist</p>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-400/10 to-green-400/10 border border-amber-400/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Health Investment Today</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Whether you want to optimize your own health or help others do the same — the first step is the same: invest in yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessments" className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
              Take Free Health Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/partner-with-feras" className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2">
              Become a Health Investor Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="container max-w-5xl mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-amber-400 transition-colors">About Feras</Link>
          <Link href="/topics" className="hover:text-amber-400 transition-colors">Health Topics</Link>
          <Link href="/partner-with-feras" className="hover:text-amber-400 transition-colors">Partner</Link>
          <Link href="/assessments" className="hover:text-amber-400 transition-colors">Assessments</Link>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Health Investor - Invest In Your Health Today",
            description: "Become a Health Investor. The most profitable investment you'll ever make is in your own health.",
            url: "https://feelgreat.us.com/health-investor",
            author: { "@type": "Person", name: "Feras Al-Ayed" },
            publisher: { "@type": "Organization", name: "Feel Great" },
          }),
        }}
      />
    </div>
  );
}
