import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const faqData: Record<string, { category: string; questions: { q: string; a: string }[] }[]> = {
  ar: [
    {
      category: "عن برنامج Feel Great",
      questions: [
        {
          q: "ما هو برنامج Feel Great؟",
          a: "برنامج Feel Great هو نظام صحي بسيط يتكون من منتجين: يونيميت (Unimate) في الصباح وبالانس (Balance) قبل أكبر وجبتين. يدعم الصيام المتقطع بطريقة 4-4-12 دون الحاجة لحمية صارمة أو تمارين مكثفة."
        },
        {
          q: "كيف يعمل البرنامج؟",
          a: "يونيميت يُشرب صباحاً لتعزيز الطاقة والتركيز الذهني. بالانس يُشرب قبل 10-15 دقيقة من وجبتي الغداء والعشاء لدعم الشبع وصحة مستويات السكر والكوليسترول. النظام يدعم طريقة الصيام المتقطع 4-4-12."
        },
        {
          q: "هل البرنامج آمن؟",
          a: "نعم، المنتجات مدعومة بأكثر من 50 دراسة علمية. يونيميت حاصل على شهادة Informed-Sport (خالي من المواد المحظورة). المنتجات مناسبة لمعظم البالغين. يُنصح باستشارة الطبيب لمن لديهم حالات صحية خاصة."
        },
        {
          q: "متى أرى النتائج؟",
          a: "معظم المستخدمين يلاحظون تحسناً في الطاقة والتركيز من الأسبوع الأول. النتائج الكاملة تظهر عادة خلال 90 يوماً مع الالتزام المستمر. النتائج تختلف من شخص لآخر."
        },
        {
          q: "هل يناسب مرضى السكري؟",
          a: "المنتجات تدعم مستويات السكر الصحية. يُنصح بشدة باستشارة الطبيب قبل البدء ومراقبة مستويات السكر بانتظام. لا نزعم أن المنتجات تعالج أي مرض."
        },
      ]
    },
    {
      category: "عن المنتجات",
      questions: [
        {
          q: "ما هو يونيميت (Unimate)؟",
          a: "يونيميت هو مستخلص يربا ماتي مركّز يمر بعملية تنقية حاصلة على براءة اختراع من 5 خطوات. يحتوي على 375 ضعف حمض الكلوروجينيك مقارنة بمشروبات يربا ماتي الأخرى، و3 أضعاف الثيوبرومين الموجود في الشوكولاتة الداكنة. فقط 10 سعرات حرارية."
        },
        {
          q: "ما هو بالانس (Balance)؟",
          a: "بالانس هو مشروب ألياف ذكية بتركيبة Biosphere Fiber الحاصلة على براءة اختراع. يحتوي على 5 أنواع من الألياف القابلة للذوبان التي تشكل جلاً سميكاً يبطئ إفراغ المعدة ويعزز الشبع. 15 سعرة حرارية فقط، متوفر بنكهة البرتقال والتوت المشكل."
        },
        {
          q: "هل يونيميت يكسر الصيام؟",
          a: "لا، يونيميت لا يكسر الصيام المتقطع. يحتوي فقط على 10 سعرات حرارية ولا يحفز إفراز الأنسولين."
        },
        {
          q: "هل المنتجات خالية من السكر؟",
          a: "نعم، كلا المنتجين خاليان من السكر المضاف. يونيميت مناسب لحمية الكيتو والحميات منخفضة الكربوهيدرات."
        },
      ]
    },
    {
      category: "فرصة العمل",
      questions: [
        {
          q: "كيف أنضم كشريك؟",
          a: "الانضمام مجاني تماماً كعضو. تحصل على نفس خصومات الموزعين. عندما تحيل آخرين، تكسب رصيد منتجات. يمكنك الترقية لموزع لكسب عمولات تصل إلى 25% على جميع نقاط الأعضاء."
        },
        {
          q: "هل هذا تسويق هرمي؟",
          a: "لا. يونيسيتي شركة عالمية شرعية تعمل في أكثر من 50 دولة منذ أكثر من 30 عاماً. الأرباح تأتي من بيع منتجات حقيقية مدعومة علمياً يحبها الناس، وليس من التجنيد فقط."
        },
        {
          q: "هل أحتاج خبرة سابقة؟",
          a: "لا أبداً. يونيسيتي توفر تدريباً كاملاً وأدوات تسويقية وسيرشدك كفيلك. نظام العضوية مصمم ليبدأ أي شخص بسهولة."
        },
        {
          q: "كم يمكنني أن أكسب؟",
          a: "الأرباح تعتمد على جهدك والتزامك. كعضو تكسب رصيد منتجات (حتى 30$ سنوياً). كموزع تكسب عمولات على مبيعات فريقك. النتائج تختلف ولا نضمن دخلاً محدداً."
        },
        {
          q: "ما هي سياسة الإرجاع؟",
          a: "نقدم ضمان استرداد كامل خلال 60 يوماً لمنتجات Feel Great للعملاء. إذا لم تكن راضياً، أرسل طلباً مكتوباً مع إرجاع الأجزاء غير المستخدمة. الاسترداد يتم على نفس طريقة الدفع الأصلية."
        },
      ]
    },
  ],
  en: [
    {
      category: "About Feel Great Program",
      questions: [
        {
          q: "What is the Feel Great program?",
          a: "Feel Great is a simple 2-product wellness system: Unimate in the morning and Balance before your 2 biggest meals. It supports the 4-4-12 intermittent fasting method without requiring strict diets or intense exercise."
        },
        {
          q: "How does the program work?",
          a: "Unimate is taken in the morning to support mental clarity and healthy energy levels. Balance is taken 10-15 minutes before lunch and dinner to promote satiety and support healthy glucose and cholesterol levels. The system supports the 4-4-12 intermittent fasting approach."
        },
        {
          q: "Is the program safe?",
          a: "Yes, the products are backed by 50+ scientific studies. Unimate is Informed-Sport certified (tested for banned substances). Suitable for most adults. Consult your healthcare provider if you have specific health conditions."
        },
        {
          q: "When will I see results?",
          a: "Most users notice improvements in energy and focus within the first week. Full results typically appear within 90 days of consistent use. Individual results may vary."
        },
        {
          q: "Is it suitable for diabetics?",
          a: "The products support healthy blood sugar levels already in normal range. We strongly recommend consulting your doctor before starting and monitoring blood sugar regularly. We do not claim the products treat any disease."
        },
      ]
    },
    {
      category: "About the Products",
      questions: [
        {
          q: "What is Unimate?",
          a: "Unimate is a concentrated yerba mate extract processed through a patented 5-step purification process. It contains up to 375x more chlorogenic acids than other yerba mate drinks, and 3x the theobromine of dark chocolate. Only 10 calories per serving."
        },
        {
          q: "What is Balance?",
          a: "Balance is a smart fiber drink with the patented Biosphere Fiber formula. It contains 5 types of soluble fiber that form a thick gel to slow stomach emptying and promote satiety. Only 15 calories, available in Orange and Mixed Berry flavors."
        },
        {
          q: "Does Unimate break my fast?",
          a: "No, Unimate does not break intermittent fasting. It contains only 10 calories and does not trigger insulin release."
        },
        {
          q: "Are the products sugar-free?",
          a: "Yes, both products contain zero added sugar. Unimate is suitable for keto and low-carb diets."
        },
      ]
    },
    {
      category: "Business Opportunity",
      questions: [
        {
          q: "How do I join as a partner?",
          a: "Joining is completely FREE as a Member. You get the same product discounts as distributors. When you refer others, you earn product credit. You can upgrade to Distributor to earn up to 25% commission on all member points."
        },
        {
          q: "Is this a pyramid scheme?",
          a: "No. Unicity is a legitimate global company operating in 50+ countries for over 30 years. Earnings come from selling real, science-backed products people love, not from recruitment alone."
        },
        {
          q: "Do I need prior experience?",
          a: "Not at all. Unicity provides full training, marketing tools, and your sponsor will guide you. The membership program is designed so anyone can start easily."
        },
        {
          q: "How much can I earn?",
          a: "Earnings depend on your effort and consistency. As a Member, you earn product credit (up to $30/year). As a Distributor, you earn commissions on your team's sales. Results vary and no specific income is guaranteed."
        },
        {
          q: "What is the return policy?",
          a: "We offer a full money-back guarantee within 60 days for Feel Great products for customers. If unsatisfied, submit a written request with unused portions returned. Refund issued to original payment method."
        },
      ]
    },
  ],
  fr: [
    {
      category: "À propos du programme Feel Great",
      questions: [
        {
          q: "Qu'est-ce que le programme Feel Great ?",
          a: "Feel Great est un système de bien-être simple à 2 produits : Unimate le matin et Balance avant vos 2 plus gros repas. Il soutient la méthode de jeûne intermittent 4-4-12 sans régime strict ni exercice intense."
        },
        {
          q: "Le programme est-il sûr ?",
          a: "Oui, les produits sont soutenus par plus de 50 études scientifiques. Unimate est certifié Informed-Sport. Convient à la plupart des adultes. Consultez votre médecin si vous avez des conditions de santé spécifiques."
        },
        {
          q: "Comment rejoindre en tant que partenaire ?",
          a: "L'adhésion est totalement GRATUITE en tant que Membre. Vous obtenez les mêmes réductions que les distributeurs. Quand vous parrainez d'autres personnes, vous gagnez du crédit produit. Vous pouvez passer Distributeur pour gagner jusqu'à 25% de commission."
        },
      ]
    },
  ],
  es: [
    {
      category: "Sobre el programa Feel Great",
      questions: [
        {
          q: "¿Qué es el programa Feel Great?",
          a: "Feel Great es un sistema de bienestar simple de 2 productos: Unimate por la mañana y Balance antes de tus 2 comidas más grandes. Apoya el método de ayuno intermitente 4-4-12 sin dietas estrictas ni ejercicio intenso."
        },
        {
          q: "¿Es seguro el programa?",
          a: "Sí, los productos están respaldados por más de 50 estudios científicos. Unimate tiene certificación Informed-Sport. Apto para la mayoría de adultos. Consulte a su médico si tiene condiciones de salud específicas."
        },
        {
          q: "¿Cómo me uno como socio?",
          a: "Unirse es completamente GRATIS como Miembro. Obtienes los mismos descuentos que los distribuidores. Cuando refieres a otros, ganas crédito de producto. Puedes ascender a Distribuidor para ganar hasta 25% de comisión."
        },
      ]
    },
  ],
  de: [
    {
      category: "Über das Feel Great Programm",
      questions: [
        {
          q: "Was ist das Feel Great Programm?",
          a: "Feel Great ist ein einfaches 2-Produkt-Wellness-System: Unimate am Morgen und Balance vor den 2 größten Mahlzeiten. Es unterstützt die 4-4-12 intermittierende Fastenmethode ohne strenge Diäten oder intensives Training."
        },
        {
          q: "Ist das Programm sicher?",
          a: "Ja, die Produkte werden durch über 50 wissenschaftliche Studien gestützt. Unimate ist Informed-Sport zertifiziert. Geeignet für die meisten Erwachsenen. Konsultieren Sie Ihren Arzt bei spezifischen Gesundheitszuständen."
        },
        {
          q: "Wie werde ich Partner?",
          a: "Der Beitritt ist als Mitglied völlig KOSTENLOS. Sie erhalten die gleichen Rabatte wie Distributoren. Wenn Sie andere empfehlen, verdienen Sie Produktguthaben. Sie können zum Distributor aufsteigen und bis zu 25% Provision verdienen."
        },
      ]
    },
  ],
  tr: [
    {
      category: "Feel Great Programı Hakkında",
      questions: [
        {
          q: "Feel Great programı nedir?",
          a: "Feel Great, basit 2 ürünlü bir sağlık sistemidir: Sabah Unimate ve en büyük 2 öğününüzden önce Balance. Sıkı diyet veya yoğun egzersiz gerektirmeden 4-4-12 aralıklı oruç yöntemini destekler."
        },
        {
          q: "Program güvenli mi?",
          a: "Evet, ürünler 50'den fazla bilimsel çalışma ile desteklenmektedir. Unimate, Informed-Sport sertifikalıdır. Çoğu yetişkin için uygundur. Özel sağlık durumlarınız varsa doktorunuza danışın."
        },
        {
          q: "Nasıl ortak olabilirim?",
          a: "Üye olarak katılmak tamamen ÜCRETSİZDİR. Distribütörlerle aynı indirimleri alırsınız. Başkalarını yönlendirdiğinizde ürün kredisi kazanırsınız. %25'e kadar komisyon kazanmak için Distribütöre yükselebilirsiniz."
        },
      ]
    },
  ],
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-start bg-card hover:bg-accent/5 transition-colors"
      >
        <span className="font-semibold text-foreground text-base pe-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-2 bg-card/50">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { lang, t, dir } = useLanguage();
  const currentFaq = faqData[lang] ?? faqData.en;

  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  // SEO: Set page title and meta description
  useEffect(() => {
    const title = lang === "ar" ? "الأسئلة الشائعة - Feel Great Partner" : "FAQ - Feel Great Partner";
    const description = lang === "ar"
      ? "إجابات على أكثر الأسئلة شيوعاً حول برنامج Feel Great من يونيسيتي - المنتجات، فرصة العمل، سياسة الإرجاع"
      : "Answers to frequently asked questions about the Feel Great program by Unicity - products, business opportunity, return policy";
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', description);
    if (!document.querySelector('meta[name="description"]')) document.head.appendChild(metaDesc);
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://feelgreat.us.com/faq');
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);

    // FAQ JSON-LD Structured Data
    const allQuestions = currentFaq.flatMap(cat => cat.questions);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allQuestions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      }))
    };
    let script = document.querySelector('#faq-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      script?.remove();
    };
  }, [lang, currentFaq]);

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/5 to-background py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <BackArrow className="w-4 h-4" />
              {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {lang === "ar" ? "الأسئلة الشائعة" :
             lang === "fr" ? "Questions Fréquentes" :
             lang === "es" ? "Preguntas Frecuentes" :
             lang === "de" ? "Häufige Fragen" :
             lang === "tr" ? "Sık Sorulan Sorular" :
             "Frequently Asked Questions"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "ar" ? "إجابات على أكثر الأسئلة شيوعاً حول برنامج Feel Great وفرصة العمل مع يونيسيتي" :
             lang === "fr" ? "Réponses aux questions les plus fréquentes sur Feel Great et l'opportunité Unicity" :
             lang === "es" ? "Respuestas a las preguntas más frecuentes sobre Feel Great y la oportunidad Unicity" :
             lang === "de" ? "Antworten auf die häufigsten Fragen zu Feel Great und der Unicity-Geschäftsmöglichkeit" :
             lang === "tr" ? "Feel Great ve Unicity iş fırsatı hakkında en sık sorulan sorulara yanıtlar" :
             "Answers to the most common questions about Feel Great and the Unicity business opportunity"}
          </p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="container max-w-4xl mx-auto px-4 pb-20">
        {currentFaq.map((category, catIdx) => (
          <section key={catIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full"></span>
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, qIdx) => (
                <FAQItem key={qIdx} question={item.q} answer={item.a} />
              ))}
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-10">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {lang === "ar" ? "لم تجد إجابتك؟" :
             lang === "fr" ? "Vous n'avez pas trouvé votre réponse ?" :
             lang === "es" ? "¿No encontraste tu respuesta?" :
             lang === "de" ? "Keine Antwort gefunden?" :
             lang === "tr" ? "Cevabınızı bulamadınız mı?" :
             "Didn't find your answer?"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" ? "تحدث مع مساعدنا الذكي أو سجّل مباشرة" :
             lang === "fr" ? "Parlez à notre assistant IA ou inscrivez-vous directement" :
             lang === "es" ? "Habla con nuestro asistente IA o regístrate directamente" :
             lang === "de" ? "Sprechen Sie mit unserem KI-Assistenten oder registrieren Sie sich direkt" :
             lang === "tr" ? "Yapay zeka asistanımızla konuşun veya doğrudan kaydolun" :
             "Chat with our AI assistant or register directly"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                {lang === "ar" ? "تحدث مع المساعد" : "Chat with Assistant"}
              </Button>
            </Link>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="min-w-[180px] bg-primary hover:bg-primary/90">
                {lang === "ar" ? "سجّل الآن" :
                 lang === "fr" ? "Inscrivez-vous" :
                 lang === "es" ? "Regístrese ahora" :
                 lang === "de" ? "Jetzt registrieren" :
                 lang === "tr" ? "Şimdi kaydolun" :
                 "Register Now"}
              </Button>
            </a>
          </div>
        </div>
        {/* Cross-links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold text-foreground mb-4">{lang === "ar" ? "صفحات مفيدة" : "Useful Pages"}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "كن شريكاً" : "Become a Partner"}</a>
            <a href="/founder" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "عن المؤسس" : "About the Founder"}</a>
            <a href="/blog" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "المدونة" : "Blog"}</a>
            <a href="/blog?category=insulin-resistance" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{lang === "ar" ? "مقاومة الإنسولين" : "Insulin Resistance"}</a>
          </div>
        </div>
      </main>
      <a
        href="https://wa.me/96877020770?text=Hi%2C%20I%27m%20interested%20in%20Feel%20Great"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );
}
