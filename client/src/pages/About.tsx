import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Globe, Heart, Users, Award, BookOpen, Mic, Target, Zap, Shield, Star, CheckCircle, TrendingUp, Briefcase } from "lucide-react";

export default function About() {
  useEffect(() => {
    document.title = "About Feras Alayed | Global Trainer & Health Strategist | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Meet Feras Alayed - Global Trainer, Leadership Mentor, Health & Performance Strategist, Behavioral Nutrition Specialist, and Sustainable Health Advocate helping people transform their health, mindset, and life across 30+ countries.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/70 z-10" />
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16 relative z-20">
          <div className="text-center mb-6">
            <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
                Presidential Sapphire | Unicity International
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Meet Feras Alayed</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Global Trainer", "Leadership Mentor", "Health & Performance Strategist", "Behavioral Nutrition Specialist", "Sustainable Health Advocate"].map((title) => (
                  <span key={title} className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-300">
                    {title}
                  </span>
                ))}
              </div>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Feras Alayed is an international trainer, leadership mentor, and health strategist dedicated to helping people create transformation in both health and life. His mission extends beyond nutrition — he helps people improve their health, strengthen their mindset, build confidence, develop leadership skills, create sustainable habits, and unlock higher levels of personal and professional growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/health-assessment" className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-2">
                  Start Your Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/partner-with-feras" className="px-6 py-3 border border-amber-400/50 text-amber-400 font-medium rounded-xl hover:bg-amber-400/10 transition-colors">
                  Partner With Feras
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/manus-storage/feras-portrait-1_d1f8a83f.png"
                  alt="Feras Alayed - Global Trainer & Health Strategist"
                  className="rounded-2xl shadow-2xl max-h-[500px] object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                  15+ Years Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container max-w-5xl mx-auto px-4 py-16" id="mission">
        <div className="bg-gradient-to-r from-amber-400/5 to-amber-500/5 border border-amber-400/20 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Mission</h2>
          <p className="text-2xl text-slate-200 font-light italic max-w-3xl mx-auto leading-relaxed">
            "To empower people to build stronger bodies, stronger minds, stronger leadership, and better futures."
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {["Health Transformation", "Leadership Development", "Personal Growth", "Mindset Development", "Financial Empowerment", "International Experience"].map((pillar) => (
              <span key={pillar} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300">
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">Core Pillars</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
          Feras's unique approach combines multiple disciplines to create holistic transformation
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: "Sustainable Health", desc: "Evidence-based nutrition and lifestyle strategies that create lasting change, not temporary fixes", color: "text-green-400 bg-green-400/10" },
            { icon: BookOpen, title: "Behavioral Nutrition", desc: "Understanding the psychology of eating and building habits that make healthy living automatic", color: "text-blue-400 bg-blue-400/10" },
            { icon: Users, title: "Leadership Development", desc: "Building confident leaders who inspire others and create positive impact in their communities", color: "text-purple-400 bg-purple-400/10" },
            { icon: Zap, title: "Mindset Transformation", desc: "Shifting limiting beliefs and developing the mental resilience needed for lasting success", color: "text-amber-400 bg-amber-400/10" },
            { icon: TrendingUp, title: "Personal Growth", desc: "Continuous development across all dimensions of life — health, relationships, career, and purpose", color: "text-cyan-400 bg-cyan-400/10" },
            { icon: Target, title: "Financial Empowerment", desc: "Creating opportunities for financial growth through skills, leadership, and health entrepreneurship", color: "text-red-400 bg-red-400/10" },
          ].map((pillar, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-400/30 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.color}`}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
              <p className="text-slate-400 text-sm">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Impact */}
      <section className="container max-w-5xl mx-auto px-4 py-12" id="global-impact">
        <h2 className="text-3xl font-bold text-center mb-4">Creating Impact Beyond Health</h2>
        <p className="text-slate-400 text-center max-w-3xl mx-auto mb-10">
          Over the years, Feras has helped individuals across different countries improve their wellbeing, develop healthier lifestyles, grow their confidence, strengthen leadership abilities, and create new opportunities for personal and financial growth. His work focuses on empowering people to become the strongest version of themselves.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-amber-400">30+</div>
            <div className="text-sm text-slate-400">Countries Reached</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400">10,000+</div>
            <div className="text-sm text-slate-400">Lives Impacted</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <Mic className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-400">200+</div>
            <div className="text-sm text-slate-400">Training Sessions</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-400">15+</div>
            <div className="text-sm text-slate-400">Years Experience</div>
          </div>
        </div>
      </section>

      {/* Speaking & Training */}
      <section className="container max-w-5xl mx-auto px-4 py-12" id="speaking">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Speaking & Training</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Feras is a sought-after speaker and trainer who has conducted workshops, seminars, and training programs across the Middle East, Europe, and North America. His presentations combine scientific knowledge with practical strategies and motivational storytelling.
            </p>
            <div className="space-y-4">
              {[
                { title: "Health & Wellness Workshops", desc: "Evidence-based sessions on metabolic health, insulin resistance, and sustainable nutrition" },
                { title: "Leadership Development Programs", desc: "Building high-performance teams and developing next-generation leaders" },
                { title: "Mindset & Performance Training", desc: "Unlocking peak performance through behavioral science and habit formation" },
                { title: "Business & Entrepreneurship Seminars", desc: "Creating purpose-driven businesses in the health and wellness space" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/manus-storage/feras-portrait-2_61f1860f.jpg"
              alt="Feras Alayed - Speaker & Trainer"
              className="rounded-2xl shadow-2xl max-h-[450px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why People Follow Feras */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Why People Follow Feras</h2>
          <p className="text-xl text-slate-300 mb-4">Because he teaches more than health.</p>
          <p className="text-2xl font-bold text-amber-400 mb-6">He teaches transformation.</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            People come to improve their health. They stay because they discover a better version of themselves.
          </p>
        </div>
      </section>

      {/* Authority Roles */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Authority & Expertise</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: "International Trainer", desc: "Training programs delivered across 30+ countries" },
            { icon: Users, title: "Leadership Mentor", desc: "Developing leaders who build impactful teams" },
            { icon: Heart, title: "Health Strategist", desc: "Evidence-based metabolic health optimization" },
            { icon: Mic, title: "Speaker", desc: "Keynote presentations on health, leadership & growth" },
            { icon: Shield, title: "Community Builder", desc: "Building global communities of health-focused achievers" },
            { icon: Star, title: "Personal Development Advocate", desc: "Holistic growth across all life dimensions" },
          ].map((role, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center shrink-0">
                <role.icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">{role.title}</p>
                <p className="text-slate-500 text-xs">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Credentials */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Professional Credentials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Award, title: "Presidential Sapphire - Unicity International", desc: "Highest leadership rank achieved through building a global team across 30+ countries" },
            { icon: BookOpen, title: "Behavioral Nutrition Specialist", desc: "Advanced certification in behavioral change methodology, habit formation, and sustainable lifestyle modification" },
            { icon: Briefcase, title: "Therapeutic Nutrition Expert", desc: "Specialized in metabolic health, insulin resistance management, and chronic disease prevention through nutrition" },
            { icon: Globe, title: "International Health Educator", desc: "Conducted health education seminars and training programs across the Middle East, Europe, and North America" },
            { icon: TrendingUp, title: "Performance Optimization Coach", desc: "Combining nutrition science with behavioral psychology for peak performance outcomes" },
            { icon: Shield, title: "FTC Compliant Practice", desc: "All health claims and business practices fully compliant with FTC guidelines and industry standards" },
          ].map((cred, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center shrink-0">
                <cred.icon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{cred.title}</h3>
                <p className="text-slate-400 text-sm">{cred.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Positioning */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-2">Visitors should perceive Feras Alayed as a trusted authority in:</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Health", "Leadership", "Personal Growth", "Behavior Change", "Performance", "Life Transformation"].map((area) => (
              <span key={area} className="px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 font-medium">
                {area}
              </span>
            ))}
          </div>
          <p className="text-slate-500 italic">Not simply as a nutrition coach.</p>
        </div>
      </section>

      {/* CTAs */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Whether you're looking to transform your health, develop your leadership, or build a meaningful business — Feras is here to guide you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/health-assessment" className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
              Take Health Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/partner-with-feras" className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2">
              Partner With Feras
            </Link>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <div className="container max-w-5xl mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <Link href="/topics" className="hover:text-amber-400 transition-colors">Health Topics</Link>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
          <Link href="/partner-with-feras" className="hover:text-amber-400 transition-colors">Partner</Link>
          <Link href="/health-investor" className="hover:text-amber-400 transition-colors">Health Investor</Link>
          <Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Instagram</a>
          <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">TikTok</a>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Global Trainer & Health Strategist",
              description: "International trainer, leadership mentor, and health strategist dedicated to helping people create transformation in both health and life.",
              url: "https://feelgreat.us.com/about",
              image: "/manus-storage/feras-portrait-1_d1f8a83f.png",
              sameAs: [
                "https://www.instagram.com/use2lose",
                "https://www.tiktok.com/@feras.alayed",
              ],
              knowsAbout: [
                "Therapeutic Nutrition", "Behavioral Nutrition", "Leadership Development",
                "Health Strategy", "Insulin Resistance", "Metabolic Health",
                "Personal Development", "Mindset Transformation"
              ],
              worksFor: { "@type": "Organization", name: "Unicity International" },
            },
          }),
        }}
      />
    </div>
  );
}
