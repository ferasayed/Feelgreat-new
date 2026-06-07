import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const UI_TEXT: Record<string, {
  title: string;
  subtitle: string;
  confirmBtn: string;
  processing: string;
  successTitle: string;
  successMsg: string;
  errorTitle: string;
  errorMsg: string;
  alreadyTitle: string;
  alreadyMsg: string;
  noEmail: string;
  backHome: string;
  resubscribe: string;
  resubscribeSuccess: string;
}> = {
  ar: {
    title: "إلغاء الاشتراك",
    subtitle: "هل أنت متأكد أنك تريد إلغاء اشتراكك من النشرة الأسبوعية؟",
    confirmBtn: "نعم، إلغاء الاشتراك",
    processing: "جارٍ المعالجة...",
    successTitle: "تم إلغاء الاشتراك بنجاح",
    successMsg: "لن تتلقى المزيد من رسائل النشرة الأسبوعية. نأسف لرحيلك!",
    errorTitle: "حدث خطأ",
    errorMsg: "لم نتمكن من إلغاء اشتراكك. يرجى المحاولة مرة أخرى لاحقاً.",
    alreadyTitle: "تم إلغاء الاشتراك مسبقاً",
    alreadyMsg: "هذا البريد الإلكتروني غير مشترك في النشرة الأسبوعية.",
    noEmail: "لم يتم تقديم عنوان بريد إلكتروني صالح.",
    backHome: "العودة للصفحة الرئيسية",
    resubscribe: "إعادة الاشتراك",
    resubscribeSuccess: "تم إعادة الاشتراك بنجاح!",
  },
  en: {
    title: "Unsubscribe",
    subtitle: "Are you sure you want to unsubscribe from our weekly newsletter?",
    confirmBtn: "Yes, Unsubscribe",
    processing: "Processing...",
    successTitle: "Successfully Unsubscribed",
    successMsg: "You will no longer receive our weekly newsletter emails. We're sorry to see you go!",
    errorTitle: "Something Went Wrong",
    errorMsg: "We couldn't process your unsubscribe request. Please try again later.",
    alreadyTitle: "Already Unsubscribed",
    alreadyMsg: "This email address is not currently subscribed to our newsletter.",
    noEmail: "No valid email address was provided.",
    backHome: "Back to Home",
    resubscribe: "Re-subscribe",
    resubscribeSuccess: "Successfully re-subscribed!",
  },
  fr: {
    title: "Se désabonner",
    subtitle: "Êtes-vous sûr de vouloir vous désabonner de notre newsletter hebdomadaire ?",
    confirmBtn: "Oui, se désabonner",
    processing: "Traitement en cours...",
    successTitle: "Désabonnement réussi",
    successMsg: "Vous ne recevrez plus nos emails de newsletter hebdomadaire. Nous sommes désolés de vous voir partir !",
    errorTitle: "Une erreur est survenue",
    errorMsg: "Nous n'avons pas pu traiter votre demande de désabonnement. Veuillez réessayer plus tard.",
    alreadyTitle: "Déjà désabonné",
    alreadyMsg: "Cette adresse email n'est pas actuellement abonnée à notre newsletter.",
    noEmail: "Aucune adresse email valide n'a été fournie.",
    backHome: "Retour à l'accueil",
    resubscribe: "Se réabonner",
    resubscribeSuccess: "Réabonnement réussi !",
  },
  es: {
    title: "Cancelar suscripción",
    subtitle: "¿Estás seguro de que quieres cancelar tu suscripción a nuestro boletín semanal?",
    confirmBtn: "Sí, cancelar suscripción",
    processing: "Procesando...",
    successTitle: "Suscripción cancelada exitosamente",
    successMsg: "Ya no recibirás nuestros correos del boletín semanal. ¡Lamentamos verte ir!",
    errorTitle: "Algo salió mal",
    errorMsg: "No pudimos procesar tu solicitud de cancelación. Por favor, inténtalo de nuevo más tarde.",
    alreadyTitle: "Ya cancelada",
    alreadyMsg: "Esta dirección de correo no está actualmente suscrita a nuestro boletín.",
    noEmail: "No se proporcionó una dirección de correo válida.",
    backHome: "Volver al inicio",
    resubscribe: "Volver a suscribirse",
    resubscribeSuccess: "¡Suscripción renovada exitosamente!",
  },
  de: {
    title: "Abmelden",
    subtitle: "Sind Sie sicher, dass Sie sich von unserem wöchentlichen Newsletter abmelden möchten?",
    confirmBtn: "Ja, abmelden",
    processing: "Wird verarbeitet...",
    successTitle: "Erfolgreich abgemeldet",
    successMsg: "Sie werden keine wöchentlichen Newsletter-E-Mails mehr erhalten. Es tut uns leid, Sie gehen zu sehen!",
    errorTitle: "Etwas ist schiefgelaufen",
    errorMsg: "Wir konnten Ihre Abmeldeanfrage nicht verarbeiten. Bitte versuchen Sie es später erneut.",
    alreadyTitle: "Bereits abgemeldet",
    alreadyMsg: "Diese E-Mail-Adresse ist derzeit nicht für unseren Newsletter angemeldet.",
    noEmail: "Es wurde keine gültige E-Mail-Adresse angegeben.",
    backHome: "Zurück zur Startseite",
    resubscribe: "Erneut abonnieren",
    resubscribeSuccess: "Erfolgreich erneut abonniert!",
  },
  tr: {
    title: "Abonelikten Çık",
    subtitle: "Haftalık bültenimizden çıkmak istediğinizden emin misiniz?",
    confirmBtn: "Evet, Abonelikten Çık",
    processing: "İşleniyor...",
    successTitle: "Abonelik Başarıyla İptal Edildi",
    successMsg: "Artık haftalık bülten e-postalarımızı almayacaksınız. Gittiğinizi görmek bizi üzüyor!",
    errorTitle: "Bir Hata Oluştu",
    errorMsg: "Abonelik iptal talebinizi işleyemedik. Lütfen daha sonra tekrar deneyin.",
    alreadyTitle: "Zaten Abonelikten Çıkılmış",
    alreadyMsg: "Bu e-posta adresi şu anda bültenimize abone değil.",
    noEmail: "Geçerli bir e-posta adresi sağlanmadı.",
    backHome: "Ana Sayfaya Dön",
    resubscribe: "Tekrar Abone Ol",
    resubscribeSuccess: "Tekrar abone olundu!",
  },
};

type Status = "confirm" | "processing" | "success" | "error" | "already" | "no-email";

export default function Unsubscribe() {
  const { lang } = useLanguage();
  const t = UI_TEXT[lang] || UI_TEXT.en;
  const isRtl = lang === "ar";

  const [status, setStatus] = useState<Status>("confirm");
  const [email, setEmail] = useState("");

  const unsubscribeMutation = trpc.newsletter.unsubscribe.useMutation();
  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setStatus("no-email");
    }
  }, []);

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("no-email");
      return;
    }
    setStatus("processing");
    try {
      const result = await unsubscribeMutation.mutateAsync({ email });
      if (result) {
        setStatus("success");
      } else {
        setStatus("already");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleResubscribe = async () => {
    try {
      await subscribeMutation.mutateAsync({ email, language: lang });
      setStatus("confirm");
      // Show a brief success message
      const el = document.getElementById("resubscribe-msg");
      if (el) {
        el.textContent = t.resubscribeSuccess;
        el.classList.remove("hidden");
        setTimeout(() => el.classList.add("hidden"), 3000);
      }
    } catch {
      // silently fail
    }
  };

  const renderContent = () => {
    switch (status) {
      case "no-email":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.noEmail}</h2>
          </div>
        );

      case "confirm":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.title}</h2>
            <p className="text-gray-600 mb-2">{t.subtitle}</p>
            <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 px-3 py-1 rounded inline-block">{email}</p>
            <div>
              <button
                onClick={handleUnsubscribe}
                className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {t.confirmBtn}
              </button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-gray-600">{t.processing}</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.successTitle}</h2>
            <p className="text-gray-600 mb-6">{t.successMsg}</p>
            <button
              onClick={handleResubscribe}
              className="text-teal-600 hover:text-teal-700 text-sm underline"
            >
              {t.resubscribe}
            </button>
            <p id="resubscribe-msg" className="hidden text-green-600 text-sm mt-2"></p>
          </div>
        );

      case "already":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.alreadyTitle}</h2>
            <p className="text-gray-600">{t.alreadyMsg}</p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.errorTitle}</h2>
            <p className="text-gray-600 mb-4">{t.errorMsg}</p>
            <button
              onClick={() => setStatus("confirm")}
              className="text-teal-600 hover:text-teal-700 text-sm underline"
            >
              {t.confirmBtn}
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {renderContent()}
        </div>
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-500 hover:text-teal-600 text-sm transition-colors"
          >
            ← {t.backHome}
          </a>
        </div>
      </div>
    </div>
  );
}
