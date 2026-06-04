import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle, Users, Globe, Heart, TrendingUp, Zap, Shield, Star, Calendar, Play } from "lucide-react";
import { toast } from "sonner";

export default function PartnerWithFeras() {
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", country: "" });
  const [submitted, setSubmitted] = useState(false);

  const registerLead = trpc.leads.register.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("Application submitted successfully!"); },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = "Partner With Feras | Health Entrepreneurship & Leadership | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Join Feras Alayed's global health movement. Build a purpose-driven health business focused on impact, leadership, personal growth, and community. No experience required.");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) {
      toast.error("Please fill in all fields");
      return;
    }
    registerLead.mutate({ ...formData, source: "partner-with-feras" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Received!</h1>
          <p className="text-slate-300 mb-6">Thank you for your interest in partnering with Feras. You'll receive a personal response within 24 hours.</p>
          <div className="space-y-3">
            <a href="https://wa.me/96877020770?text=I%20just%20submitted%20my%20partner%20application%20and%20would%20like%20to%20schedule%20a%20call" target="_blank" rel="noopener noreferrer" className="block px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
              Book Your Discovery Call via WhatsApp
            </a>
            <Link href="/" className="block text-slate-400 hover:text-white transition-colors">Return to Homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent" />
        <div className="container max-w-5xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <div className="text-center mb-6">
            <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
              Health Entrepreneurship Opportunity
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Partner With Feras
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              Build a purpose-driven health business that creates real impact in people's lives while growing personally, professionally, and financially.
            </p>
            <p className="text-lg text-slate-400 mb-8">
              This isn't just about health products. It's about building something meaningful — a community, a legacy, a life of purpose and freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowApply(true)} className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
                Apply Now <ArrowRight className="w-5 h-5" />
              </button>
              <a href="https://wa.me/96877020770?text=I'm%20interested%20in%20the%20partnership%20opportunity" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2">
                Book A Call <Calendar className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Why Partner With Feras?</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          When you partner with Feras, you gain more than a business opportunity. You gain a mentor, a community, and a path to becoming the best version of yourself.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: "Purpose & Impact", desc: "Help people transform their health and lives. Every person you reach is a life changed for the better.", color: "text-red-400 bg-red-400/10" },
            { icon: Users, title: "Community & Belonging", desc: "Join a global community of like-minded health leaders who support, inspire, and grow together.", color: "text-blue-400 bg-blue-400/10" },
            { icon: TrendingUp, title: "Personal Growth", desc: "Develop leadership skills, confidence, communication, and a growth mindset through real-world experience.", color: "text-green-400 bg-green-400/10" },
            { icon: Zap, title: "Freedom & Flexibility", desc: "Work from anywhere, set your own schedule, and build a business that fits your life — not the other way around.", color: "text-amber-400 bg-amber-400/10" },
            { icon: Globe, title: "Global Reach", desc: "Operate in 50+ countries. Your impact isn't limited by geography — it's amplified by it.", color: "text-purple-400 bg-purple-400/10" },
            { icon: Shield, title: "Proven System", desc: "Follow a proven framework backed by science, supported by a 30+ year company, and guided by experienced mentors.", color: "text-cyan-400 bg-cyan-400/10" },
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

      {/* How It Works */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          A simple, guided process from curiosity to impact
        </p>
        <div className="space-y-6">
          {[
            { step: "01", title: "Discovery Call", desc: "Have a personal conversation with Feras to understand your goals, values, and vision for the future." },
            { step: "02", title: "Learn The System", desc: "Understand the Feel Great approach to health — the science, the philosophy, and the transformation it creates." },
            { step: "03", title: "Start Your Journey", desc: "Experience the products yourself. Become your own best success story before sharing with others." },
            { step: "04", title: "Build Your Community", desc: "With Feras's mentorship, start sharing your story and helping others discover better health." },
            { step: "05", title: "Grow & Lead", desc: "Develop your leadership skills, expand your impact, and build a team of health advocates around the world." },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-400/30 shrink-0 w-12">{item.step}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          Real people who started their journey with Feras and transformed their lives
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah M.", location: "United States", quote: "I went from feeling stuck in my career to building a health business that gives me purpose and freedom. Feras's mentorship changed everything.", result: "Full-time health entrepreneur in 8 months" },
            { name: "Ahmed K.", location: "Germany", quote: "The personal development I've experienced is incredible. It's not just about health — it's about becoming a better leader, father, and person.", result: "Leading a team of 15 across 3 countries" },
            { name: "Lisa R.", location: "United Kingdom", quote: "I was skeptical at first, but the community and support system is unlike anything I've experienced. My health and confidence have transformed.", result: "Helping 50+ people improve their health" },
          ].map((story, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-4">"{story.quote}"</p>
              <div className="border-t border-slate-700 pt-4">
                <p className="font-semibold">{story.name}</p>
                <p className="text-slate-500 text-sm">{story.location}</p>
                <p className="text-amber-400 text-sm mt-2 font-medium">{story.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Is This For */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Is This For You?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-6">
            <h3 className="font-bold text-lg text-green-400 mb-4">This is for you if:</h3>
            <ul className="space-y-3">
              {[
                "You want more purpose and meaning in your work",
                "You care about health and helping others",
                "You're looking for personal growth and development",
                "You want flexibility and freedom in your schedule",
                "You're coachable and willing to learn",
                "You want to be part of a supportive community",
                "You believe in investing in yourself",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-6">
            <h3 className="font-bold text-lg text-red-400 mb-4">This is NOT for you if:</h3>
            <ul className="space-y-3">
              {[
                "You're looking for a get-rich-quick scheme",
                "You're not willing to invest time in learning",
                "You don't care about helping others",
                "You expect results without consistent effort",
                "You're not open to personal development",
                "You prefer working completely alone",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      {showApply && (
        <section className="container max-w-lg mx-auto px-4 py-16" id="apply">
          <h2 className="text-3xl font-bold text-center mb-2">Apply Now</h2>
          <p className="text-slate-400 text-center mb-8">Take the first step toward building something meaningful</p>
          <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="+1 (555) 000-0000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Country</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="Your country" required />
            </div>
            <button type="submit" disabled={registerLead.isPending} className="w-full px-6 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50">
              {registerLead.isPending ? "Submitting..." : "Submit Application"}
            </button>
            <p className="text-xs text-slate-500 text-center">Your information is confidential. Feras will personally review your application.</p>
          </form>
        </section>
      )}

      {/* CTA */}
      {!showApply && (
        <section className="container max-w-3xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              The best time to invest in yourself was yesterday. The second best time is now. Take the first step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowApply(true)} className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
                Apply Now <ArrowRight className="w-5 h-5" />
              </button>
              <a href="https://wa.me/96877020770?text=I'd%20like%20to%20learn%20more%20about%20the%20partnership%20opportunity" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors inline-flex items-center justify-center gap-2">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="container max-w-5xl mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-amber-400 transition-colors">About Feras</Link>
          <Link href="/topics" className="hover:text-amber-400 transition-colors">Health Topics</Link>
          <Link href="/health-investor" className="hover:text-amber-400 transition-colors">Health Investor</Link>
          <Link href="/assessments" className="hover:text-amber-400 transition-colors">Free Assessments</Link>
        </div>
      </div>
    </div>
  );
}
