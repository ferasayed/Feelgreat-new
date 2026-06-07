import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle, Users, Globe, Heart, TrendingUp, Zap, Shield, Star, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PartnerWithFeras() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [showApply, setShowApply] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", country: "" });
  const [submitted, setSubmitted] = useState(false);

  const registerLead = trpc.leads.register.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success(isAr ? "تم إرسال الطلب بنجاح!" : "Application submitted successfully!"); },
    onError: () => toast.error(isAr ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = isAr
      ? "شراكة مع فراس | ريادة الأعمال الصحية والقيادة | Feel Great"
      : "Partner With Feras | Health Entrepreneurship & Leadership | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", isAr
      ? "انضم إلى حركة فراس العايد الصحية العالمية. ابنِ عملاً صحياً هادفاً يركز على التأثير والقيادة والنمو الشخصي والمجتمع. لا تحتاج خبرة سابقة."
      : "Join Feras Alayed's global health movement. Build a purpose-driven health business focused on impact, leadership, personal growth, and community. No experience required.");
  }, [isAr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) {
      toast.error(isAr ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    registerLead.mutate({ ...formData, source: "partner-with-feras" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4" dir={isAr ? "rtl" : "ltr"}>
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{isAr ? "تم استلام الطلب!" : "Application Received!"}</h1>
          <p className="text-slate-300 mb-6">{isAr ? "شكراً لاهتمامك بالشراكة مع فراس. ستتلقى رداً شخصياً خلال 24 ساعة." : "Thank you for your interest in partnering with Feras. You'll receive a personal response within 24 hours."}</p>
          <div className="space-y-3">
            <a href="https://wa.me/96877020770?text=I%20just%20submitted%20my%20partner%20application%20and%20would%20like%20to%20schedule%20a%20call" target="_blank" rel="noopener noreferrer" className="block px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
              {isAr ? "احجز مكالمة الاكتشاف عبر واتساب" : "Book Your Discovery Call via WhatsApp"}
            </a>
            <Link href="/" className="block text-slate-400 hover:text-white transition-colors">{isAr ? "العودة للصفحة الرئيسية" : "Return to Homepage"}</Link>
          </div>
        </div>
      </div>
    );
  }

  const whyPartner = isAr
    ? [
        { icon: Heart, title: "الهدف والتأثير", desc: "ساعد الناس على تحويل صحتهم وحياتهم. كل شخص تصل إليه هو حياة تتغير للأفضل.", color: "text-red-400 bg-red-400/10" },
        { icon: Users, title: "المجتمع والانتماء", desc: "انضم إلى مجتمع عالمي من قادة الصحة المتشابهين في التفكير الذين يدعمون ويُلهمون وينمون معاً.", color: "text-blue-400 bg-blue-400/10" },
        { icon: TrendingUp, title: "النمو الشخصي", desc: "طوّر مهارات القيادة والثقة والتواصل وعقلية النمو من خلال الخبرة الواقعية.", color: "text-green-400 bg-green-400/10" },
        { icon: Zap, title: "الحرية والمرونة", desc: "اعمل من أي مكان، حدد جدولك الخاص، وابنِ عملاً يناسب حياتك — وليس العكس.", color: "text-amber-400 bg-amber-400/10" },
        { icon: Globe, title: "الوصول العالمي", desc: "اعمل في أكثر من 50 دولة. تأثيرك لا يقتصر على الجغرافيا — بل يتضاعف بها.", color: "text-purple-400 bg-purple-400/10" },
        { icon: Shield, title: "نظام مُثبت", desc: "اتبع إطاراً مُثبتاً مدعوماً بالعلم، تدعمه شركة عمرها أكثر من 30 عاماً، ويرشدك مرشدون ذوو خبرة.", color: "text-cyan-400 bg-cyan-400/10" },
      ]
    : [
        { icon: Heart, title: "Purpose & Impact", desc: "Help people transform their health and lives. Every person you reach is a life changed for the better.", color: "text-red-400 bg-red-400/10" },
        { icon: Users, title: "Community & Belonging", desc: "Join a global community of like-minded health leaders who support, inspire, and grow together.", color: "text-blue-400 bg-blue-400/10" },
        { icon: TrendingUp, title: "Personal Growth", desc: "Develop leadership skills, confidence, communication, and a growth mindset through real-world experience.", color: "text-green-400 bg-green-400/10" },
        { icon: Zap, title: "Freedom & Flexibility", desc: "Work from anywhere, set your own schedule, and build a business that fits your life — not the other way around.", color: "text-amber-400 bg-amber-400/10" },
        { icon: Globe, title: "Global Reach", desc: "Operate in 50+ countries. Your impact isn't limited by geography — it's amplified by it.", color: "text-purple-400 bg-purple-400/10" },
        { icon: Shield, title: "Proven System", desc: "Follow a proven framework backed by science, supported by a 30+ year company, and guided by experienced mentors.", color: "text-cyan-400 bg-cyan-400/10" },
      ];

  const steps = isAr
    ? [
        { step: "01", title: "مكالمة الاكتشاف", desc: "محادثة شخصية مع فراس لفهم أهدافك وقيمك ورؤيتك للمستقبل." },
        { step: "02", title: "تعلّم النظام", desc: "افهم نهج Feel Great للصحة — العلم والفلسفة والتحول الذي يُحدثه." },
        { step: "03", title: "ابدأ رحلتك", desc: "جرّب المنتجات بنفسك. كن أفضل قصة نجاح لك قبل مشاركتها مع الآخرين." },
        { step: "04", title: "ابنِ مجتمعك", desc: "بإرشاد فراس، ابدأ بمشاركة قصتك ومساعدة الآخرين على اكتشاف صحة أفضل." },
        { step: "05", title: "انمُ وقُد", desc: "طوّر مهاراتك القيادية، وسّع تأثيرك، وابنِ فريقاً من المُثقفين الصحيين حول العالم." },
      ]
    : [
        { step: "01", title: "Discovery Call", desc: "Have a personal conversation with Feras to understand your goals, values, and vision for the future." },
        { step: "02", title: "Learn The System", desc: "Understand the Feel Great approach to health — the science, the philosophy, and the transformation it creates." },
        { step: "03", title: "Start Your Journey", desc: "Experience the products yourself. Become your own best success story before sharing with others." },
        { step: "04", title: "Build Your Community", desc: "With Feras's mentorship, start sharing your story and helping others discover better health." },
        { step: "05", title: "Grow & Lead", desc: "Develop your leadership skills, expand your impact, and build a team of health advocates around the world." },
      ];

  const forYou = isAr
    ? [
        "تريد المزيد من الهدف والمعنى في عملك",
        "تهتم بالصحة ومساعدة الآخرين",
        "تبحث عن النمو والتطوير الشخصي",
        "تريد المرونة والحرية في جدولك",
        "قابل للتوجيه ومستعد للتعلم",
        "تريد أن تكون جزءاً من مجتمع داعم",
        "تؤمن بالاستثمار في نفسك",
      ]
    : [
        "You want more purpose and meaning in your work",
        "You care about health and helping others",
        "You're looking for personal growth and development",
        "You want flexibility and freedom in your schedule",
        "You're coachable and willing to learn",
        "You want to be part of a supportive community",
        "You believe in investing in yourself",
      ];

  const notForYou = isAr
    ? [
        "تبحث عن طريقة سريعة للثراء",
        "لست مستعداً لاستثمار الوقت في التعلم",
        "لا تهتم بمساعدة الآخرين",
        "تتوقع نتائج بدون جهد مستمر",
        "لست منفتحاً على التطوير الشخصي",
        "تفضل العمل بمفردك تماماً",
      ]
    : [
        "You're looking for a get-rich-quick scheme",
        "You're not willing to invest time in learning",
        "You don't care about helping others",
        "You expect results without consistent effort",
        "You're not open to personal development",
        "You prefer working completely alone",
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent" />
        <div className="container max-w-5xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <div className="text-center mb-6">
            <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
              {isAr ? "فرصة ريادة الأعمال الصحية" : "Health Entrepreneurship Opportunity"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {isAr ? "شراكة مع فراس" : "Partner With Feras"}
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              {isAr
                ? "ابنِ عملاً صحياً هادفاً يُحدث تأثيراً حقيقياً في حياة الناس بينما تنمو شخصياً ومهنياً ومالياً."
                : "Build a purpose-driven health business that creates real impact in people's lives while growing personally, professionally, and financially."}
            </p>
            <p className="text-lg text-slate-400 mb-8">
              {isAr
                ? "هذا ليس مجرد منتجات صحية. إنه بناء شيء ذي معنى — مجتمع، إرث، حياة من الهدف والحرية."
                : "This isn't just about health products. It's about building something meaningful — a community, a legacy, a life of purpose and freedom."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowApply(true)} className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
                {isAr ? "قدّم الآن" : "Apply Now"} <ArrowRight className="w-5 h-5" />
              </button>
              <a href="https://wa.me/96877020770?text=I'm%20interested%20in%20the%20partnership%20opportunity" target="_blank" rel="noopener noreferrer" className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2">
                {isAr ? "احجز مكالمة" : "Book A Call"} <Calendar className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Firas in Action - Photo Strip */}
      <section className="container max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <img src="/manus-storage/IMG_6338_a000f1b3.JPG" alt="Firas speaking" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
          <img src="/manus-storage/IMG_6340_3f7f858f.JPG" alt="Audience engagement" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
          <img src="/manus-storage/IMG_5327_bf4b169f.JPG" alt="Training" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
          <img src="/manus-storage/9FB5609C-0A12-42C9-8A81-E89AFEA20273_f4c031d4.jpg" alt="Large event" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
          <img src="/manus-storage/IMG_6753_8a108a68.jpeg" alt="Conference" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
          <img src="/manus-storage/IMG_5295_7ab0dde0.JPG" alt="Group" className="rounded-lg object-cover w-full h-28 md:h-36 opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </section>

      {/* Why Partner */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "لماذا الشراكة مع فراس؟" : "Why Partner With Feras?"}</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          {isAr
            ? "عندما تشارك فراس، تكسب أكثر من فرصة عمل. تكسب مرشداً ومجتمعاً وطريقاً لتصبح أفضل نسخة من نفسك."
            : "When you partner with Feras, you gain more than a business opportunity. You gain a mentor, a community, and a path to becoming the best version of yourself."}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyPartner.map((item, i) => (
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
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "كيف يعمل" : "How It Works"}</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          {isAr ? "عملية بسيطة ومُوجّهة من الفضول إلى التأثير" : "A simple, guided process from curiosity to impact"}
        </p>
        <div className="space-y-6">
          {steps.map((item, i) => (
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
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "قصص نجاح" : "Success Stories"}</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          {isAr ? "أشخاص حقيقيون بدأوا رحلتهم مع فراس وحوّلوا حياتهم" : "Real people who started their journey with Feras and transformed their lives"}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {(isAr
            ? [
                { name: "سارة م.", location: "الولايات المتحدة", quote: "انتقلت من الشعور بالركود في مسيرتي المهنية إلى بناء عمل صحي يمنحني الهدف والحرية. إرشاد فراس غيّر كل شيء.", result: "رائدة أعمال صحية بدوام كامل في 8 أشهر" },
                { name: "أحمد ك.", location: "ألمانيا", quote: "التطور الشخصي الذي عشته مذهل. ليس فقط عن الصحة — بل عن أن أصبح قائداً وأباً وإنساناً أفضل.", result: "يقود فريقاً من 15 شخصاً في 3 دول" },
                { name: "ليزا ر.", location: "المملكة المتحدة", quote: "كنت متشككة في البداية، لكن المجتمع ونظام الدعم لا مثيل لهما. صحتي وثقتي تحولتا.", result: "تساعد أكثر من 50 شخصاً على تحسين صحتهم" },
              ]
            : [
                { name: "Sarah M.", location: "United States", quote: "I went from feeling stuck in my career to building a health business that gives me purpose and freedom. Feras's mentorship changed everything.", result: "Full-time health entrepreneur in 8 months" },
                { name: "Ahmed K.", location: "Germany", quote: "The personal development I've experienced is incredible. It's not just about health — it's about becoming a better leader, father, and person.", result: "Leading a team of 15 across 3 countries" },
                { name: "Lisa R.", location: "United Kingdom", quote: "I was skeptical at first, but the community and support system is unlike anything I've experienced. My health and confidence have transformed.", result: "Helping 50+ people improve their health" },
              ]
          ).map((story, i) => (
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
        <h2 className="text-3xl font-bold text-center mb-10">{isAr ? "هل هذا مناسب لك؟" : "Is This For You?"}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-6">
            <h3 className="font-bold text-lg text-green-400 mb-4">{isAr ? "هذا مناسب لك إذا:" : "This is for you if:"}</h3>
            <ul className="space-y-3">
              {forYou.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-6">
            <h3 className="font-bold text-lg text-red-400 mb-4">{isAr ? "هذا ليس مناسباً لك إذا:" : "This is NOT for you if:"}</h3>
            <ul className="space-y-3">
              {notForYou.map((item, i) => (
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
          <h2 className="text-3xl font-bold text-center mb-2">{isAr ? "قدّم الآن" : "Apply Now"}</h2>
          <p className="text-slate-400 text-center mb-8">{isAr ? "اتخذ الخطوة الأولى نحو بناء شيء ذي معنى" : "Take the first step toward building something meaningful"}</p>
          <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{isAr ? "الاسم الكامل" : "Full Name"}</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder={isAr ? "اسمك الكامل" : "Your full name"} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{isAr ? "البريد الإلكتروني" : "Email"}</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{isAr ? "رقم واتساب" : "WhatsApp Number"}</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder="+1 (555) 000-0000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{isAr ? "الدولة" : "Country"}</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none" placeholder={isAr ? "دولتك" : "Your country"} required />
            </div>
            <button type="submit" disabled={registerLead.isPending} className="w-full px-6 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50">
              {registerLead.isPending ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال الطلب" : "Submit Application")}
            </button>
            <p className="text-xs text-slate-500 text-center">{isAr ? "معلوماتك سرية. فراس سيراجع طلبك شخصياً." : "Your information is confidential. Feras will personally review your application."}</p>
          </form>
        </section>
      )}

      {/* CTA */}
      {!showApply && (
        <section className="container max-w-3xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">{isAr ? "مستعد للبدء؟" : "Ready to Start?"}</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              {isAr
                ? "أفضل وقت للاستثمار في نفسك كان بالأمس. ثاني أفضل وقت هو الآن. اتخذ الخطوة الأولى."
                : "The best time to invest in yourself was yesterday. The second best time is now. Take the first step."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setShowApply(true)} className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
                {isAr ? "قدّم الآن" : "Apply Now"} <ArrowRight className="w-5 h-5" />
              </button>
              <a href="https://wa.me/96877020770?text=I'd%20like%20to%20learn%20more%20about%20the%20partnership%20opportunity" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors inline-flex items-center justify-center gap-2">
                {isAr ? "تحدث عبر واتساب" : "Chat on WhatsApp"}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="container max-w-5xl mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
          <Link href="/about" className="hover:text-amber-400 transition-colors">{isAr ? "عن فراس" : "About Feras"}</Link>
          <Link href="/topics" className="hover:text-amber-400 transition-colors">{isAr ? "المواضيع الصحية" : "Health Topics"}</Link>
          <Link href="/health-investor" className="hover:text-amber-400 transition-colors">{isAr ? "المستثمر الصحي" : "Health Investor"}</Link>
          <Link href="/assessments" className="hover:text-amber-400 transition-colors">{isAr ? "تقييمات مجانية" : "Free Assessments"}</Link>
        </div>
      </div>
    </div>
  );
}
