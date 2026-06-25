# Manus - إضافة المقالات العالمية للقسم الجديد

## المهمة الرئيسية

في الموقع يوجد زر جديد في القائمة اسمه **"مقالات عالمية" (Global Articles)**.

المقالات المطلوبة موجودة في ملف على GitHub:
```
https://github.com/ferasayed/Feelgreat-new/blob/main/MANUS-COMPLETE-ARTICLES-PROMPT.md
```

## المطلوب منك

### 1. اقرأ الملف من GitHub
- افتح الرابط أعلاه
- انسخ كل المحتوى (30 مقال)

### 2. وزع المقالات على 4 أقسام داخل "مقالات عالمية"

| القسم | عدد المقالات | البلد/المنطقة |
|-------|-------------|---------------|
| Canadian / كندي | 5 مقالات | كندا (mmol/L) |
| American / أمريكي | 10 مقالات | أمريكا (mg/dL) |
| German / ألماني | 5 مقالات | ألمانيا (mmol/L) |
| European / أوروبي | 10 مقالات | أوروبا (mmol/L) |

### 3. إضافة المقال للـ Route

أضف Route جديد في `client/src/App.tsx`:

```tsx
// أضف هذا الاستيراد
const GlobalArticles = lazy(() => import("./pages/GlobalArticles"));

// أضف هذه الراوت
<Route path="/global-articles" component={GlobalArticles} />
<Route path="/global-articles/:slug" component={GlobalArticleDetail} />
```

### 4. إنشاء صفحة GlobalArticles.tsx

أنشئ ملف جديد: `client/src/pages/GlobalArticles.tsx`

### 5. هيكل الصفحة المطلوب

```tsx
//client/src/pages/GlobalArticles.tsx

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, MapPin, TrendingUp, Users, Heart, Activity } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  description: string;
  region: 'canadian' | 'american' | 'german' | 'european';
  flag: string;
}

const globalArticles: Article[] = [
  // =================================================================
  // CANADIAN ARTICLES (5) - mmol/L units
  // =================================================================
  {
    slug: "prediabetes-canada",
    title: "Understanding Prediabetes in Canada: Statistics and Prevention",
    description: "Learn about prediabetes rates in Canada, risk factors, and how to prevent type 2 diabetes.",
    region: 'canadian',
    flag: "🇨🇦"
  },
  {
    slug: "diabetes-statistics-canada",
    title: "Diabetes Statistics in Canada 2024",
    description: "Current diabetes prevalence, costs, and management strategies in Canada.",
    region: 'canadian',
    flag: "🇨🇦"
  },
  {
    slug: "heart-health-canada",
    title: "Heart Disease and Blood Sugar: Canadian Health Insights",
    description: "Connection between cardiovascular health and blood sugar levels in Canadians.",
    region: 'canadian',
    flag: "🇨🇦"
  },
  {
    slug: "canadian-healthcare-diabetes",
    title: "Canadian Healthcare System and Diabetes Management",
    description: "How Canadians access diabetes care through public healthcare.",
    region: 'canadian',
    flag: "🇨🇦"
  },
  {
    slug: "dietary-guidelines-canada",
    title: "Canada's Dietary Guidelines for Blood Sugar Control",
    description: "Health Canada's nutrition recommendations for diabetes prevention.",
    region: 'canadian',
    flag: "🇨🇦"
  },

  // =================================================================
  // AMERICAN ARTICLES (10) - mg/dL units - FDA, CDC, ADA
  // =================================================================
  {
    slug: "prediabetes-america",
    title: "Prediabetes in America: The Silent Epidemic",
    description: "CDC statistics on prediabetes affecting 96 million Americans.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "diabetes-statistics-usa",
    title: "Diabetes Statistics USA 2024",
    description: "American Diabetes Association data on diabetes prevalence and costs.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "type2-diabetes-prevention-usa",
    title: "Preventing Type 2 Diabetes: Evidence-Based Strategies",
    description: "FDA-approved prevention programs and lifestyle interventions.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "blood-sugar-levels-usa",
    title: "Understanding Blood Sugar Levels: American Standards",
    description: "Normal, prediabetic, and diabetic blood glucose ranges in mg/dL.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "heart-disease-usa",
    title: "Heart Disease and Diabetes Connection in America",
    description: "CDC statistics on cardiovascular complications from diabetes.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "a1c-test-usa",
    title: "A1C Test: The Gold Standard for Diabetes Monitoring",
    description: "How the A1C test works and what your results mean.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "obesity-america",
    title: "Obesity and Diabetes: America's Health Crisis",
    description: "Statistics on obesity's role in diabetes development.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "diabetes-cost-usa",
    title: "The Economic Cost of Diabetes in America",
    description: "Financial impact of diabetes on individuals and healthcare system.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "intermittent-fasting-usa",
    title: "Intermittent Fasting for Blood Sugar Control",
    description: "Scientific evidence on fasting benefits for insulin sensitivity.",
    region: 'american',
    flag: "🇺🇸"
  },
  {
    slug: "insulin-resistance-diet-usa",
    title: "Diet Strategies for Insulin Resistance",
    description: "American Dietetic Association recommendations for blood sugar management.",
    region: 'american',
    flag: "🇺🇸"
  },

  // =================================================================
  // GERMAN ARTICLES (5) - mmol/L units - DGK, RKI, DDG, GKV
  // =================================================================
  {
    slug: "prediabetes-germany",
    title: "Prädiabetes in Deutschland: Statistiken und Prävention",
    description: "Prädiabetes-Raten in Deutschland, Risikofaktoren und Präventionsstrategien.",
    region: 'german',
    flag: "🇩🇪"
  },
  {
    slug: "diabetes-statistics-germany",
    title: "Diabetes-Statistik Deutschland 2024",
    description: "Aktuelle Diabetesprävalenz, Kosten und Managementstrategien in Deutschland.",
    region: 'german',
    flag: "🇩🇪"
  },
  {
    slug: "heart-health-germany",
    title: "Herzgesundheit und Blutzucker: Deutsche Gesundheitseinblicke",
    description: "Zusammenhang zwischen Herz-Kreislauf-Gesundheit und Blutzuckerspiegel.",
    region: 'german',
    flag: "🇩🇪"
  },
  {
    slug: "german-diet-culture",
    title: "Deutsche Ernährungskultur und Blutzucker",
    description: "Wie traditionelle deutsche Ernährung den Blutzucker beeinflusst.",
    region: 'german',
    flag: "🇩🇪"
  },
  {
    slug: "health-insurance-germany",
    title: "Deutschlands Gesundheitssystem und Diabetesversorgung",
    description: "Wie Deutsche durch das GKV-System Zugang zur Diabetesversorgung haben.",
    region: 'german',
    flag: "🇩🇪"
  },

  // =================================================================
  // EUROPEAN ARTICLES (10) - mmol/L units - EMA, EASD, IDF, WHO
  // =================================================================
  {
    slug: "prediabetes-europe",
    title: "Prediabetes Across Europe: A Growing Concern",
    description: "IDF Europe statistics on prediabetes affecting European populations.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "diabetes-statistics-europe",
    title: "Diabetes Statistics Europe 2024",
    description: "EASD and WHO data on diabetes prevalence across European countries.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "heart-health-europe",
    title: "Cardiovascular Health and Blood Sugar in Europe",
    description: "European Heart Journal research on diabetes and heart disease.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "european-healthcare-systems",
    title: "European Healthcare Systems and Diabetes Care",
    description: "How European countries provide universal diabetes coverage.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "mediterranean-diet-europe",
    title: "Mediterranean Diet: Europe's Secret to Blood Sugar Control",
    description: "Scientific evidence on Mediterranean diet benefits for diabetes prevention.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "insulin-resistance-europe",
    title: "Insulin Resistance: The European Perspective",
    description: "European research on insulin resistance causes and treatments.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "blood-sugar-monitoring-europe",
    title: "Blood Sugar Monitoring Guidelines: European Standards",
    description: "EMA-approved monitoring protocols for diabetes management.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "obesity-europe",
    title: "Obesity and Diabetes Crisis in Europe",
    description: "WHO Europe statistics on obesity-driven diabetes epidemic.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "intermittent-fasting-europe",
    title: "Intermittent Fasting: European Clinical Trials",
    description: "European research on fasting protocols for metabolic health.",
    region: 'european',
    flag: "🇪🇺"
  },
  {
    slug: "europe-diabetes-prevention",
    title: "Diabetes Prevention Programs Across Europe",
    description: "Successful prevention models from European health systems.",
    region: 'european',
    flag: "🇪🇺"
  },
];

export default function GlobalArticles() {
  const { lang, t } = useLanguage();

  const regionLabels = {
    en: {
      canadian: "Canadian Market",
      american: "American Market",
      german: "German Market",
      european: "European Market",
      canadianDesc: "Health insights for Canada with mmol/L standards",
      americanDesc: "US health data with FDA, CDC, ADA sources",
      germanDesc: "German health information with DGK, RKI standards",
      europeanDesc: "European health data with WHO, IDF, EASD sources",
    },
    ar: {
      canadian: "السوق الكندي",
      american: "السوق الأمريكي",
      german: "السوق الألماني",
      european: "السوق الأوروبي",
      canadianDesc: "معلومات صحية لكندا بمعايير mmol/L",
      americanDesc: "بيانات صحية أمريكية من CDC, ADA, FDA",
      germanDesc: "معلومات صحية ألمانية من DGK, RKI",
      europeanDesc: "بيانات صحية أوروبية من WHO, IDF, EASD",
    },
    de: {
      canadian: "Kanadischer Markt",
      american: "Amerikanischer Markt",
      german: "Deutscher Markt",
      european: "Europäischer Markt",
      canadianDesc: "Gesundheitseinblicken für Kanada mit mmol/L Standards",
      americanDesc: "US-Gesundheitsdaten mit FDA, CDC, ADA Quellen",
      germanDesc: "Deutsche Gesundheitsinformationen mit DGK, RKI Standards",
      europeanDesc: "Europäische Gesundheitsdaten mit WHO, IDF, EASD Quellen",
    },
    fr: {
      canadian: "Marché Canadien",
      american: "Marché Américain",
      german: "Marché Allemand",
      european: "Marché Européen",
      canadianDesc: "Aperçus santé pour le Canada avec normes mmol/L",
      americanDesc: "Données santé américaines avec sources FDA, CDC, ADA",
      germanDesc: "Informations santé allemandes avec normes DGK, RKI",
      europeanDesc: "Données santé européennes avec sources OMS, IDF, EASD",
    },
    es: {
      canadian: "Mercado Canadiense",
      american: "Mercado Americano",
      german: "Mercado Alemán",
      european: "Mercado Europeo",
      canadianDesc: "Perspectivas de salud para Canadá con estándares mmol/L",
      americanDesc: "Datos de salud de EE.UU. con fuentes FDA, CDC, ADA",
      germanDesc: "Información de salud alemana con estándares DGK, RKI",
      europeanDesc: "Datos de salud europeos con fuentes OMS, IDF, EASD",
    },
    tr: {
      canadian: "Kanada Pazarı",
      american: "Amerika Pazarı",
      german: "Alman Pazarı",
      european: "Avrupa Pazarı",
      canadianDesc: "Kanada için mmol/L standartlarıyla sağlık bilgileri",
      americanDesc: "FDA, CDC, ADA kaynaklarıyla ABD sağlık verileri",
      germanDesc: "DGK, RKI standartlarıyla Alman sağlık bilgileri",
      europeanDesc: "WHO, IDF, EASD kaynaklarıyla Avrupa sağlık verileri",
    },
  };

  const labels = regionLabels[lang as keyof typeof regionLabels] || regionLabels.en;

  const regions = [
    { key: 'canadian' as const, icon: MapPin, color: 'bg-red-500/10 border-red-500/30' },
    { key: 'american' as const, icon: TrendingUp, color: 'bg-blue-500/10 border-blue-500/30' },
    { key: 'german' as const, icon: Activity, color: 'bg-yellow-500/10 border-yellow-500/30' },
    { key: 'european' as const, icon: Globe, color: 'bg-purple-500/10 border-purple-500/30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "مقالات عالمية" : lang === "de" ? "Globale Artikel" : lang === "fr" ? "Articles Mondiaux" : lang === "es" ? "Artículos Globales" : lang === "tr" ? "Küresel Makaleler" : "Global Articles"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {lang === "ar" ? "مقالات صحية من جميع أنحاء العالم" :
             lang === "de" ? "Gesundheitsartikel aus aller Welt" :
             lang === "fr" ? "Articles de Santé du Monde Entier" :
             lang === "es" ? "Artículos de Salud de Todo el Mundo" :
             lang === "tr" ? "Dünya Genelinde Sağlık Makaleleri" :
             "Health Articles from Around the World"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "ar" ? "اكتشف أحدث الأبحاث والمعلومات الصحية من أمريكا وأوروبا وألمانيا وكندا" :
             lang === "de" ? "Entdecken Sie die neuesten Forschungen und Gesundheitsinformationen aus Amerika, Europa, Deutschland und Kanada" :
             lang === "fr" ? "Découvrez les dernières recherches et informations de santé d'Amérique, d'Europe, d'Allemagne et du Canada" :
             lang === "es" ? "Descubra las últimas investigaciones e información de salud de América, Europa, Alemania y Canadá" :
             lang === "tr" ? "Amerika, Avrupa, Almanya ve Kanada'dan en son araştırmaları ve sağlık bilgilerini keşfedin" :
             "Discover the latest research and health information from America, Europe, Germany, and Canada"}
          </p>
        </div>

        {/* Regional Sections */}
        {regions.map(({ key, icon: Icon, color }) => {
          const articles = globalArticles.filter(a => a.region === key);
          return (
            <section key={key} className="mb-16">
              <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl border ${color}`}>
                <Icon className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold">{labels[key]}</h2>
                  <p className="text-sm text-muted-foreground">{labels[`${key}Desc` as keyof typeof labels]}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <a key={article.slug} href={`/global-articles/${article.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{article.flag}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl p-8">
          <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">
            {lang === "ar" ? "هل تريد تحسين صحتك؟" :
             lang === "de" ? "Möchten Sie Ihre Gesundheit verbessern?" :
             lang === "fr" ? "Vous voulez améliorer votre santé?" :
             lang === "es" ? "¿Quiere mejorar su salud?" :
             lang === "tr" ? "Sağlığınızı iyileştirmek istiyor musunuz?" :
             "Want to Improve Your Health?"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" ? "ابدأ رحلتك مع Unimate اليوم" :
             lang === "de" ? "Starten Sie heute Ihre Reise mit Unimate" :
             lang === "fr" ? "Commencez votre voyage avec Unimate aujourd'hui" :
             lang === "es" ? "Comience su viaje con Unimate hoy" :
             lang === "tr" ? "Bugün Unimate ile yolculuğunuza başlayın" :
             "Start your journey with Unimate today"}
          </p>
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gradient-blue text-white">
              {lang === "ar" ? "ابدأ الآن" :
               lang === "de" ? "Jetzt Starten" :
               lang === "fr" ? "Commencer" :
               lang === "es" ? "Comenzar" :
               lang === "tr" ? "Şimdi Başla" :
               "Get Started Now"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 6. إنشاء صفحة التفاصيل GlobalArticleDetail

أنشئ ملف: `client/src/pages/GlobalArticleDetail.tsx`

هذا الملف يعرض المقال الكامل مع:
- العنوان والوصف
- محتوى المقال من ملف GitHub
- إحصائيات من المصادر المناسبة (CDC, NHS, DGK, WHO)
- أزرار المشاركة
- CTA للـ Unimate

### 7. تحديث sitemap.xml

أضف جميع الصفحات الجديدة:
```xml
<url>
  <loc>https://feelgreat.us.com/global-articles</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
<!-- أضف كل مقال من الـ 30 -->
```

## مصادر البيانات لكل قسم

### Canadian (mmol/L)
- Health Canada
- Canadian Diabetes Association
- Statistics Canada
- CIHR (Canadian Institutes of Health Research)

### American (mg/dL)
- CDC (Centers for Disease Control)
- ADA (American Diabetes Association)
- FDA (Food and Drug Administration)
- NIH (National Institutes of Health)

### German (mmol/L)
- DGK (Deutsche Gesellschaft für Kardiologie)
- RKI (Robert Koch Institut)
- DDG (Deutsche Diabetes Gesellschaft)
- GKV (Gesetzliche Krankenversicherung)

### European (mmol/L)
- WHO Europe
- IDF Europe (International Diabetes Federation)
- EASD (European Association for the Study of Diabetes)
- EMA (European Medicines Agency)

## ملاحظات مهمة

1. **الوحدات**: استخدم mg/dL للأمريكي، mmol/L لباقي الدول
2. **المراجع**: أضف روابط للمصادر الرسمية
3. **ال SEO**: أضف meta descriptions و schema markup
4. **التصميم**: استخدم نفس أسلوب الصفحات الموجودة

---

**رابط المقالات على GitHub:**
https://github.com/ferasayed/Feelgreat-new/blob/main/MANUS-COMPLETE-ARTICLES-PROMPT.md
