import { describe, it, expect, vi, beforeEach } from "vitest";

// Test the geo endpoint logic
describe("Geo Language Detection", () => {
  // Country to language mapping (mirrors the frontend logic)
  const COUNTRY_TO_LANG: Record<string, string> = {
    SA: "ar", AE: "ar", EG: "ar", JO: "ar", IQ: "ar", KW: "ar", QA: "ar",
    BH: "ar", OM: "ar", YE: "ar", LB: "ar", SY: "ar", PS: "ar", LY: "ar",
    TN: "ar", DZ: "ar", MA: "ar", SD: "ar", MR: "ar",
    FR: "fr", BE: "fr", CH: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr",
    ES: "es", MX: "es", CO: "es", AR: "es", PE: "es", VE: "es", CL: "es",
    DE: "de", AT: "de", LI: "de",
    TR: "tr", CY: "tr",
  };

  function getLanguageFromCountry(countryCode: string | null): string {
    if (!countryCode) return "en";
    return COUNTRY_TO_LANG[countryCode] || "en";
  }

  it("should return Arabic for Saudi Arabia", () => {
    expect(getLanguageFromCountry("SA")).toBe("ar");
  });

  it("should return Arabic for UAE", () => {
    expect(getLanguageFromCountry("AE")).toBe("ar");
  });

  it("should return Arabic for Egypt", () => {
    expect(getLanguageFromCountry("EG")).toBe("ar");
  });

  it("should return French for France", () => {
    expect(getLanguageFromCountry("FR")).toBe("fr");
  });

  it("should return Spanish for Spain", () => {
    expect(getLanguageFromCountry("ES")).toBe("es");
  });

  it("should return Spanish for Mexico", () => {
    expect(getLanguageFromCountry("MX")).toBe("es");
  });

  it("should return German for Germany", () => {
    expect(getLanguageFromCountry("DE")).toBe("de");
  });

  it("should return German for Austria", () => {
    expect(getLanguageFromCountry("AT")).toBe("de");
  });

  it("should return Turkish for Turkey", () => {
    expect(getLanguageFromCountry("TR")).toBe("tr");
  });

  it("should return English for US (not in mapping)", () => {
    expect(getLanguageFromCountry("US")).toBe("en");
  });

  it("should return English for UK (not in mapping)", () => {
    expect(getLanguageFromCountry("GB")).toBe("en");
  });

  it("should return English for null country code", () => {
    expect(getLanguageFromCountry(null)).toBe("en");
  });

  it("should return English for unknown country code", () => {
    expect(getLanguageFromCountry("XX")).toBe("en");
  });
});

describe("Browser Language Detection", () => {
  const SUPPORTED_LANGUAGES = ["ar", "en", "fr", "es", "de", "tr"];

  function detectBrowserLanguage(browserLangs: string[]): string | null {
    for (const bl of browserLangs) {
      const code = bl.split("-")[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(code)) {
        return code;
      }
    }
    return null;
  }

  it("should detect Arabic from ar-SA", () => {
    expect(detectBrowserLanguage(["ar-SA", "en-US"])).toBe("ar");
  });

  it("should detect English from en-US", () => {
    expect(detectBrowserLanguage(["en-US"])).toBe("en");
  });

  it("should detect French from fr-FR", () => {
    expect(detectBrowserLanguage(["fr-FR", "en-US"])).toBe("fr");
  });

  it("should detect Spanish from es-MX", () => {
    expect(detectBrowserLanguage(["es-MX", "en-US"])).toBe("es");
  });

  it("should detect German from de-DE", () => {
    expect(detectBrowserLanguage(["de-DE", "en-US"])).toBe("de");
  });

  it("should detect Turkish from tr-TR", () => {
    expect(detectBrowserLanguage(["tr-TR", "en-US"])).toBe("tr");
  });

  it("should return null for unsupported language", () => {
    expect(detectBrowserLanguage(["ja-JP", "zh-CN"])).toBe(null);
  });

  it("should pick first supported language from list", () => {
    expect(detectBrowserLanguage(["ja-JP", "fr-FR", "en-US"])).toBe("fr");
  });

  it("should handle empty array", () => {
    expect(detectBrowserLanguage([])).toBe(null);
  });
});

describe("URL Language Prefix Detection", () => {
  const LANG_PREFIX_REGEX = /^\/(ar|en|fr|es|de|tr)(\/|$)/;

  function detectUrlLanguage(pathname: string): string | null {
    const match = pathname.match(LANG_PREFIX_REGEX);
    return match ? match[1] : null;
  }

  it("should detect Arabic from /ar", () => {
    expect(detectUrlLanguage("/ar")).toBe("ar");
  });

  it("should detect Arabic from /ar/faq", () => {
    expect(detectUrlLanguage("/ar/faq")).toBe("ar");
  });

  it("should detect French from /fr", () => {
    expect(detectUrlLanguage("/fr")).toBe("fr");
  });

  it("should detect Spanish from /es/blog/test", () => {
    expect(detectUrlLanguage("/es/blog/test")).toBe("es");
  });

  it("should detect German from /de/", () => {
    expect(detectUrlLanguage("/de/")).toBe("de");
  });

  it("should detect Turkish from /tr/health", () => {
    expect(detectUrlLanguage("/tr/health")).toBe("tr");
  });

  it("should return null for root path /", () => {
    expect(detectUrlLanguage("/")).toBe(null);
  });

  it("should return null for /faq (no lang prefix)", () => {
    expect(detectUrlLanguage("/faq")).toBe(null);
  });

  it("should return null for /article (not a lang code)", () => {
    expect(detectUrlLanguage("/article")).toBe(null);
  });

  it("should not match partial paths like /arrow", () => {
    expect(detectUrlLanguage("/arrow")).toBe(null);
  });
});

describe("Language Priority Logic", () => {
  const SUPPORTED_LANGUAGES = ["ar", "en", "fr", "es", "de", "tr"];
  const LANG_PREFIX_REGEX = /^\/(ar|en|fr|es|de|tr)(\/|$)/;
  const COUNTRY_TO_LANG: Record<string, string> = {
    SA: "ar", AE: "ar", EG: "ar", FR: "fr", ES: "es", DE: "de", TR: "tr",
  };

  function getInitialLanguage(
    pathname: string,
    savedLang: string | null,
    browserLangs: string[],
    geoCountry: string | null
  ): string {
    // 1. URL prefix
    const urlMatch = pathname.match(LANG_PREFIX_REGEX);
    if (urlMatch) return urlMatch[1];

    // 2. Saved in localStorage
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) return savedLang;

    // 3. Browser language
    for (const bl of browserLangs) {
      const code = bl.split("-")[0].toLowerCase();
      if (SUPPORTED_LANGUAGES.includes(code)) return code;
    }

    // 4. Geo fallback
    if (geoCountry && COUNTRY_TO_LANG[geoCountry]) return COUNTRY_TO_LANG[geoCountry];

    // 5. Default English
    return "en";
  }

  it("URL prefix takes highest priority", () => {
    expect(getInitialLanguage("/fr/faq", "ar", ["de-DE"], "SA")).toBe("fr");
  });

  it("localStorage takes priority over browser and geo", () => {
    expect(getInitialLanguage("/", "ar", ["de-DE"], "FR")).toBe("ar");
  });

  it("Browser language takes priority over geo", () => {
    expect(getInitialLanguage("/", null, ["de-DE"], "FR")).toBe("de");
  });

  it("Geo fallback used when no other source", () => {
    expect(getInitialLanguage("/", null, ["ja-JP"], "SA")).toBe("ar");
  });

  it("English default when nothing matches", () => {
    expect(getInitialLanguage("/", null, ["ja-JP"], "US")).toBe("en");
  });

  it("English default when all sources are null/empty", () => {
    expect(getInitialLanguage("/", null, [], null)).toBe("en");
  });
});
