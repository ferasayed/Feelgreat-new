import { useLanguage } from "@/contexts/LanguageContext";

const content: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: يونيو 2026",
    sections: [
      { heading: "مقدمة", body: "نحن في منصة فراس العايد (\"المنصة\") نلتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدامك لموقعنا وخدماتنا." },
      { heading: "المعلومات التي نجمعها", body: "نجمع المعلومات التالية: الاسم الكامل، رقم الواتساب، البريد الإلكتروني (اختياري)، الدولة (اختياري)، بيانات التصفح (ملفات تعريف الارتباط، عنوان IP)، والمحادثات مع المساعد الذكي. نجمع هذه المعلومات عند تسجيلك أو تواصلك معنا." },
      { heading: "كيف نستخدم معلوماتك", body: "نستخدم معلوماتك لـ: التواصل معك بخصوص خدماتنا، تقديم استشارات صحية مخصصة، تحسين تجربتك على الموقع، إرسال محتوى تعليمي ذي صلة، وتحليل أداء الموقع. لن نبيع أو نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية." },
      { heading: "ملفات تعريف الارتباط (Cookies)", body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك، تتبع الزيارات عبر Google Analytics، وتفعيل بكسلات إعادة الاستهداف (Meta، TikTok، Snapchat). يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك." },
      { heading: "حماية البيانات", body: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. نستخدم تشفير SSL لجميع البيانات المنقولة." },
      { heading: "حقوقك", body: "لديك الحق في: الوصول إلى بياناتك الشخصية، طلب تصحيح أو حذف بياناتك، الانسحاب من القوائم البريدية في أي وقت، وطلب نسخة من بياناتك. للاستفسار، تواصل معنا عبر واتساب: +968 7702 0770." },
      { heading: "التغييرات على هذه السياسة", body: "قد نحدّث هذه السياسة من وقت لآخر. سننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ \"آخر تحديث\"." },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: June 2026",
    sections: [
      { heading: "Introduction", body: "At the Feras Alayed platform (\"Platform\"), we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our website and services." },
      { heading: "Information We Collect", body: "We collect the following information: full name, WhatsApp number, email address (optional), country (optional), browsing data (cookies, IP address), and conversations with our AI assistant. We collect this information when you register or communicate with us." },
      { heading: "How We Use Your Information", body: "We use your information to: communicate with you about our services, provide personalized health consultations, improve your website experience, send relevant educational content, and analyze website performance. We will not sell or share your information with third parties for marketing purposes." },
      { heading: "Cookies", body: "We use cookies to improve your experience, track visits via Google Analytics, and enable retargeting pixels (Meta, TikTok, Snapchat). You can disable cookies from your browser settings." },
      { heading: "Data Protection", body: "We take appropriate security measures to protect your information from unauthorized access, modification, disclosure, or destruction. We use SSL encryption for all transmitted data." },
      { heading: "Your Rights", body: "You have the right to: access your personal data, request correction or deletion of your data, opt out of mailing lists at any time, and request a copy of your data. For inquiries, contact us via WhatsApp: +968 7702 0770." },
      { heading: "Changes to This Policy", body: "We may update this policy from time to time. Any changes will be posted on this page with an updated \"Last Updated\" date." },
    ],
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{c.title}</h1>
        <p className="text-white/40 text-sm mb-12">{c.lastUpdated}</p>
        <div className="space-y-8">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-white/90 mb-3">{s.heading}</h2>
              <p className="text-white/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
