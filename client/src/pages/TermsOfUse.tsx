import { useLanguage } from "@/contexts/LanguageContext";

const content: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  ar: {
    title: "شروط الاستخدام",
    lastUpdated: "آخر تحديث: يونيو 2026",
    sections: [
      { heading: "القبول بالشروط", body: "باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع." },
      { heading: "طبيعة الخدمة", body: "هذا الموقع يقدم محتوى تعليمي وتثقيفي حول التغذية السلوكية والصحة المستدامة. المعلومات المقدمة هنا لأغراض تعليمية فقط ولا تُعد بديلاً عن الاستشارة الطبية المتخصصة. يجب استشارة طبيبك قبل البدء بأي برنامج غذائي أو صحي جديد." },
      { heading: "منهج فراس العايد™", body: "Feras Alayed Method™ هو برنامج تدريب شخصي في التغذية السلوكية وتغيير نمط الحياة. لا يُقدَّم كعلاج طبي أو نظام حصري من أي شركة مصنعة. المنتجات المستخدمة (مثل Feel Great) هي أدوات داعمة ضمن المنهج وليست المنهج نفسه." },
      { heading: "المنتجات والشراء", body: "المنتجات المذكورة في هذا الموقع تُباع من خلال Unicity International. عمليات الشراء تتم عبر موقع ufeelgreat.com وتخضع لشروط وسياسات Unicity International بما في ذلك سياسة الاسترداد خلال 60 يوماً." },
      { heading: "إخلاء المسؤولية الصحية", body: "النتائج تختلف من شخص لآخر. لا نضمن نتائج محددة. المعلومات المقدمة لا تهدف إلى تشخيص أو علاج أو الوقاية من أي مرض. استشر طبيبك دائماً قبل إجراء تغييرات على نظامك الغذائي أو الصحي." },
      { heading: "الملكية الفكرية", body: "جميع المحتويات على هذا الموقع بما في ذلك النصوص والصور والتصاميم والشعارات هي ملكية فكرية لمنصة فراس العايد. يُحظر نسخ أو إعادة نشر أي محتوى دون إذن كتابي مسبق." },
      { heading: "فرصة الشراكة", body: "فرصة الشراكة المقدمة هي فرصة عمل مستقلة مع Unicity International. النتائج المالية تعتمد على الجهد الفردي ولا نضمن دخلاً محدداً. يرجى مراجعة خطة التعويضات الرسمية من Unicity." },
      { heading: "تعديل الشروط", body: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. التعديلات تصبح سارية فور نشرها على هذه الصفحة." },
      { heading: "التواصل", body: "لأي استفسارات حول هذه الشروط، تواصل معنا عبر واتساب: +968 7702 0770 أو عبر البريد الإلكتروني: amegoooo@live.com" },
    ],
  },
  en: {
    title: "Terms of Use",
    lastUpdated: "Last Updated: June 2026",
    sections: [
      { heading: "Acceptance of Terms", body: "By using this website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use the website." },
      { heading: "Nature of Service", body: "This website provides educational content about behavioral nutrition and sustainable health. The information provided here is for educational purposes only and is not a substitute for professional medical advice. Consult your doctor before starting any new dietary or health program." },
      { heading: "Feras Alayed Method™", body: "The Feras Alayed Method™ is a personal coaching program in behavioral nutrition and lifestyle change. It is not presented as medical treatment or an exclusive system from any manufacturer. Products used (such as Feel Great) are supportive tools within the method, not the method itself." },
      { heading: "Products and Purchases", body: "Products mentioned on this website are sold through Unicity International. Purchases are made via ufeelgreat.com and are subject to Unicity International's terms and policies, including a 60-day refund policy." },
      { heading: "Health Disclaimer", body: "Results vary from person to person. We do not guarantee specific results. The information provided is not intended to diagnose, treat, or prevent any disease. Always consult your doctor before making changes to your diet or health regimen." },
      { heading: "Intellectual Property", body: "All content on this website including text, images, designs, and logos are the intellectual property of the Feras Alayed platform. Copying or republishing any content without prior written permission is prohibited." },
      { heading: "Partnership Opportunity", body: "The partnership opportunity presented is an independent business opportunity with Unicity International. Financial results depend on individual effort and we do not guarantee specific income. Please review Unicity's official compensation plan." },
      { heading: "Modification of Terms", body: "We reserve the right to modify these terms at any time. Modifications become effective immediately upon posting on this page." },
      { heading: "Contact", body: "For any inquiries about these terms, contact us via WhatsApp: +968 7702 0770 or email: amegoooo@live.com" },
    ],
  },
};

export default function TermsOfUse() {
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
