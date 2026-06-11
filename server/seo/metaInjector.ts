/**
 * Server-Side SEO Meta Tags Injector (Language-Aware)
 * 
 * Intercepts HTML responses and injects dynamic meta tags based on the requested URL.
 * Detects the visitor's language from the URL prefix (ar/en/fr/es/de/tr) and serves
 * meta tags, OG tags, and JSON-LD in the correct language.
 * 
 * Also injects hreflang link tags for all supported languages to help search engines
 * understand the multilingual structure of the site.
 */
import { Request, Response, NextFunction } from "express";
import { getArticleBySlug } from "../db";
import { getResearchBySlug } from "../db";

const BASE_URL = "https://feelgreat.us.com";
const SITE_NAME = "Feel Great";
const DEFAULT_IMAGE = "/manus-storage/feel-great-complete_44bb8752.png";
const AUTHOR_NAME = "Feras Alayed";
const AUTHOR_NAME_AR = "فراس العايد";

type SupportedLang = "ar" | "en" | "fr" | "es" | "de" | "tr";
const SUPPORTED_LANGS: SupportedLang[] = ["ar", "en", "fr", "es", "de", "tr"];

interface MetaData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  jsonLd?: object;
  lang?: string;
  dir?: string;
  hreflangPath?: string; // The clean path (without lang prefix) used to build hreflang links
}

/**
 * Extract language from URL path prefix.
 * Returns the detected language and the path without the language prefix.
 */
function extractLangFromPath(path: string): { lang: SupportedLang; cleanPath: string } {
  const match = path.match(/^\/(ar|en|fr|es|de|tr)(\/|$)/);
  if (match) {
    const lang = match[1] as SupportedLang;
    const cleanPath = path.replace(/^\/(ar|en|fr|es|de|tr)(\/|$)/, "/").replace(/\/$/, "") || "/";
    return { lang, cleanPath };
  }
  // No prefix = English (default)
  const cleanPath = path.replace(/\/$/, "") || "/";
  return { lang: "en", cleanPath };
}

/**
 * Build the full URL for a given language and path.
 * English uses root path, other languages use prefix.
 */
function buildLangUrl(lang: SupportedLang, cleanPath: string): string {
  if (lang === "en") return `${BASE_URL}${cleanPath}`;
  return `${BASE_URL}/${lang}${cleanPath === "/" ? "" : cleanPath}`;
}

// Static page meta data - language-aware
const STATIC_META_BY_LANG: Record<string, Record<SupportedLang, { title: string; description: string }>> = {
  "/": {
    ar: {
      title: "فيل جريت Feel Great | نظام صحي أيضي متكامل - اكسر مقاومة الإنسولين | فراس العايد",
      description: "استعد طاقتك واكسر مقاومة الإنسولين خلال 90 يوم مع برنامج Feel Great من يونيسيتي. منتج بالانس مدرج في PDR المرجع الطبي الأمريكي. نظام Unimate + Balance مدعوم بأكثر من 50 دراسة علمية.",
    },
    en: {
      title: "Feel Great | Break Insulin Resistance in 90 Days - Science-Backed Metabolic Health | Feras Alayed",
      description: "Restore your energy and break insulin resistance in 90 days with the Feel Great system by Unicity. Balance is listed in the PDR (Physicians' Desk Reference). Backed by 50+ clinical studies.",
    },
    fr: {
      title: "Feel Great | Brisez la résistance à l'insuline en 90 jours - Santé métabolique | Feras Alayed",
      description: "Retrouvez votre énergie et brisez la résistance à l'insuline en 90 jours avec le système Feel Great de Unicity. Balance est répertorié dans le PDR. Soutenu par plus de 50 études cliniques.",
    },
    es: {
      title: "Feel Great | Rompe la resistencia a la insulina en 90 días - Salud metabólica | Feras Alayed",
      description: "Recupera tu energía y rompe la resistencia a la insulina en 90 días con el sistema Feel Great de Unicity. Balance está listado en el PDR. Respaldado por más de 50 estudios clínicos.",
    },
    de: {
      title: "Feel Great | Insulinresistenz in 90 Tagen durchbrechen - Stoffwechselgesundheit | Feras Alayed",
      description: "Stellen Sie Ihre Energie wieder her und durchbrechen Sie die Insulinresistenz in 90 Tagen mit dem Feel Great System von Unicity. Balance ist im PDR gelistet. Unterstützt durch 50+ klinische Studien.",
    },
    tr: {
      title: "Feel Great | 90 Günde İnsülin Direncini Kırın - Metabolik Sağlık | Feras Alayed",
      description: "Enerjinizi geri kazanın ve 90 günde insülin direncini kırın. Unicity'nin Feel Great sistemi ile. Balance, PDR'de (Amerikan Tıp Referansı) listelenmiştir. 50'den fazla klinik çalışma ile desteklenmektedir.",
    },
  },
  "/blog": {
    ar: {
      title: "مقالات صحية علمية | Feel Great",
      description: "مقالات صحية موثوقة مبنية على أحدث الدراسات العلمية. مقاومة الإنسولين، صحة الأمعاء، إدارة الوزن، التغذية السلوكية.",
    },
    en: {
      title: "Health Blog - Evidence-Based Articles | Feel Great",
      description: "Trusted health articles based on the latest scientific studies. Insulin resistance, gut health, weight management, behavioral nutrition.",
    },
    fr: {
      title: "Blog Santé - Articles basés sur la science | Feel Great",
      description: "Articles de santé fiables basés sur les dernières études scientifiques. Résistance à l'insuline, santé intestinale, gestion du poids.",
    },
    es: {
      title: "Blog de Salud - Artículos científicos | Feel Great",
      description: "Artículos de salud confiables basados en los últimos estudios científicos. Resistencia a la insulina, salud intestinal, control de peso.",
    },
    de: {
      title: "Gesundheitsblog - Wissenschaftliche Artikel | Feel Great",
      description: "Vertrauenswürdige Gesundheitsartikel basierend auf neuesten wissenschaftlichen Studien. Insulinresistenz, Darmgesundheit, Gewichtsmanagement.",
    },
    tr: {
      title: "Sağlık Blogu - Bilimsel Makaleler | Feel Great",
      description: "En son bilimsel çalışmalara dayanan güvenilir sağlık makaleleri. İnsülin direnci, bağırsak sağlığı, kilo yönetimi.",
    },
  },
  "/research": {
    ar: {
      title: "مركز الأبحاث العلمية | Feel Great",
      description: "أحدث الدراسات العلمية من PubMed و Nature و JAMA ملخصة ومبسطة. اكتشف العلم وراء الصحة المستدامة.",
    },
    en: {
      title: "Scientific Research Hub | Feel Great",
      description: "Latest scientific studies from PubMed, Nature, and JAMA summarized and simplified. Discover the science behind sustainable health.",
    },
    fr: {
      title: "Centre de Recherche Scientifique | Feel Great",
      description: "Les dernières études scientifiques de PubMed, Nature et JAMA résumées et simplifiées.",
    },
    es: {
      title: "Centro de Investigación Científica | Feel Great",
      description: "Los últimos estudios científicos de PubMed, Nature y JAMA resumidos y simplificados.",
    },
    de: {
      title: "Wissenschaftliches Forschungszentrum | Feel Great",
      description: "Neueste wissenschaftliche Studien aus PubMed, Nature und JAMA zusammengefasst und vereinfacht.",
    },
    tr: {
      title: "Bilimsel Araştırma Merkezi | Feel Great",
      description: "PubMed, Nature ve JAMA'dan en son bilimsel çalışmalar özetlenmiş ve basitleştirilmiş.",
    },
  },
  "/partner": {
    ar: {
      title: "انضم كشريك | Feel Great",
      description: "اكتشف فرصة الشراكة مع Feel Great. ابنِ دخلاً إضافياً وأنت تساعد الآخرين على تحسين صحتهم.",
    },
    en: {
      title: "Partner With Us | Feel Great",
      description: "Discover the partnership opportunity with Feel Great. Build additional income while helping others improve their health.",
    },
    fr: {
      title: "Devenez Partenaire | Feel Great",
      description: "Découvrez l'opportunité de partenariat avec Feel Great. Construisez un revenu supplémentaire en aidant les autres.",
    },
    es: {
      title: "Únete como Socio | Feel Great",
      description: "Descubre la oportunidad de asociación con Feel Great. Genera ingresos adicionales mientras ayudas a otros.",
    },
    de: {
      title: "Partner werden | Feel Great",
      description: "Entdecken Sie die Partnerschaftsmöglichkeit mit Feel Great. Bauen Sie zusätzliches Einkommen auf.",
    },
    tr: {
      title: "Ortak Olun | Feel Great",
      description: "Feel Great ile ortaklık fırsatını keşfedin. Başkalarına yardım ederken ek gelir elde edin.",
    },
  },
  "/faq": {
    ar: {
      title: "الأسئلة الشائعة | Feel Great",
      description: "إجابات على أكثر الأسئلة شيوعاً حول برنامج Feel Great ومنتجات Unimate و Balance.",
    },
    en: {
      title: "FAQ - Frequently Asked Questions | Feel Great",
      description: "Answers to the most common questions about the Feel Great program and Unimate & Balance products.",
    },
    fr: {
      title: "FAQ - Questions Fréquentes | Feel Great",
      description: "Réponses aux questions les plus courantes sur le programme Feel Great et les produits Unimate et Balance.",
    },
    es: {
      title: "Preguntas Frecuentes | Feel Great",
      description: "Respuestas a las preguntas más comunes sobre el programa Feel Great y los productos Unimate y Balance.",
    },
    de: {
      title: "Häufig gestellte Fragen | Feel Great",
      description: "Antworten auf die häufigsten Fragen zum Feel Great Programm und den Produkten Unimate und Balance.",
    },
    tr: {
      title: "Sıkça Sorulan Sorular | Feel Great",
      description: "Feel Great programı ve Unimate & Balance ürünleri hakkında en sık sorulan sorulara yanıtlar.",
    },
  },
  "/about": {
    ar: {
      title: "عن فراس العايد | Feel Great",
      description: "فراس العايد - أخصائي التغذية العلاجية والسلوكية. مدرب عالمي في الصحة المستدامة وريادة الأعمال الصحية.",
    },
    en: {
      title: "About Feras Alayed | Feel Great",
      description: "Feras Alayed - Therapeutic & Behavioral Nutrition Specialist. Global trainer in sustainable health and health entrepreneurship.",
    },
    fr: {
      title: "À propos de Feras Alayed | Feel Great",
      description: "Feras Alayed - Spécialiste en nutrition thérapeutique et comportementale. Formateur mondial en santé durable.",
    },
    es: {
      title: "Sobre Feras Alayed | Feel Great",
      description: "Feras Alayed - Especialista en nutrición terapéutica y conductual. Entrenador global en salud sostenible.",
    },
    de: {
      title: "Über Feras Alayed | Feel Great",
      description: "Feras Alayed - Spezialist für therapeutische und verhaltensbasierte Ernährung. Globaler Trainer für nachhaltige Gesundheit.",
    },
    tr: {
      title: "Feras Alayed Hakkında | Feel Great",
      description: "Feras Alayed - Terapötik ve Davranışsal Beslenme Uzmanı. Sürdürülebilir sağlık alanında küresel eğitmen.",
    },
  },
  "/success-stories": {
    ar: {
      title: "قصص النجاح | Feel Great",
      description: "قصص حقيقية لأشخاص غيّروا حياتهم مع برنامج Feel Great. تحولات صحية ملهمة.",
    },
    en: {
      title: "Success Stories | Feel Great",
      description: "Real stories of people who transformed their lives with the Feel Great program. Inspiring health transformations.",
    },
    fr: {
      title: "Histoires de Réussite | Feel Great",
      description: "Histoires réelles de personnes qui ont transformé leur vie avec le programme Feel Great.",
    },
    es: {
      title: "Historias de Éxito | Feel Great",
      description: "Historias reales de personas que transformaron sus vidas con el programa Feel Great.",
    },
    de: {
      title: "Erfolgsgeschichten | Feel Great",
      description: "Echte Geschichten von Menschen, die ihr Leben mit dem Feel Great Programm verändert haben.",
    },
    tr: {
      title: "Başarı Hikayeleri | Feel Great",
      description: "Feel Great programı ile hayatlarını değiştiren insanların gerçek hikayeleri.",
    },
  },
  "/health-assessment": {
    ar: {
      title: "تقييم صحتك | Feel Great",
      description: "اكتشف مستوى صحتك مع تقييمنا المجاني. احصل على توصيات مخصصة بناءً على حالتك الصحية.",
    },
    en: {
      title: "Health Assessment | Feel Great",
      description: "Discover your health level with our free assessment. Get personalized recommendations based on your health status.",
    },
    fr: {
      title: "Évaluation de Santé | Feel Great",
      description: "Découvrez votre niveau de santé avec notre évaluation gratuite. Obtenez des recommandations personnalisées.",
    },
    es: {
      title: "Evaluación de Salud | Feel Great",
      description: "Descubre tu nivel de salud con nuestra evaluación gratuita. Obtén recomendaciones personalizadas.",
    },
    de: {
      title: "Gesundheitsbewertung | Feel Great",
      description: "Entdecken Sie Ihr Gesundheitsniveau mit unserer kostenlosen Bewertung. Erhalten Sie personalisierte Empfehlungen.",
    },
    tr: {
      title: "Sağlık Değerlendirmesi | Feel Great",
      description: "Ücretsiz değerlendirmemizle sağlık seviyenizi keşfedin. Kişiselleştirilmiş öneriler alın.",
    },
  },
  "/today-in-health-science": {
    ar: {
      title: "اليوم في علم الصحة | Feel Great",
      description: "أحدث الاكتشافات العلمية من أفضل الجامعات والمجلات الطبية العالمية، ملخصة ومبسطة يومياً.",
    },
    en: {
      title: "Today In Health Science | Feel Great",
      description: "Latest scientific discoveries from top universities and medical journals, summarized and simplified daily.",
    },
    fr: {
      title: "Aujourd'hui en Science de la Santé | Feel Great",
      description: "Les dernières découvertes scientifiques des meilleures universités et revues médicales, résumées quotidiennement.",
    },
    es: {
      title: "Hoy en Ciencia de la Salud | Feel Great",
      description: "Los últimos descubrimientos científicos de las mejores universidades y revistas médicas, resumidos diariamente.",
    },
    de: {
      title: "Heute in der Gesundheitswissenschaft | Feel Great",
      description: "Neueste wissenschaftliche Entdeckungen von Top-Universitäten und medizinischen Fachzeitschriften, täglich zusammengefasst.",
    },
    tr: {
      title: "Bugün Sağlık Biliminde | Feel Great",
      description: "En iyi üniversitelerden ve tıp dergilerinden en son bilimsel keşifler, günlük olarak özetlenmiş.",
    },
  },
  "/reviews": {
    ar: {
      title: "تقييمات العملاء | Feel Great",
      description: "تقييمات وآراء حقيقية من مستخدمي برنامج Feel Great حول تجربتهم مع المنتجات.",
    },
    en: {
      title: "Customer Reviews | Feel Great",
      description: "Real reviews and opinions from Feel Great program users about their experience with the products.",
    },
    fr: {
      title: "Avis Clients | Feel Great",
      description: "Avis et opinions réels des utilisateurs du programme Feel Great sur leur expérience avec les produits.",
    },
    es: {
      title: "Opiniones de Clientes | Feel Great",
      description: "Opiniones y reseñas reales de usuarios del programa Feel Great sobre su experiencia con los productos.",
    },
    de: {
      title: "Kundenbewertungen | Feel Great",
      description: "Echte Bewertungen und Meinungen von Feel Great Programmnutzern über ihre Erfahrung mit den Produkten.",
    },
    tr: {
      title: "Müşteri Yorumları | Feel Great",
      description: "Feel Great programı kullanıcılarından gerçek yorumlar ve ürün deneyimleri.",
    },
  },
  "/health-library": {
    ar: {
      title: "مكتبة الصحة - مراكز المعرفة الشاملة | Feel Great",
      description: "استكشف مكتبتنا الصحية الشاملة: مقاومة الإنسولين، صحة الأمعاء، الصحة المستدامة، إنقاص الوزن، والمزيد.",
    },
    en: {
      title: "Health Library - Comprehensive Knowledge Hubs | Feel Great",
      description: "Explore our comprehensive health library: Insulin Resistance, Gut Health, Sustainable Health, Weight Loss, Sleep, Women's Health, and Metabolic Health hubs.",
    },
    fr: {
      title: "Bibliothèque Santé | Feel Great",
      description: "Explorez notre bibliothèque santé complète: résistance à l'insuline, santé intestinale, santé durable, perte de poids.",
    },
    es: {
      title: "Biblioteca de Salud | Feel Great",
      description: "Explore nuestra biblioteca de salud integral: resistencia a la insulina, salud intestinal, salud sostenible, pérdida de peso.",
    },
    de: {
      title: "Gesundheitsbibliothek | Feel Great",
      description: "Entdecken Sie unsere umfassende Gesundheitsbibliothek: Insulinresistenz, Darmgesundheit, nachhaltige Gesundheit, Gewichtsverlust.",
    },
    tr: {
      title: "Sağlık Kütüphanesi | Feel Great",
      description: "Kapsamlı sağlık kütüphanemizi keşfedin: insülin direnci, bağırsak sağlığı, sürdürülebilir sağlık, kilo kaybı.",
    },
  },
  "/author/feras-alayed": {
    ar: {
      title: "فراس العايد - أخصائي التغذية العلاجية والسلوكية | Feel Great",
      description: "فراس العايد - مفكر ومدرب ومُثقف عالمي في الصحة المستدامة، التغذية السلوكية، القيادة، والتمكين الإنساني.",
    },
    en: {
      title: "Feras Alayed - Therapeutic & Behavioral Nutrition Specialist | Feel Great",
      description: "Global thinker, educator, and mentor in sustainable health, behavioral nutrition, leadership, and human empowerment.",
    },
    fr: {
      title: "Feras Alayed - Spécialiste en Nutrition | Feel Great",
      description: "Penseur mondial, éducateur et mentor en santé durable, nutrition comportementale, leadership et autonomisation humaine.",
    },
    es: {
      title: "Feras Alayed - Especialista en Nutrición | Feel Great",
      description: "Pensador global, educador y mentor en salud sostenible, nutrición conductual, liderazgo y empoderamiento humano.",
    },
    de: {
      title: "Feras Alayed - Ernährungsspezialist | Feel Great",
      description: "Globaler Denker, Pädagoge und Mentor für nachhaltige Gesundheit, Verhaltensernährung, Führung und menschliche Ermächtigung.",
    },
    tr: {
      title: "Feras Alayed - Beslenme Uzmanı | Feel Great",
      description: "Sürdürülebilir sağlık, davranışsal beslenme, liderlik ve insan güçlendirme alanında küresel düşünür ve eğitmen.",
    },
  },
  "/feras-alayed": {
    ar: {
      title: "فراس العايد | مركز المعرفة - مفكر ومدرب عالمي",
      description: "فراس العايد - مفكر ومدرب ومُثقف عالمي في الصحة المستدامة، التغذية السلوكية، القيادة، الإمكانات البشرية، ريادة الأعمال، والتمكين الإنساني.",
    },
    en: {
      title: "Feras Alayed | Knowledge Hub - Global Thinker, Educator & Mentor",
      description: "Global thinker, educator, and mentor dedicated to sustainable health, behavioral nutrition, leadership development, human potential, entrepreneurship, and financial empowerment.",
    },
    fr: {
      title: "Feras Alayed | Centre de Connaissances",
      description: "Penseur mondial, éducateur et mentor dédié à la santé durable, la nutrition comportementale, le leadership et le potentiel humain.",
    },
    es: {
      title: "Feras Alayed | Centro de Conocimiento",
      description: "Pensador global, educador y mentor dedicado a la salud sostenible, nutrición conductual, liderazgo y potencial humano.",
    },
    de: {
      title: "Feras Alayed | Wissenszentrum",
      description: "Globaler Denker, Pädagoge und Mentor für nachhaltige Gesundheit, Verhaltensernährung, Führungsentwicklung und menschliches Potenzial.",
    },
    tr: {
      title: "Feras Alayed | Bilgi Merkezi",
      description: "Sürdürülebilir sağlık, davranışsal beslenme, liderlik gelişimi ve insan potansiyeline adanmış küresel düşünür ve eğitmen.",
    },
  },
  "/start": {
    ar: {
      title: "ابدأ هنا - منهج فراس العايد للتحول الصحي | Feel Great",
      description: "مسار واضح من 3 خطوات لبدء رحلتك الصحية مع منهج فراس العايد™ للتحول المستدام خلال 90 يوم.",
    },
    en: {
      title: "Start Here - Feras Alayed Method™ | Feel Great",
      description: "A clear 3-step path to begin your health transformation with the Feras Alayed Method™ 90-day sustainable program.",
    },
    fr: {
      title: "Commencez Ici - Méthode Feras Alayed™ | Feel Great",
      description: "Un parcours clair en 3 étapes pour commencer votre transformation santé avec la Méthode Feras Alayed™.",
    },
    es: {
      title: "Empieza Aquí - Método Feras Alayed™ | Feel Great",
      description: "Un camino claro de 3 pasos para comenzar tu transformación de salud con el Método Feras Alayed™.",
    },
    de: {
      title: "Starten Sie Hier - Feras Alayed Methode™ | Feel Great",
      description: "Ein klarer 3-Schritte-Weg, um Ihre Gesundheitstransformation mit der Feras Alayed Methode™ zu beginnen.",
    },
    tr: {
      title: "Buradan Başlayın - Feras Alayed Metodu™ | Feel Great",
      description: "Feras Alayed Metodu™ ile sağlık dönüşümünüze başlamak için net 3 adımlık bir yol.",
    },
  },
  "/ask-expert": {
    ar: {
      title: "اسأل الخبير فراس العايد | Feel Great",
      description: "اسأل فراس العايد مباشرة عن الصحة المستدامة، مقاومة الإنسولين، الصيام المتقطع، ومنتجات Feel Great. إجابات فورية مبنية على العلم.",
    },
    en: {
      title: "Ask Expert Feras Alayed | Feel Great",
      description: "Ask Feras Alayed directly about sustainable health, insulin resistance, intermittent fasting, and Feel Great products. Instant science-based answers.",
    },
    fr: {
      title: "Demandez à l'Expert Feras Alayed | Feel Great",
      description: "Posez vos questions à Feras Alayed sur la santé durable, la résistance à l'insuline et les produits Feel Great.",
    },
    es: {
      title: "Pregunta al Experto Feras Alayed | Feel Great",
      description: "Pregunta a Feras Alayed sobre salud sostenible, resistencia a la insulina y productos Feel Great.",
    },
    de: {
      title: "Fragen Sie Experte Feras Alayed | Feel Great",
      description: "Fragen Sie Feras Alayed zu nachhaltiger Gesundheit, Insulinresistenz und Feel Great Produkten.",
    },
    tr: {
      title: "Uzman Feras Alayed'e Sorun | Feel Great",
      description: "Feras Alayed'e sürdürülebilir sağlık, insülin direnci ve Feel Great ürünleri hakkında sorun.",
    },
  },
  "/privacy": {
    ar: {
      title: "سياسة الخصوصية | Feel Great",
      description: "سياسة الخصوصية لموقع Feel Great. كيف نجمع ونستخدم ونحمي بياناتك الشخصية.",
    },
    en: {
      title: "Privacy Policy | Feel Great",
      description: "Privacy Policy for Feel Great website. How we collect, use, and protect your personal data.",
    },
    fr: {
      title: "Politique de Confidentialité | Feel Great",
      description: "Politique de confidentialité du site Feel Great. Comment nous collectons et protégeons vos données.",
    },
    es: {
      title: "Política de Privacidad | Feel Great",
      description: "Política de privacidad del sitio Feel Great. Cómo recopilamos y protegemos sus datos.",
    },
    de: {
      title: "Datenschutzrichtlinie | Feel Great",
      description: "Datenschutzrichtlinie der Feel Great Website. Wie wir Ihre Daten sammeln und schützen.",
    },
    tr: {
      title: "Gizlilik Politikası | Feel Great",
      description: "Feel Great web sitesi gizlilik politikası. Verilerinizi nasıl topladığımız ve koruduğumuz.",
    },
  },
  "/terms": {
    ar: {
      title: "شروط الاستخدام | Feel Great",
      description: "شروط وأحكام استخدام موقع Feel Great والخدمات المقدمة.",
    },
    en: {
      title: "Terms of Use | Feel Great",
      description: "Terms and conditions for using the Feel Great website and services.",
    },
    fr: {
      title: "Conditions d'Utilisation | Feel Great",
      description: "Conditions d'utilisation du site Feel Great et des services proposés.",
    },
    es: {
      title: "Términos de Uso | Feel Great",
      description: "Términos y condiciones de uso del sitio Feel Great y servicios ofrecidos.",
    },
    de: {
      title: "Nutzungsbedingungen | Feel Great",
      description: "Nutzungsbedingungen der Feel Great Website und angebotenen Dienste.",
    },
    tr: {
      title: "Kullanım Koşulları | Feel Great",
      description: "Feel Great web sitesi ve sunulan hizmetlerin kullanım koşulları.",
    },
  },
  "/fasting-calculator": {
    ar: {
      title: "حاسبة مواعيد الصيام المتقطع 16:8 | Feras Alayed Method™",
      description: "أدخل وقت عشائك واحصل على جدول صيام 16:8 مخصص مع نصائح غذائية من برنامج الصحة المستدامة. أداة مجانية من فراس الآيد.",
    },
    en: {
      title: "16:8 Intermittent Fasting Schedule Calculator | Feras Alayed Method™",
      description: "Enter your dinner time and get a personalized 16:8 fasting schedule with nutrition guidelines from the Sustainable Health Program. Free tool by Feras Alayed.",
    },
    fr: {
      title: "Calculateur de Jeûne Intermittent 16:8 | Feras Alayed Method™",
      description: "Entrez l'heure de votre dîner et obtenez un programme de jeûne 16:8 personnalisé avec des conseils nutritionnels du Programme de Santé Durable.",
    },
    es: {
      title: "Calculadora de Ayuno Intermitente 16:8 | Feras Alayed Method™",
      description: "Ingresa la hora de tu cena y obtén un horario de ayuno 16:8 personalizado con pautas nutricionales del Programa de Salud Sostenible.",
    },
    de: {
      title: "16:8 Intervallfasten Zeitplan-Rechner | Feras Alayed Method™",
      description: "Geben Sie Ihre Abendessenszeit ein und erhalten Sie einen personalisierten 16:8 Fastenplan mit Ernährungsrichtlinien aus dem Nachhaltigen Gesundheitsprogramm.",
    },
    tr: {
      title: "16:8 Aralıklı Oruç Programı Hesaplayıcı | Feras Alayed Method™",
      description: "Akşam yemeği saatinizi girin ve Sürdürülebilir Sağlık Programı'ndan beslenme rehberiyle kişiselleştirilmiş 16:8 oruç programınızı alın.",
    },
  },
};

// Pillar pages meta data (keep as English/Arabic mixed since they're primarily Arabic content pages)
const PILLAR_META: Record<string, MetaData> = {
  "sustainable-health": {
    title: "Sustainable Health Guide - دليل الصحة المستدامة | Feel Great",
    description: "دليلك الشامل للصحة المستدامة. تعلم كيف تبني عادات صحية تدوم مدى الحياة مع نهج علمي متكامل.",
  },
  "insulin-resistance": {
    title: "Insulin Resistance Guide - دليل مقاومة الإنسولين | Feel Great",
    description: "كل ما تحتاج معرفته عن مقاومة الإنسولين: الأسباب، الأعراض، التشخيص، والحلول الطبيعية المدعومة بالعلم.",
  },
  "prediabetes": {
    title: "Prediabetes Prevention - الوقاية من مقدمات السكري | Feel Great",
    description: "دليل علمي شامل للوقاية من مقدمات السكري وعكسها. استراتيجيات غذائية وسلوكية مثبتة علمياً.",
  },
  "weight-loss-after-40": {
    title: "Weight Loss After 40 - إنقاص الوزن بعد الأربعين | Feel Great",
    description: "استراتيجيات علمية لإنقاص الوزن بعد سن الأربعين. تعامل مع التغيرات الهرمونية والأيضية بذكاء.",
  },
  "metabolic-health": {
    title: "Metabolic Health Guide - دليل الصحة الأيضية | Feel Great",
    description: "فهم صحتك الأيضية وتحسينها. دليل شامل يغطي السكر، الدهون، ضغط الدم، ومحيط الخصر.",
  },
  "gut-health": {
    title: "Gut Health Guide - دليل صحة الأمعاء | Feel Great",
    description: "دليلك لصحة أمعاء مثالية. الميكروبيوم، الألياف، البروبيوتيك، وعلاقة الأمعاء بالصحة العامة.",
  },
  "healthy-aging": {
    title: "Healthy Aging Guide - دليل الشيخوخة الصحية | Feel Great",
    description: "كيف تتقدم في العمر بصحة ونشاط. استراتيجيات علمية للحفاظ على الحيوية والوقاية من أمراض الشيخوخة.",
  },
  "energy-fatigue": {
    title: "Energy & Fatigue Guide - دليل الطاقة والإرهاق | Feel Great",
    description: "تغلب على الإرهاق المزمن واستعد طاقتك. حلول علمية لتحسين مستويات الطاقة طوال اليوم.",
  },
  "behavioral-nutrition": {
    title: "Behavioral Nutrition Guide - دليل التغذية السلوكية | Feel Great",
    description: "فهم العلاقة بين السلوك والتغذية. كيف تبني عادات غذائية صحية مستدامة بدون حرمان.",
  },
};

// Health condition pages meta
const HEALTH_META: Record<string, MetaData> = {
  "insulin-resistance": {
    title: "Insulin Resistance - مقاومة الإنسولين | Feel Great",
    description: "دليل شامل عن مقاومة الإنسولين: الأعراض، الأسباب، التشخيص، وخطة العلاج الطبيعية.",
  },
  "type-2-diabetes": {
    title: "Type 2 Diabetes - السكري النوع الثاني | Feel Great",
    description: "معلومات علمية عن السكري النوع الثاني وكيفية إدارته بالتغذية والنشاط البدني.",
  },
  "fatty-liver": {
    title: "Fatty Liver - الكبد الدهني | Feel Great",
    description: "دليل الكبد الدهني: الأسباب، المراحل، والحلول الغذائية المثبتة علمياً.",
  },
  "ibs-digestive": {
    title: "IBS & Digestive Health - القولون العصبي | Feel Great",
    description: "دليل القولون العصبي والصحة الهضمية. حلول غذائية وسلوكية لتحسين الهضم.",
  },
  "obesity": {
    title: "Obesity Management - إدارة السمنة | Feel Great",
    description: "نهج علمي شامل لإدارة السمنة. فهم الأسباب الأيضية والسلوكية وخطة العلاج.",
  },
  "pcos": {
    title: "PCOS - متلازمة تكيس المبايض | Feel Great",
    description: "دليل متلازمة تكيس المبايض: العلاقة بمقاومة الإنسولين والحلول الغذائية.",
  },
  "cholesterol": {
    title: "Cholesterol Management - إدارة الكوليسترول | Feel Great",
    description: "فهم الكوليسترول وإدارته بشكل طبيعي. الفرق بين HDL و LDL والحلول الغذائية.",
  },
  "hypertension": {
    title: "Hypertension - ارتفاع ضغط الدم | Feel Great",
    description: "دليل ارتفاع ضغط الدم: الأسباب، المخاطر، والحلول الطبيعية المدعومة بالعلم.",
  },
};

/**
 * Get the title/description for an article in the specified language.
 * Falls back to English, then Arabic.
 */
function getArticleTitle(article: any, lang: SupportedLang): string {
  switch (lang) {
    case "ar": return article.metaTitleAr || article.titleAr || article.titleEn;
    case "en": return article.metaTitleEn || article.titleEn || article.titleAr;
    case "fr": return article.titleFr || article.metaTitleEn || article.titleEn;
    case "es": return article.titleEs || article.metaTitleEn || article.titleEn;
    case "de": return article.titleDe || article.metaTitleEn || article.titleEn;
    case "tr": return article.titleTr || article.metaTitleEn || article.titleEn;
    default: return article.metaTitleEn || article.titleEn;
  }
}

function getArticleDescription(article: any, lang: SupportedLang): string {
  switch (lang) {
    case "ar": return article.metaDescriptionAr || article.excerptAr || article.excerptEn;
    case "en": return article.metaDescriptionEn || article.excerptEn || article.excerptAr;
    case "fr": return article.excerptFr || article.metaDescriptionEn || article.excerptEn;
    case "es": return article.excerptEs || article.metaDescriptionEn || article.excerptEn;
    case "de": return article.excerptDe || article.metaDescriptionEn || article.excerptEn;
    case "tr": return article.excerptTr || article.metaDescriptionEn || article.excerptEn;
    default: return article.metaDescriptionEn || article.excerptEn;
  }
}

/**
 * Get the title/description for a research study in the specified language.
 */
function getResearchTitle(study: any, lang: SupportedLang): string {
  switch (lang) {
    case "ar": return study.metaTitleAr || study.titleAr || study.titleEn;
    case "en": return study.metaTitleEn || study.titleEn || study.originalTitle;
    case "fr": return study.titleFr || study.metaTitleEn || study.titleEn;
    case "es": return study.titleEs || study.metaTitleEn || study.titleEn;
    case "de": return study.titleDe || study.metaTitleEn || study.titleEn;
    case "tr": return study.titleTr || study.metaTitleEn || study.titleEn;
    default: return study.metaTitleEn || study.titleEn;
  }
}

function getResearchDescription(study: any, lang: SupportedLang): string {
  switch (lang) {
    case "ar": return study.metaDescriptionAr || study.summary30sAr || study.summary30sEn;
    case "en": return study.metaDescriptionEn || study.summary30sEn || study.summary30sAr;
    case "fr": return study.summary30sFr || study.metaDescriptionEn || study.summary30sEn;
    case "es": return study.summary30sEs || study.metaDescriptionEn || study.summary30sEn;
    case "de": return study.summary30sDe || study.metaDescriptionEn || study.summary30sEn;
    case "tr": return study.summary30sTr || study.metaDescriptionEn || study.summary30sEn;
    default: return study.metaDescriptionEn || study.summary30sEn;
  }
}

/**
 * Get meta data for a blog article from database (language-aware)
 */
async function getArticleMeta(slug: string, lang: SupportedLang): Promise<MetaData | null> {
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return null;

    const title = getArticleTitle(article, lang);
    const description = getArticleDescription(article, lang);
    const image = article.heroImageUrl || article.ogImageUrl || DEFAULT_IMAGE;
    const publishedAt = article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined;
    const updatedAt = article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined;
    const canonicalUrl = buildLangUrl(lang, `/blog/${slug}`);
    const inLanguage = lang === "ar" ? "ar" : lang;

    // Build Article JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": ["Article", "NewsArticle"],
      "headline": title,
      "description": description,
      "image": image.startsWith("/") ? `${BASE_URL}${image}` : image,
      "author": {
        "@type": "Person",
        "@id": `${BASE_URL}/#feras-alayed`,
        "name": lang === "ar" ? AUTHOR_NAME_AR : AUTHOR_NAME,
        "url": `${BASE_URL}/feras-alayed`,
      },
      "publisher": {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Feel Great Health by Feras Alayed",
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}${DEFAULT_IMAGE}`, "width": 600, "height": 60 },
        "url": BASE_URL,
      },
      "datePublished": publishedAt,
      "dateModified": updatedAt || publishedAt,
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "wordCount": article.wordCount || undefined,
      "articleSection": article.category,
      "isAccessibleForFree": true,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".article-headline", ".article-summary", ".key-takeaways"]
      },
      "inLanguage": inLanguage,
    };

    return {
      title: `${title} | ${SITE_NAME}`,
      description: description?.substring(0, 160) || "",
      ogTitle: title,
      ogDescription: description?.substring(0, 200) || "",
      ogImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      ogType: "article",
      ogUrl: canonicalUrl,
      twitterTitle: title,
      twitterDescription: description?.substring(0, 200) || "",
      twitterImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      canonicalUrl,
      articlePublishedTime: publishedAt,
      articleModifiedTime: updatedAt || publishedAt,
      articleAuthor: lang === "ar" ? AUTHOR_NAME_AR : AUTHOR_NAME,
      articleSection: article.category,
      jsonLd,
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      hreflangPath: `/blog/${slug}`,
    };
  } catch (error) {
    console.error("[MetaInjector] Error fetching article meta:", error);
    return null;
  }
}

/**
 * Get meta data for a research study from database (language-aware)
 */
async function getResearchMeta(slug: string, lang: SupportedLang): Promise<MetaData | null> {
  try {
    const study = await getResearchBySlug(slug);
    if (!study) return null;

    const title = getResearchTitle(study, lang);
    const description = getResearchDescription(study, lang);
    const image = study.heroImageUrl || DEFAULT_IMAGE;
    const canonicalUrl = buildLangUrl(lang, `/research/${slug}`);

    // Build ScholarlyArticle JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": title,
      "description": description,
      "image": image.startsWith("/") ? `${BASE_URL}${image}` : image,
      "author": study.authors ? study.authors.split(",").map(a => ({
        "@type": "Person",
        "name": a.trim(),
      })) : undefined,
      "publisher": {
        "@type": "Organization",
        "name": study.journal,
      },
      "datePublished": study.publishDate,
      "about": study.topics,
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "inLanguage": lang,
    };

    return {
      title: `${title} | Research | ${SITE_NAME}`,
      description: description?.substring(0, 160) || "",
      ogTitle: title,
      ogDescription: description?.substring(0, 200) || "",
      ogImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      ogType: "article",
      ogUrl: canonicalUrl,
      twitterTitle: title,
      twitterDescription: description?.substring(0, 200) || "",
      canonicalUrl,
      jsonLd,
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      hreflangPath: `/research/${slug}`,
    };
  } catch (error) {
    console.error("[MetaInjector] Error fetching research meta:", error);
    return null;
  }
}

/**
 * Resolve meta data for any given URL path (language-aware)
 */
async function resolveMetaForPath(path: string): Promise<MetaData | null> {
  const { lang, cleanPath } = extractLangFromPath(path);

  // Check static pages with language-specific content
  if (STATIC_META_BY_LANG[cleanPath]) {
    const langMeta = STATIC_META_BY_LANG[cleanPath][lang] || STATIC_META_BY_LANG[cleanPath]["en"];
    const canonicalUrl = buildLangUrl(lang, cleanPath);
    return {
      title: langMeta.title,
      description: langMeta.description,
      ogTitle: langMeta.title,
      ogDescription: langMeta.description,
      twitterTitle: langMeta.title,
      twitterDescription: langMeta.description,
      canonicalUrl,
      ogUrl: canonicalUrl,
      ogType: cleanPath === "/author/feras-alayed" || cleanPath === "/feras-alayed" || cleanPath === "/about" ? "profile" : "website",
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      hreflangPath: cleanPath,
      // Add Person JSON-LD for author/feras-alayed pages
      ...(cleanPath === "/feras-alayed" ? {
        ogImage: "/manus-storage/feras-professional_115956a2.png",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://feelgreat.us.com/#feras-alayed",
          "name": "Feras Alayed",
          "alternateName": ["فراس العايد", "Feras Al-Ayed"],
          "jobTitle": "Global Thinker, Educator & Mentor in Sustainable Health, Behavioral Nutrition, Leadership & Human Potential",
          "description": "Global thinker, educator, and mentor dedicated to sustainable health, behavioral nutrition, leadership development, human potential, entrepreneurship, and financial empowerment.",
          "url": "https://feelgreat.us.com/feras-alayed",
          "image": "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
          "sameAs": ["https://www.instagram.com/use2lose", "https://www.tiktok.com/@feras.alayed"],
          "knowsAbout": ["Sustainable Health", "Behavioral Nutrition", "Therapeutic Nutrition", "Metabolic Health", "Leadership Development", "Human Potential"],
          "worksFor": { "@type": "Organization", "name": "Feras Alayed - Knowledge Hub", "url": "https://feelgreat.us.com" },
          "nationality": { "@type": "Country", "name": "Saudi Arabia" },
        },
      } : {}),
    };
  }

  // Blog article: /blog/:slug
  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return getArticleMeta(blogMatch[1], lang);
  }

  // Research study: /research/:slug
  const researchMatch = cleanPath.match(/^\/research\/([^/]+)$/);
  if (researchMatch) {
    return getResearchMeta(researchMatch[1], lang);
  }

  // Pillar pages: /topics/:slug
  const topicMatch = cleanPath.match(/^\/topics\/([^/]+)$/);
  if (topicMatch && PILLAR_META[topicMatch[1]]) {
    const meta = PILLAR_META[topicMatch[1]];
    const canonicalUrl = buildLangUrl(lang, cleanPath);
    return { ...meta, canonicalUrl, ogUrl: canonicalUrl, ogType: "article", lang, dir: lang === "ar" ? "rtl" : "ltr", hreflangPath: cleanPath };
  }

  // Health Library hub pages: /health-library/:slug
  const libraryMatch = cleanPath.match(/^\/health-library\/([^/]+)$/);
  if (libraryMatch) {
    const hubSlug = libraryMatch[1];
    const hubNames: Record<string, string> = {
      "insulin-resistance": "Insulin Resistance Hub",
      "gut-health": "Gut Health Hub",
      "sustainable-health": "Sustainable Health Hub",
      "weight-loss": "Weight Loss Hub",
      "sleep": "Sleep & Energy Hub",
      "womens-health": "Women's Health Hub",
      "metabolic-health": "Metabolic Health Hub",
    };
    const hubName = hubNames[hubSlug] || `${hubSlug} Hub`;
    const canonicalUrl = buildLangUrl(lang, cleanPath);
    return {
      title: `${hubName} | Health Library | ${SITE_NAME}`,
      description: `Explore our ${hubName} with research-backed articles on ${hubSlug.replace(/-/g, ' ')}. Evidence-based health information from Feel Great.`,
      canonicalUrl,
      ogUrl: canonicalUrl,
      ogType: "website",
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      hreflangPath: cleanPath,
    };
  }

  // Health condition pages: /health/:slug
  const healthMatch = cleanPath.match(/^\/health\/([^/]+)$/);
  if (healthMatch && HEALTH_META[healthMatch[1]]) {
    const meta = HEALTH_META[healthMatch[1]];
    const canonicalUrl = buildLangUrl(lang, cleanPath);
    return { ...meta, canonicalUrl, ogUrl: canonicalUrl, ogType: "article", lang, dir: lang === "ar" ? "rtl" : "ltr", hreflangPath: cleanPath };
  }

  return null;
}

/**
 * Generate hreflang link tags for all supported languages
 */
function generateHreflangTags(cleanPath: string): string {
  const tags: string[] = [];
  for (const supportedLang of SUPPORTED_LANGS) {
    const href = buildLangUrl(supportedLang, cleanPath);
    tags.push(`<link rel="alternate" hreflang="${supportedLang}" href="${href}" />`);
  }
  // x-default points to English version
  tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}${cleanPath}" />`);
  return tags.join("\n    ");
}

/**
 * Inject meta tags into the HTML template
 */
function injectMetaIntoHtml(html: string, meta: MetaData): string {
  // Update <html lang> and dir attributes
  if (meta.lang) {
    html = html.replace(/<html[^>]*>/, `<html lang="${meta.lang}" dir="${meta.dir || (meta.lang === 'ar' ? 'rtl' : 'ltr')}">`);
  }

  // Title - handle both regular titles and {{project_title}} placeholder
  if (meta.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    html = html.replace(/<title>\{\{project_title\}\}<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  }

  // Description
  if (meta.description) {
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(meta.description)}" />`
    );
  }

  // Open Graph
  if (meta.ogTitle) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`
    );
  }
  if (meta.ogDescription) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`
    );
  }
  if (meta.ogImage) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`
    );
  }
  if (meta.ogType) {
    html = html.replace(
      /<meta property="og:type" content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${escapeAttr(meta.ogType)}" />`
    );
  }

  // Twitter
  if (meta.twitterTitle) {
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttr(meta.twitterTitle)}" />`
    );
  }
  if (meta.twitterDescription) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttr(meta.twitterDescription)}" />`
    );
  }

  // Add additional meta tags before </head>
  const additionalMeta: string[] = [];

  // OG URL
  if (meta.ogUrl) {
    additionalMeta.push(`<meta property="og:url" content="${escapeAttr(meta.ogUrl)}" />`);
  }

  // OG site name
  additionalMeta.push(`<meta property="og:site_name" content="${SITE_NAME}" />`);

  // OG locale
  if (meta.lang) {
    const localeMap: Record<string, string> = {
      ar: "ar_SA", en: "en_US", fr: "fr_FR", es: "es_ES", de: "de_DE", tr: "tr_TR",
    };
    additionalMeta.push(`<meta property="og:locale" content="${localeMap[meta.lang] || "en_US"}" />`);
  }

  // Article-specific meta
  if (meta.articlePublishedTime) {
    additionalMeta.push(`<meta property="article:published_time" content="${meta.articlePublishedTime}" />`);
  }
  if (meta.articleModifiedTime) {
    additionalMeta.push(`<meta property="article:modified_time" content="${meta.articleModifiedTime}" />`);
  }
  if (meta.articleAuthor) {
    additionalMeta.push(`<meta property="article:author" content="${escapeAttr(meta.articleAuthor)}" />`);
  }
  if (meta.articleSection) {
    additionalMeta.push(`<meta property="article:section" content="${escapeAttr(meta.articleSection)}" />`);
  }

  // Canonical URL
  if (meta.canonicalUrl) {
    additionalMeta.push(`<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`);
  }

  // Hreflang tags - critical for multilingual SEO
  if (meta.hreflangPath) {
    additionalMeta.push(generateHreflangTags(meta.hreflangPath));
  }

  // JSON-LD structured data
  if (meta.jsonLd) {
    additionalMeta.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`);
  }

  // Inject before </head>
  if (additionalMeta.length > 0) {
    html = html.replace("</head>", `    ${additionalMeta.join("\n    ")}\n  </head>`);
  }

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Express middleware that intercepts HTML responses and injects SEO meta tags
 */
export function createMetaInjectorMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only process GET requests for HTML pages (not API, assets, etc.)
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api/") || req.path.startsWith("/manus-storage/") || req.path.includes(".")) {
      return next();
    }

    // Resolve meta for this path
    const meta = await resolveMetaForPath(req.path);
    if (!meta) return next();

    // Store meta in request for downstream use
    (req as any).__seoMeta = meta;
    next();
  };
}

/**
 * Get the resolved meta from request (set by middleware)
 */
export function getResolvedMeta(req: Request): MetaData | null {
  return (req as any).__seoMeta || null;
}

export { MetaData, resolveMetaForPath, injectMetaIntoHtml, extractLangFromPath, buildLangUrl, generateHreflangTags };
