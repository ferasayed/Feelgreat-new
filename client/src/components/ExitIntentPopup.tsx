import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ExitIntentPopup() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const hasShown = useRef(false);
  const registerLead = trpc.leads.register.useMutation();

  useEffect(() => {
    // Check if popup was already shown in this session
    if (sessionStorage.getItem('exitPopupShown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown.current) {
        hasShown.current = true;
        setShow(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Also trigger on mobile after 45 seconds of inactivity or scroll-up behavior
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (hasShown.current) return;
      const currentScrollY = window.scrollY;
      // If user scrolls up significantly after scrolling down at least 50% of page
      if (currentScrollY < lastScrollY - 200 && lastScrollY > window.innerHeight * 0.5) {
        hasShown.current = true;
        setShow(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
      lastScrollY = currentScrollY;
    };

    // Delay adding listeners to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 10000); // Wait 10 seconds before enabling exit intent

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await registerLead.mutateAsync({
        fullName: name,
        email,
        phone: whatsapp || '',
        country: '',
        source: 'exit-intent-guide',
      });
      setSubmitted(true);
      toast.success(isAr ? 'تم إرسال الدليل!' : 'Guide sent!');
    } catch {
      toast.error(isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.');
    }
  };

  if (!show) return null;

  const signs = isAr ? [
    'التعب المستمر بعد الوجبات',
    'صعوبة فقدان الوزن رغم الحمية',
    'الرغبة الشديدة في السكريات',
    'بقع داكنة على الجلد',
    'تراكم الدهون حول البطن',
    'ضبابية الدماغ وصعوبة التركيز',
    'اضطرابات النوم والشخير',
  ] : [
    'Persistent fatigue after meals',
    'Difficulty losing weight despite dieting',
    'Intense sugar and carb cravings',
    'Dark skin patches (Acanthosis Nigricans)',
    'Belly fat accumulation',
    'Brain fog and difficulty concentrating',
    'Sleep disturbances and snoring',
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShow(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-500/20 to-amber-500/20 p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isAr ? 'انتظر! قبل أن تغادر...' : 'Wait! Before you leave...'}
              </h2>
            </div>
          </div>
          <p className="text-white/80 text-sm">
            {isAr
              ? 'احصل على دليلنا المجاني: "7 علامات خفية لمقاومة الأنسولين" — قد تكون لديك دون أن تعرف.'
              : 'Get our free guide: "7 Hidden Signs of Insulin Resistance" — you might have it without knowing.'
            }
          </p>
        </div>

        {!submitted ? (
          <div className="p-6 space-y-4">
            {/* Signs preview */}
            <div className="space-y-2">
              {signs.slice(0, 4).map((sign, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{sign}</span>
                </div>
              ))}
              <p className="text-amber-400 text-sm font-medium ps-6">
                {isAr ? `+ ${signs.length - 4} علامات أخرى في الدليل...` : `+ ${signs.length - 4} more signs in the guide...`}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <Input
                placeholder={isAr ? 'الاسم' : 'Your Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-white/40"
              />
              <Input
                type="email"
                placeholder={isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-white/40"
              />
              <Input
                placeholder={isAr ? 'رقم واتساب (اختياري)' : 'WhatsApp Number (optional)'}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-white/40"
              />
              <Button
                type="submit"
                disabled={registerLead.isPending}
                className="w-full gradient-gold text-foreground font-bold py-5 text-base"
              >
                {registerLead.isPending
                  ? (isAr ? 'جاري الإرسال...' : 'Sending...')
                  : (isAr ? 'أرسل لي الدليل المجاني' : 'Send Me the Free Guide')
                }
                <Download className="w-4 h-4 ms-2" />
              </Button>
              <p className="text-white/40 text-xs text-center">
                {isAr ? 'لن نشارك بياناتك مع أي طرف ثالث.' : 'We will never share your data with third parties.'}
              </p>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'تم بنجاح!' : 'Success!'}
            </h3>
            <p className="text-white/70">
              {isAr
                ? 'سيصلك الدليل على بريدك الإلكتروني قريباً. في هذه الأثناء، يمكنك إجراء تقييم مقاومة الأنسولين المجاني.'
                : 'The guide will be sent to your email shortly. In the meantime, you can take our free insulin resistance assessment.'
              }
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a href="/calculators">
                <Button className="w-full gradient-gold text-foreground font-bold">
                  {isAr ? 'إجراء التقييم المجاني' : 'Take Free Assessment'}
                </Button>
              </a>
              <Button variant="outline" onClick={() => setShow(false)} className="w-full border-slate-600 text-white/70 hover:bg-slate-700">
                {isAr ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
