import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Play, DollarSign, Globe, Users, Clock, TrendingUp, Star, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FunnelStep = "opportunity" | "video" | "application" | "booking";

export default function BusinessOpportunity() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [step, setStep] = useState<FunnelStep>("opportunity");

  useEffect(() => {
    document.title = isAr
      ? "فرصة الشراكة التجارية | Feel Great"
      : "Business Partnership Opportunity | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", isAr
      ? "اكتشف كيف تبني عملاً صحياً عالمياً مع Feel Great. انضم لأكثر من 10,000 شريك يكسبون دخلاً بينما يساعدون الآخرين."
      : "Discover how to build a global health business with Feel Great. Join 10,000+ partners earning income while helping others achieve sustainable wellness.");
  }, [isAr]);

  const renderOpportunity = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="container max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
          <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
            {isAr ? "مواقع شراكة محدودة متاحة" : "Limited Partnership Positions Available"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {isAr ? <>ابنِ عملاً صحياً عالمياً<br /><span className="text-amber-400">من أي مكان في العالم</span></> : <>Build a Global Health Business<br /><span className="text-amber-400">From Anywhere in the World</span></>}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {isAr ? "انضم لآلاف الشركاء الذين يبنون دخلاً ذا معنى بينما يساعدون الآخرين على تحقيق صحة مستدامة. لا مخزون، لا تكاليف ثابتة، لا حدود." : "Join thousands of partners who are building meaningful income while helping others achieve sustainable health. No inventory, no overhead, no limits."}
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: DollarSign, title: "Recurring Income", desc: "Build monthly recurring revenue from health product subscriptions" },
            { icon: Globe, title: "Work From Anywhere", desc: "100% remote business model. Work from home, travel, or anywhere with internet" },
            { icon: Clock, title: "Flexible Schedule", desc: "Build at your own pace. Part-time or full-time - you decide" },
            { icon: Users, title: "Team Building", desc: "Earn from your team's success. Leadership bonuses reward mentorship" },
            { icon: TrendingUp, title: "Scalable Growth", desc: "No ceiling on income. Top partners earn $10,000-$50,000+ monthly" },
            { icon: Star, title: "Global Community", desc: "30+ countries. Supportive community of health-focused entrepreneurs" },
          ].map((benefit, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-400/30 transition-colors">
              <benefit.icon className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Income Levels */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Partner Income Levels</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { level: "Starter", income: "$500-$2,000/mo", time: "5-10 hrs/week", color: "border-slate-600" },
              { level: "Builder", income: "$2,000-$5,000/mo", time: "10-15 hrs/week", color: "border-blue-500/50" },
              { level: "Leader", income: "$5,000-$15,000/mo", time: "15-25 hrs/week", color: "border-purple-500/50" },
              { level: "Executive", income: "$15,000-$50,000+/mo", time: "Full-time", color: "border-amber-400/50" },
            ].map((tier, i) => (
              <div key={i} className={`border ${tier.color} rounded-xl p-5 text-center`}>
                <p className="text-sm text-slate-400 mb-1">{tier.level}</p>
                <p className="text-xl font-bold text-amber-400 mb-2">{tier.income}</p>
                <p className="text-xs text-slate-500">{tier.time}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-xs mt-4">
            *Income levels are illustrative and based on partner activity. Individual results vary.
          </p>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-400">10,000+</div>
            <div className="text-sm text-slate-400">Active Partners</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">30+</div>
            <div className="text-sm text-slate-400">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">$50M+</div>
            <div className="text-sm text-slate-400">Paid to Partners</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">25+ yrs</div>
            <div className="text-sm text-slate-400">Company History</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setStep("video")}
            className="px-10 py-5 bg-amber-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-3"
          >
            {isAr ? "شاهد فيديو الفرصة" : "Watch the Opportunity Video"} <Play className="w-5 h-5" />
          </button>
          <p className="text-slate-500 text-sm mt-4">{isAr ? "عرض مجاني 5 دقائق • بدون التزام" : "Free 5-minute presentation • No obligation"}</p>
        </div>
      </div>
    </div>
  );

  const renderVideo = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "نموذج عمل Feel Great" : "The Feel Great Business Model"}</h1>
          <p className="text-slate-400">{isAr ? "شاهد هذا العرض لمدة 5 دقائق لفهم الفرصة" : "Watch this 5-minute overview to understand the opportunity"}</p>
        </div>

        {/* Video placeholder */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl aspect-video flex items-center justify-center mb-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-amber-400 ml-1" />
            </div>
            <p className="text-slate-400 mb-2">Business Opportunity Presentation</p>
            <p className="text-slate-500 text-sm">5 minutes • How the Feel Great partner model works</p>
          </div>
        </div>

        {/* Key takeaways */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-10">
          <h3 className="font-semibold text-lg mb-4">Key Takeaways:</h3>
          <ul className="space-y-3">
            {[
              "Unicity International: 25+ year track record, publicly traded, $1B+ revenue",
              "Feel Great: Fastest-growing product system in the company",
              "Partner model: Earn from personal sales + team building + leadership bonuses",
              "No inventory required: Products ship directly to customers",
              "Full training and mentorship provided by Feras Al-Ayed (Presidential Sapphire)",
              "Start with minimal investment: just your own product subscription",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <button
            onClick={() => setStep("application")}
            className="px-10 py-5 bg-amber-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-3"
          >
            {isAr ? "قدّم لتصبح شريكاً" : "Apply to Become a Partner"} <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <button onClick={() => setStep("opportunity")} className="text-slate-400 hover:text-white text-sm transition-colors">
              {isAr ? "← العودة للنظرة العامة" : "← Back to overview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplication = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "طلب الشراكة" : "Partner Application"}</h1>
          <p className="text-slate-400">{isAr ? "أخبرنا عن نفسك لنحدد ما إذا كان هذا مناسباً لك" : "Tell us about yourself so we can determine if this is a good fit"}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {/* Qualification questions */}
          <div className="space-y-6 mb-8">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Quick Qualification Check
            </h3>

            {[
              "Are you looking for an additional income stream?",
              "Are you passionate about health and wellness?",
              "Can you dedicate 5-10 hours per week to start?",
              "Are you coachable and willing to follow a proven system?",
              "Do you have a smartphone and internet access?",
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-slate-300">{q}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-6">
            <p className="text-slate-300 mb-6">
              If you answered yes to most of these questions, you're a great fit for the Feel Great partner program. The next step is to book a discovery call with Feras Al-Ayed.
            </p>
            <button
              onClick={() => setStep("booking")}
              className="w-full px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
            >
              {isAr ? "احجز مكالمة الاكتشاف" : "Book Your Discovery Call"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => setStep("video")} className="text-slate-400 hover:text-white text-sm transition-colors">
            {isAr ? "← العودة للفيديو" : "← Back to video"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
          <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "احجز مكالمة الاكتشاف" : "Book Your Discovery Call"}</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            {isAr ? "حدد موعداً لمكالمة 20 دقيقة مع فراس العايد لمناقشة فرصة الشراكة والإجابة على أسئلتك." : "Schedule a 20-minute call with Feras Al-Ayed to discuss the partnership opportunity and answer your questions."}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">During Your Call, You'll Learn:</h3>
          <ul className="space-y-4 mb-8">
            {[
              "Exactly how the compensation plan works",
              "How to get started with minimal investment",
              "The training and support system available to you",
              "Real examples of partner success stories",
              "Your personalized action plan for the first 30 days",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            <a
              href="https://wa.me/96877020770?text=I%20watched%20the%20business%20opportunity%20video%20and%20would%20like%20to%20book%20a%20discovery%20call%20to%20learn%20more%20about%20becoming%20a%20Feel%20Great%20partner"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
            >
              {isAr ? "احجز عبر واتساب" : "Book via WhatsApp"} <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/use2lose"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-8 py-4 border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 transition-colors flex items-center justify-center"
            >
              Follow @use2lose on Instagram
            </a>
          </div>
        </div>

        {/* Mentor info */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Your Mentor:</p>
          <p className="font-semibold text-xl">Feras Al-Ayed</p>
          <p className="text-amber-400 text-sm mb-1">Presidential Sapphire</p>
          <p className="text-slate-500 text-sm">Therapeutic & Behavioral Nutrition Specialist</p>
          <p className="text-slate-500 text-sm">15+ years in health & wellness industry</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {step === "opportunity" && renderOpportunity()}
      {step === "video" && renderVideo()}
      {step === "application" && renderApplication()}
      {step === "booking" && renderBooking()}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Business Partnership Opportunity",
            description: "Discover how to build a global health business with Feel Great. Join 10,000+ partners earning income while helping others.",
            url: "https://feelgreat.us.com/business-opportunity",
            isPartOf: { "@type": "WebSite", name: "Feel Great", url: "https://feelgreat.us.com" },
            author: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
            },
          }),
        }}
      />
    </>
  );
}
