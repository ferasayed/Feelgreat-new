import { useEffect } from "react";
import { Link } from "wouter";
import { Award, BookOpen, Globe, Heart, Shield, Star, Users, CheckCircle, ArrowRight, GraduationCap, Briefcase } from "lucide-react";

export default function About() {
  useEffect(() => {
    document.title = "About Feras Al-Ayed | Therapeutic & Behavioral Nutrition Specialist | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Meet Feras Al-Ayed - Therapeutic & Behavioral Nutrition Specialist with 15+ years experience helping 10,000+ clients across 30+ countries achieve sustainable health transformation.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <section className="container max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-6">
          <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
        </div>
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            Presidential Sapphire | Unicity International
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Feras Al-Ayed</h1>
          <p className="text-xl text-amber-400 mb-3">Therapeutic & Behavioral Nutrition Specialist</p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Helping individuals and families achieve sustainable health transformation through evidence-based nutrition science and behavioral change methodology.
          </p>
        </div>
      </section>

      {/* Credentials */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Professional Credentials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: GraduationCap, title: "Therapeutic Nutrition Specialist", desc: "Advanced certification in therapeutic nutrition with focus on metabolic health, insulin resistance, and chronic disease prevention" },
            { icon: BookOpen, title: "Behavioral Nutrition Expert", desc: "Specialized training in behavioral change methodology, habit formation, and sustainable lifestyle modification" },
            { icon: Award, title: "Presidential Sapphire - Unicity", desc: "Highest leadership rank achieved through building a global team of 10,000+ health partners across 30+ countries" },
            { icon: Briefcase, title: "15+ Years Industry Experience", desc: "Over a decade and a half of hands-on experience in health coaching, team building, and nutrition consulting" },
            { icon: Globe, title: "International Health Educator", desc: "Conducted health education seminars and workshops across the Middle East, Europe, and North America" },
            { icon: Shield, title: "FTC Compliant Practice", desc: "All health claims and business practices fully compliant with FTC guidelines and Unicity International policies" },
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

      {/* Approach */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">My Approach</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
          I believe in sustainable health transformation through education, not restriction. My methodology combines three pillars:
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-800/30 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-bold text-xl mb-3">Education</h3>
            <p className="text-slate-400 text-sm">Understanding the science behind metabolic health empowers lasting change. I teach the "why" behind every recommendation.</p>
          </div>
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-800/30 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="font-bold text-xl mb-3">Behavioral Science</h3>
            <p className="text-slate-400 text-sm">Habits, not willpower, drive long-term results. I use proven behavioral change frameworks to make healthy living automatic.</p>
          </div>
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-800/30 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-bold text-xl mb-3">Community</h3>
            <p className="text-slate-400 text-sm">Health transformation is easier together. Our global community provides accountability, support, and shared success.</p>
          </div>
        </div>
      </section>

      {/* Case Studies / Success Stories */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">Client Success Stories</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
          Real results from real people following the Feel Great system under Feras's guidance.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              location: "Texas, USA",
              result: "Lost 12 kg in 4 months",
              story: "After years of yo-yo dieting, the Feel Great system was the first approach that felt sustainable. The behavioral nutrition coaching helped me understand my triggers and build lasting habits.",
              metric: "-12 kg",
            },
            {
              name: "Aisha K.",
              location: "London, UK",
              result: "Reversed prediabetes",
              story: "My HbA1c went from 6.3% to 5.4% in 6 months. My doctor was amazed. The combination of Balance before meals and the 4-4-12 pattern transformed my blood sugar control.",
              metric: "HbA1c 5.4%",
            },
            {
              name: "Emma L.",
              location: "Stockholm, Sweden",
              result: "Energy transformation",
              story: "I went from needing 3 coffees a day to having natural energy from morning to night. The gut health improvement was the key - I didn't realize how much my microbiome was affecting my energy.",
              metric: "3x Energy",
            },
            {
              name: "Jennifer R.",
              location: "California, USA",
              result: "Lost 18 kg, kept it off 2 years",
              story: "What makes this different is that I never felt deprived. The behavioral approach taught me to eat mindfully, and the products made blood sugar management effortless.",
              metric: "-18 kg",
            },
            {
              name: "Maria G.",
              location: "Berlin, Germany",
              result: "Improved metabolic markers",
              story: "Cholesterol down 20%, triglycerides normalized, and I feel 10 years younger. The holistic approach addressing nutrition, movement, sleep, and stress was exactly what I needed.",
              metric: "-20% Chol",
            },
            {
              name: "Lisa T.",
              location: "Amsterdam, Netherlands",
              result: "Built $5,000/mo business",
              story: "Not only did I transform my own health, but I built a meaningful business helping others do the same. Feras's mentorship and the partner system made it possible.",
              metric: "$5K/mo",
            },
          ].map((story, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">{story.name}</p>
                  <p className="text-slate-500 text-xs">{story.location}</p>
                </div>
                <div className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-bold">
                  {story.metric}
                </div>
              </div>
              <p className="text-amber-400 text-sm font-medium mb-2">{story.result}</p>
              <p className="text-slate-400 text-sm">{story.story}</p>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-xs mt-6">
          *Individual results vary. These testimonials represent individual experiences and are not guaranteed outcomes.
        </p>
      </section>

      {/* Stats */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-400">10,000+</div>
              <div className="text-slate-400 text-sm mt-1">Clients Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">30+</div>
              <div className="text-slate-400 text-sm mt-1">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">15+</div>
              <div className="text-slate-400 text-sm mt-1">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-400">95%</div>
              <div className="text-slate-400 text-sm mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Areas of Expertise</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Insulin Resistance & Prediabetes Management",
            "Sustainable Weight Loss (especially after 40)",
            "Metabolic Health Optimization",
            "Gut Health & Microbiome Restoration",
            "Behavioral Nutrition & Habit Formation",
            "Intermittent Fasting Protocols",
            "Hormonal Balance & Healthy Aging",
            "Energy & Fatigue Resolution",
            "Stress-Related Eating Patterns",
            "Health Business Development & Mentorship",
          ].map((spec, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-slate-300">{spec}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transformation?</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Whether you're looking to improve your health or build a business helping others, I'm here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/health-assessment"
              className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2"
            >
              Take Health Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/business-opportunity"
              className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2"
            >
              Explore Partnership
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
          <Link href="/partner" className="hover:text-amber-400 transition-colors">Partner</Link>
          <Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
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
              jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
              description: "Helping individuals achieve sustainable health transformation through evidence-based nutrition science and behavioral change methodology.",
              url: "https://feelgreat.us.com/about",
              sameAs: [
                "https://www.instagram.com/use2lose",
                "https://www.tiktok.com/@feras.alayed",
              ],
              knowsAbout: [
                "Therapeutic Nutrition",
                "Behavioral Nutrition",
                "Insulin Resistance",
                "Metabolic Health",
                "Weight Management",
                "Gut Health",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Unicity International",
              },
            },
          }),
        }}
      />
    </div>
  );
}
