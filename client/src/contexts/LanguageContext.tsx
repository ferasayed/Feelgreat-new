import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, getTranslation, getDirection, languages, LanguageConfig } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  languages: LanguageConfig[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language?.split("-")[0] ?? "en";
  const supported: Language[] = ["ar", "en", "fr", "es", "de", "tr"];
  if (supported.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("fg-lang");
    if (saved && ["ar", "en", "fr", "es", "de", "tr"].includes(saved)) {
      return saved as Language;
    }
    return detectBrowserLanguage();
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("fg-lang", newLang);
  };

  const t = (key: string) => getTranslation(lang, key);
  const dir = getDirection(lang);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    // Let global CSS handle font-family via @font-face
    document.body.style.fontFamily = "'Bahij TheSansArabic', 'Inter', system-ui, sans-serif";
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
