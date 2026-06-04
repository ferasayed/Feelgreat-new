import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/i18n";

const SUPPORTED_LANGUAGES: Language[] = ["ar", "en", "fr", "es", "de", "tr"];
const BASE_URL = "https://feelgreat.us.com";
const LANG_PREFIX_REGEX = /^\/(ar|en|fr|es|de|tr)(\/|$)/;

/**
 * Maps language codes to hreflang values.
 * Uses region-specific codes where appropriate for better SEO targeting.
 */
const HREFLANG_MAP: Record<Language, string> = {
  ar: "ar",
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  tr: "tr",
};

/**
 * HreflangTags component dynamically injects <link rel="alternate" hreflang="..."> tags
 * into the document head for each supported language version of the current page.
 * This helps Google understand that the same content exists in multiple languages.
 */
export default function HreflangTags() {
  const { lang } = useLanguage();

  useEffect(() => {
    // Get the current path without language prefix
    const currentPath = window.location.pathname.replace(LANG_PREFIX_REGEX, "/");

    // Remove any existing hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add hreflang links for each supported language
    for (const supportedLang of SUPPORTED_LANGUAGES) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = HREFLANG_MAP[supportedLang];
      // English uses root path, other languages use prefix
      const langPath = supportedLang === "en"
        ? currentPath
        : `/${supportedLang}${currentPath === "/" ? "" : currentPath}`;
      link.href = `${BASE_URL}${langPath}`;
      document.head.appendChild(link);
    }

    // Add x-default (points to English version as default)
    const xDefault = document.createElement("link");
    xDefault.rel = "alternate";
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.href = `${BASE_URL}${currentPath}`;
    document.head.appendChild(xDefault);

    // Update canonical URL to current language version
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const canonicalPath = lang === "en"
      ? currentPath
      : `/${lang}${currentPath === "/" ? "" : currentPath}`;
    canonical.setAttribute("href", `${BASE_URL}${canonicalPath}`);

    // Update html lang and dir attributes
    document.documentElement.lang = lang;

    return () => {
      // Cleanup on unmount
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    };
  }, [lang]);

  // This component renders nothing visible
  return null;
}
