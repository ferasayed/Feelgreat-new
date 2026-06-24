import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, DollarSign, Globe, Users, Clock, TrendingUp, Star, Award, TrendingDown, Shield, Zap, Target, BookOpen, Briefcase, BarChart3, PiggyBank, Building2, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Investment opportunity articles data
const investmentArticles = [
  {
    slug: "health-investment-roi",
    title: "Your Health Investment: The Best Investment You Can Make in 2024",
    titleAr: "استثمارك في الصحة: أفضل استثمار يمكنك القيام به في 2024",
    desc: "Discover why investing in your health delivers better returns than any stock market portfolio. Learn about the ROI of preventive health.",
    descAr: "اكتشف لماذا يوفر الاستثمار في صحتك عوائد أفضل من أي محفظة أسهم. تعرف على العائد على الاستثمار في الوقاية الصحية.",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "cost-of-diabetes-investment",
    title: "The True Cost of Diabetes vs. Investing in Prevention",
    titleAr: "التكلفة الحقيقية للسكري مقابل الاستثمار في الوقاية",
    desc: "The average diabetic spends $9,600+ annually on medical costs. See why investing $30/month in prevention is the smartest financial decision.",
    descAr: "يصل إنفاق المصاب بالسكري في المتوسط إلى أكثر من 9,600 دولار سنوياً على تكاليف طبية. اكتشف لماذا يعد استثمار 30 دولاراً شهرياً في الوقاية أذكى قرار مالي.",
    icon: TrendingDown,
    color: "from-red-500 to-orange-500",
  },
  {
    slug: "unicity-business-investment",
    title: "Why Unicity Is the Smart Business Investment for 2024",
    titleAr: "لماذا يونيسيتي هو الاستثمار الذكي في الأعمال لعام 2024",
    desc: "With 25+ years in business, $1B+ revenue, and products in 30+ countries, Unicity offers stability most startups can't match.",
    descAr: "مع أكثر من 25 عاماً في الأعمال التجارية وأكثر من مليار دولار في الإيرادات ومنتجات في أكثر من 30 دولة، تقدم يونيسيتي استقراراً لا يمكن لمعظم الشركات الناشئة مطابقته.",
    icon: Building2,
    color: "from-blue-500 to-indigo-500",
  },
  {
    slug: "centurion-investment-program",
    title: "The Centurion Investment Program: Your Path to Financial Freedom",
    titleAr: "برنامج سينشريون للاستثمار: طريقك إلى الحرية المالية",
    desc: "Unicity's exclusive Centurion program offers guaranteed returns, leadership development, and priority commissions for serious builders.",
    descAr: "يقدم برنامج سينشريون الحصري من يونيسيتي عوائد مضمونة وتطوير قيادي وأولوية العمولات للمطورين الجادين.",
    icon: Crown,
    color: "from-amber-500 to-yellow-500",
  },
  {
    slug: "compensation-plan-explained",
    title: "Unicity Compensation Plan Explained: How to Build Wealth",
    titleAr: "خطة تعويضات يونيسيتي: كيف تبني ثروتك",
    desc: "Detailed breakdown of Unicity's 7-income stream model: retail profit, override commissions, leadership bonuses, and more.",
    descAr: "تفصيل شامل لنموذج يونيسيتي ذو 7 مصادر دخل: ربح التجزئة، عمولات التجاوز، مكافآت القيادة والمزيد.",
    icon: BarChart3,
    color: "from-purple-500 to-violet-500",
  },
  {
    slug: "prevention-vs-treatment-investment",
    title: "Prevention vs. Treatment: Why Investing in Health Pays Off",
    titleAr: "الوقاية مقابل العلاج: لماذا يؤتي الاستثمار في الصحة ثماره",
    desc: "Clinical data shows preventive health programs reduce chronic disease risk by 80%. See the math behind smart health investment.",
    descAr: "تُظهر البيانات السريرية أن برامج الصحة الوقائية تقلل من خطر الأمراض المزمنة بنسبة 80%. شاهد الأرقام وراء الاستثمار الذكي في الصحة.",
    icon: Shield,
    color: "from-cyan-500 to-blue-500",
  },
  {
    slug: "passive-income-unicity",
    title: "How to Generate Passive Income with Unicity",
    titleAr: "كيف تحقق دخلاً سلبياً مع يونيسيتي",
    desc: "Build a health-focused business that generates recurring monthly income. Learn the exact system top earners use for residual income.",
    descAr: "ابنِ عملاً يركز على الصحة يولد دخلاً شهرياً متكرراً. تعرف على النظام الدقيق الذي يستخدمه كبار earners للدخل المتبقي.",
    icon: PiggyBank,
    color: "from-green-500 to-emerald-500",
  },
  {
    slug: "unicity-roi-calculation",
    title: "Unicity ROI Calculation: Real Numbers That Matter",
    titleAr: "حساب العائد على الاستثمار في يونيسيتي: أرقام حقيقية مهمة",
    desc: "Real ROI calculations based on actual partner results. See how much you can earn with $99, $299, or $599 monthly investment levels.",
    descAr: "حسابات حقيقية للعائد على الاستثمار بناءً على نتائج الشركاء الفعليين. شاهد كم يمكنك الربح بمستويات استثمارية شهرية بـ 99 دولار أو 299 دولار أو 599 دولار.",
    icon: Target,
    color: "from-pink-500 to-rose-500",
  },
];

// Partner testimonials
const testimonials = [
  {
    name: "Sarah M.",
    location: "Toronto, Canada",
    income: "$4,200/mo",
    text: "Started 18 months ago as a side hustle. Now my Unicity business covers my mortgage payments every month.",
  },
  {
    name: "Michael R.",
    location: "London, UK",
    income: "$8,500/mo",
    text: "The training system is incredible. Feras helped me build a team of 200+ partners across Europe in just 2 years.",
  },
  {
    name: "Jennifer L.",
    location: "Los Angeles, USA",
    income: "$12,000/mo",
    text: "As a busy mom, I needed something flexible. This business grows while I sleep thanks to the automated system.",
  },
  {
    name: "David K.",
    location: "Berlin, Germany",
    income: "$6,800/mo",
    text: "The products sell themselves. I focus on connecting people and the commissions just keep rolling in.",
  },
];

export default function BusinessOpportunity() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const referralLink = "https://ufeelgreat.com/c/GBP556";

  useEffect(() => {
    document.title = isAr
      ? "فرص الاستثمار والأعمال | Feel Great - انضم كشريك"
      : "Investment & Business Opportunities | Feel Great - Join as Partner";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", isAr
      ? "اكتشف فرص الاستثمار في الصحة مع Feel Great. انضم كشريك/مسوق بالعمولة واكسب دخلاً سلبياً من 500$ إلى 50,000$+ شهرياً. متاح في أمريكا وكندا وأوروبا."
      : "Discover health investment opportunities with Feel Great. Join as affiliate/partner and earn passive income from $500 to $50,000+ monthly. Available in USA, Canada & Europe.");
  }, [isAr]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isAr ? "فرص الاستثمار والأعمال" : "Investment & Business Opportunities",
            description: isAr
              ? "اكتشف فرص الاستثمار في الصحة مع Feel Great. انضم كشريك ومسوق بالعمولة."
              : "Discover health investment opportunities with Feel Great. Join as affiliate/partner.",
            url: "https://feelgreat.us.com/business-opportunity",
            isPartOf: { "@type": "WebSite", name: "Feel Great", url: "https://feelgreat.us.com" },
            author: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
            },
            about: {
              "@type": "Thing",
              name: "Unicity Network Marketing Business Opportunity",
            },
            offers: {
              "@type": "Offer",
              price: "99",
              priceCurrency: "USD",
              description: isAr
                ? "اشتراك شهري للبدء كشريك Unicity"
                : "Monthly subscription to start as Unicity partner",
            },
          }),
        }}
      />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-6 inline-block">Feel Great</Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {isAr ? "متاح في أمريكا، كندا، وأوروبا" : "Available in USA, Canada & Europe"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {isAr ? <>فرص الاستثمار والأعمال<br /><span className="text-amber-400">في صناعة الصحة العالمية</span></> : <>Investment & Business Opportunities<br /><span className="text-amber-400">in the Global Health Industry</span></>}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            {isAr
              ? "انضم لآلاف الشركاء الذين يبنون دخلاً ذا معنى بينما يساعدون الآخرين على تحقيق صحة مستدامة. فرصة مثالية للمسوقين بالعمولة، المؤثرين، ورواد الأعمال."
              : "Join thousands of partners building meaningful income while helping others achieve sustainable health. Perfect for affiliates, influencers, and entrepreneurs."}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-amber-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-3 shadow-lg shadow-amber-400/25"
            >
              {isAr ? "ابدأ الآن - اشترك كشريك" : "Start Now - Join as Partner"} <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#articles"
              className="px-10 py-5 bg-slate-800 text-white font-medium text-lg rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 inline-flex items-center justify-center gap-3"
            >
              {isAr ? "اقرأ مقالات الاستثمار" : "Read Investment Articles"} <BookOpen className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Why This Is Different */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isAr ? "لماذا هذه الفرصة مختلفة؟" : "Why This Opportunity Is Different"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, title: isAr ? "بدون مخزون" : "No Inventory", desc: isAr ? "لا حاجة لشراء أو تخزين المنتجات" : "No need to buy or store products" },
              { icon: Globe, title: isAr ? "عمل من أي مكان" : "Work From Anywhere", desc: isAr ? "100% عن بُعد - أي مكان فيه إنترنت" : "100% remote - anywhere with internet" },
              { icon: Clock, title: isAr ? "جدول مرن" : "Flexible Schedule", desc: isAr ? "جزء من الوقت أو كاملاً - قرارك" : "Part-time or full-time - your choice" },
              { icon: Users, title: isAr ? "بناء فريق" : "Team Building", desc: isAr ? "اربح من نجاح فريقك وعمولات القيادة" : "Earn from team success & leadership bonuses" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-amber-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Articles Section */}
        <div id="articles" className="mb-16 scroll-mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isAr ? "مقالات فرص الاستثمار والأعمال" : "Investment & Business Opportunity Articles"}
              </h2>
              <p className="text-slate-400 mt-2">
                {isAr ? "تعلم كيف تبني دخلاً سلبياً مع Feel Great" : "Learn how to build passive income with Feel Great"}
              </p>
            </div>
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-400 transition-colors items-center gap-2"
            >
              {isAr ? "انضم الآن" : "Join Now"} <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentArticles.map((article) => (
              <a
                key={article.slug}
                href={`/health/${article.slug}`}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-amber-400/30 transition-all hover:shadow-lg hover:shadow-amber-400/5"
              >
                <div className={`h-2 bg-gradient-to-r ${article.color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${article.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <article.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-400 transition-colors">
                    {isAr ? article.titleAr : article.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {isAr ? article.descAr : article.desc}
                  </p>
                  <div className="mt-4 text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isAr ? "اقرأ المزيد" : "Read More"} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Income Levels */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isAr ? "مستويات دخل الشركاء" : "Partner Income Levels"}
          </h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            {isAr
              ? "اربح من 500$ إلى 50,000$+ شهرياً حسب مستوى نشاطك واستثمارك. النتائج الفردية تختلف."
              : "Earn from $500 to $50,000+ monthly based on your activity level and investment. Individual results vary."}
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { level: isAr ? "مبتدئ" : "Starter", income: "$500-$2,000", time: isAr ? "5-10 ساعات/أسبوع" : "5-10 hrs/week", color: "border-slate-600", bg: "bg-slate-700/30" },
              { level: isAr ? "بناء" : "Builder", income: "$2,000-$5,000", time: isAr ? "10-15 ساعة/أسبوع" : "10-15 hrs/week", color: "border-blue-500/50", bg: "bg-blue-500/10" },
              { level: isAr ? "قائد" : "Leader", income: "$5,000-$15,000", time: isAr ? "15-25 ساعة/أسبوع" : "15-25 hrs/week", color: "border-purple-500/50", bg: "bg-purple-500/10" },
              { level: isAr ? "تنفيذي" : "Executive", income: "$15,000-$50,000+", time: isAr ? "دوام كامل" : "Full-time", color: "border-amber-400/50", bg: "bg-amber-400/10" },
            ].map((tier, i) => (
              <div key={i} className={`${tier.bg} border ${tier.color} rounded-xl p-5 text-center`}>
                <p className="text-sm text-slate-400 mb-1">{tier.level}</p>
                <p className="text-xl font-bold text-amber-400 mb-2">{tier.income}/mo</p>
                <p className="text-xs text-slate-500">{tier.time}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-xs mt-6">
            *{isAr ? "مستويات الدخل توضيحية ومبنية على نشاط الشركاء. النتائج الفردية تختلف." : "Income levels are illustrative and based on partner activity. Individual results vary."}
          </p>
        </div>

        {/* Key Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: DollarSign, title: isAr ? "دخل متكرر" : "Recurring Income", desc: isAr ? "بناء إيرادات شهرية متكررة من اشتراكات منتجات الصحة" : "Build monthly recurring revenue from health product subscriptions" },
            { icon: TrendingUp, title: isAr ? "نمو غير محدود" : "Unlimited Growth", desc: isAr ? "لا سقف للدخل. كبار الشركاء يكسبون 10,000$-50,000$+ شهرياً" : "No income ceiling. Top partners earn $10,000-$50,000+ monthly" },
            { icon: Star, title: isAr ? "مجتمع عالمي" : "Global Community", desc: isAr ? "30+ دولة مع مجتمع داعم من رواد الأعمال الصحيين" : "30+ countries with supportive community of health entrepreneurs" },
          ].map((benefit, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-400/30 transition-colors">
              <benefit.icon className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-slate-400 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isAr ? "قصص نجاح الشركاء" : "Partner Success Stories"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.location}</p>
                    <p className="text-emerald-400 text-sm font-medium">{testimonial.income}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
          {[
            { value: "10,000+", label: isAr ? "شريك نشط" : "Active Partners" },
            { value: "30+", label: isAr ? "دولة" : "Countries" },
            { value: "$50M+", label: isAr ? "مدفوع للشركاء" : "Paid to Partners" },
            { value: "25+ yrs", label: isAr ? "تاريخ الشركة" : "Company History" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Who Is This For */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isAr ? "لمن هذه الفرصة؟" : "Who Is This Opportunity For?"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              isAr ? "المؤثرون في مجال الصحة واللياقة" : "Health & fitness influencers",
              isAr ? "المسوقون بالعمولة يبحثون عن منتجات عالية التحويل" : "Affiliates looking for high-converting products",
              isAr ? "رواد الأعمال يبحثون عن عمل مرن من المنزل" : "Entrepreneurs looking for flexible home business",
              isAr ? "أي شخص يريد دخلاً سلبياً إضافياً" : "Anyone wanting extra passive income",
              isAr ? "خبراء التغذية والمعالجون" : "Nutritionists and wellness practitioners",
              isAr ? "الأمهات والآباء الذين يحتاجون مرونة" : "Parents needing flexibility",
              isAr ? "المحترفون الذين يبحثون عن تدفق دخل ثانٍ" : "Professionals seeking a second income stream",
              isAr ? "المستثمرون على المدى الطويل" : "Long-term investors",
              isAr ? "المتقاعدون الذين يريدون البقاء نشطين" : "Retirees wanting to stay active",
            ].map((person, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-sm">{person}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-5xl shrink-0">
              F
            </div>
            <div className="text-center md:text-start">
              <h2 className="text-2xl font-bold mb-2">{isAr ? "مرشدك في هذه الرحلة" : "Your Mentor on This Journey"}</h2>
              <p className="text-2xl font-semibold text-amber-400 mb-1">Feras Al-Ayed</p>
              <p className="text-slate-400 mb-2">Presidential Sapphire Leader</p>
              <p className="text-slate-500 text-sm mb-4">
                {isAr
                  ? "أخصائي تغذية علاجية وسلوكية • 15+ سنوات في صناعة الصحة والعافية"
                  : "Therapeutic & Behavioral Nutrition Specialist • 15+ years in health & wellness"}
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-1">
                  Instagram
                </a>
                <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-1">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-12">
          <Award className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isAr ? "هل أنت مستعد للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            {isAr
              ? "انضم اليوم واحصل على تدريب مجاني ودعم من فريق متخصص. لا حاجة لخبرة سابقة."
              : "Join today and get free training and support from an experienced team. No prior experience needed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 bg-amber-400 text-slate-900 font-bold text-xl rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-3 shadow-lg shadow-amber-400/25"
            >
              {isAr ? "اشترك الآن - ابدأ بناء عملك" : "Join Now - Start Building Your Business"} <ArrowRight className="w-6 h-6" />
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            {isAr
              ? "✓ تسجيل مجاني  •  ✓ تدريب مجاني  •  ✓ لا حاجة لمخزون"
              : "✓ Free signup  •  ✓ Free training  •  ✓ No inventory required"}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>
            {isAr
              ? "© 2024 Feel Great by Feras Al-Ayed. جميع الحقوق محفوظة."
              : "© 2024 Feel Great by Feras Al-Ayed. All rights reserved."}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              {isAr ? "شروط الاستخدام" : "Terms of Use"}
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              {isAr ? "اتصل بنا" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}