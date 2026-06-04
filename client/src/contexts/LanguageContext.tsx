import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Language, getTranslation, getDirection, languages, LanguageConfig } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  languages: LanguageConfig[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const SUPPORTED_LANGUAGES: Language[] = ["ar", "en", "fr", "es", "de", "tr"];
const STORAGE_KEY = "fg-lang";
const LANG_PREFIX_REGEX = /^\/(ar|en|fr|es|de|tr)(\/|$)/;

/**
 * Country code to language mapping for IP-based detection fallback.
 * Arabic-speaking countries → Arabic
 * French-speaking countries → French
 * Spanish-speaking countries → Spanish
 * German-speaking countries → German
 * Turkish-speaking countries → Turkish
 * Everything else → English
 */
const COUNTRY_TO_LANG: Record<string, Language> = {
  // Arabic-speaking countries
  SA: "ar", AE: "ar", EG: "ar", JO: "ar", IQ: "ar", KW: "ar", QA: "ar",
  BH: "ar", OM: "ar", YE: "ar", LB: "ar", SY: "ar", PS: "ar", LY: "ar",
  TN: "ar", DZ: "ar", MA: "ar", SD: "ar", MR: "ar",
  // French-speaking countries
  FR: "fr", BE: "fr", CH: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr",
  ML: "fr", BF: "fr", NE: "fr", TG: "fr", BJ: "fr", GA: "fr", CG: "fr",
  CD: "fr", CM: "fr", MG: "fr", HT: "fr",
  // Spanish-speaking countries
  ES: "es", MX: "es", CO: "es", AR: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  // German-speaking countries
  DE: "de", AT: "de", LI: "de",
  // Turkish-speaking countries
  TR: "tr", CY: "tr",
};

/**
 * Detect language from browser navigator.language
 */
function detectBrowserLanguage(): Language | null {
  const browserLangs = navigator.languages || [navigator.language];
  for (const bl of browserLangs) {
    const code = bl.split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(code as Language)) {
      return code as Language;
    }
  }
  return null;
}

/**
 * Detect language from URL path prefix (/ar, /en, /fr, etc.)
 */
function detectUrlLanguage(): Language | null {
  const match = window.location.pathname.match(LANG_PREFIX_REGEX);
  if (match && SUPPORTED_LANGUAGES.includes(match[1] as Language)) {
    return match[1] as Language;
  }
  return null;
}

/**
 * Get saved language from localStorage
 */
function getSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Fetch country code from server-side IP geolocation (non-blocking)
 */
async function fetchGeoLanguage(): Promise<Language | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("/api/geo", { signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (data.detected && data.countryCode) {
      return COUNTRY_TO_LANG[data.countryCode] || "en";
    }
  } catch {
    // Fail silently
  }
  return null;
}

/**
 * Determine initial language synchronously (no flicker):
 * Priority: URL prefix → localStorage → Browser Language → English default
 * IP geolocation is async and applied only if no other source is found
 */
function getInitialLanguage(): Language {
  // 1. Check URL prefix first (e.g., /ar/about)
  const urlLang = detectUrlLanguage();
  if (urlLang) return urlLang;

  // 2. Check localStorage (user previously chose a language)
  const savedLang = getSavedLanguage();
  if (savedLang) return savedLang;

  // 3. Check browser language
  const browserLang = detectBrowserLanguage();
  if (browserLang) return browserLang;

  // 4. Default to English (IP check will update async if needed)
  return "en";
}

/**
 * Update the URL to include language prefix without full page reload.
 * Uses replaceState to avoid adding history entries on auto-detection.
 */
function updateUrlPrefix(lang: Language, replace: boolean = false) {
  const path = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // Remove existing language prefix if present
  const cleanPath = path.replace(LANG_PREFIX_REGEX, "/");

  // Build new path with language prefix (skip for English as default)
  const newPath = lang === "en" ? cleanPath : `/${lang}${cleanPath === "/" ? "" : cleanPath}`;
  const fullUrl = newPath + search + hash;

  if (fullUrl !== path + search + hash) {
    if (replace) {
      window.history.replaceState(null, "", fullUrl);
    } else {
      window.history.pushState(null, "", fullUrl);
    }
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);
  const [geoChecked, setGeoChecked] = useState(false);

  // On mount: if no saved/browser/URL language was found, try IP geolocation
  useEffect(() => {
    const urlLang = detectUrlLanguage();
    const savedLang = getSavedLanguage();
    const browserLang = detectBrowserLanguage();

    // Only fetch geo if no other source determined the language
    if (!urlLang && !savedLang && !browserLang) {
      fetchGeoLanguage().then((geoLang) => {
        if (geoLang && geoLang !== lang) {
          setLangState(geoLang);
          localStorage.setItem(STORAGE_KEY, geoLang);
          updateUrlPrefix(geoLang, true);
        }
        setGeoChecked(true);
      });
    } else {
      setGeoChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL prefix when language changes (initial load uses replaceState)
  useEffect(() => {
    if (geoChecked) {
      updateUrlPrefix(lang, true);
    }
  }, [lang, geoChecked]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    updateUrlPrefix(newLang, false);
  }, []);

  const t = (key: string) => getTranslation(lang, key);
  const dir = getDirection(lang);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
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

/**
 * Utility: strip language prefix from a path for route matching.
 * Used by the Router to match routes regardless of language prefix.
 */
export function stripLangPrefix(path: string): string {
  return path.replace(LANG_PREFIX_REGEX, "/");
}
