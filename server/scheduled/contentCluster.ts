/**
 * CONTENT CLUSTER ENGINE
 * 
 * Manages topic clusters and automatic internal linking between articles.
 * Each pillar has a cluster of related articles that link to each other.
 * 
 * Features:
 * 1. Defines topic clusters with pillar pages as hubs
 * 2. Auto-generates contextual internal links for new articles
 * 3. Connects articles within the same cluster bidirectionally
 * 4. Suggests cross-cluster links for related topics
 */

// ============================================================
// TOPIC CLUSTER DEFINITIONS
// ============================================================

export interface TopicCluster {
  id: string;
  nameEn: string;
  nameAr: string;
  pillarPath: string; // The hub page URL
  relatedClusters: string[]; // IDs of related clusters for cross-linking
  keywords: string[]; // Keywords that identify this cluster
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: "insulin-resistance",
    nameEn: "Insulin Resistance",
    nameAr: "مقاومة الأنسولين",
    pillarPath: "/health/insulin-resistance",
    relatedClusters: ["diabetes", "weight-management", "fatty-liver", "intermittent-fasting"],
    keywords: ["insulin", "blood sugar", "glucose", "A1C", "prediabetes", "insulin sensitivity", "metabolic syndrome"],
  },
  {
    id: "diabetes",
    nameEn: "Type 2 Diabetes",
    nameAr: "السكري النوع الثاني",
    pillarPath: "/health/type-2-diabetes",
    relatedClusters: ["insulin-resistance", "weight-management", "gut-health", "intermittent-fasting"],
    keywords: ["diabetes", "type 2", "HbA1c", "blood sugar", "diabetic", "glucose control"],
  },
  {
    id: "gut-health",
    nameEn: "Gut Health & Microbiome",
    nameAr: "صحة الأمعاء والميكروبيوم",
    pillarPath: "/topics/gut-health",
    relatedClusters: ["chronic-inflammation", "weight-management", "behavioral-nutrition", "sleep-energy"],
    keywords: ["gut", "microbiome", "probiotics", "prebiotics", "fiber", "digestive", "IBS", "bacteria"],
  },
  {
    id: "fatty-liver",
    nameEn: "Fatty Liver",
    nameAr: "الكبد الدهني",
    pillarPath: "/health/fatty-liver",
    relatedClusters: ["insulin-resistance", "weight-management", "chronic-inflammation"],
    keywords: ["liver", "NAFLD", "fatty liver", "liver enzymes", "hepatic", "steatosis"],
  },
  {
    id: "weight-management",
    nameEn: "Weight Management",
    nameAr: "إدارة الوزن",
    pillarPath: "/topics/weight-management",
    relatedClusters: ["intermittent-fasting", "behavioral-nutrition", "insulin-resistance", "gut-health"],
    keywords: ["weight loss", "obesity", "metabolism", "BMI", "body fat", "caloric", "appetite"],
  },
  {
    id: "behavioral-nutrition",
    nameEn: "Behavioral Nutrition",
    nameAr: "التغذية السلوكية",
    pillarPath: "/topics/behavioral-nutrition",
    relatedClusters: ["weight-management", "sleep-energy", "sustainable-health"],
    keywords: ["behavioral", "mindful eating", "emotional eating", "food psychology", "habits", "behavior change"],
  },
  {
    id: "intermittent-fasting",
    nameEn: "Intermittent Fasting",
    nameAr: "الصيام المتقطع",
    pillarPath: "/topics/intermittent-fasting",
    relatedClusters: ["insulin-resistance", "weight-management", "longevity", "gut-health"],
    keywords: ["fasting", "intermittent", "16:8", "4-4-12", "autophagy", "time-restricted"],
  },
  {
    id: "sleep-energy",
    nameEn: "Sleep & Energy",
    nameAr: "النوم والطاقة",
    pillarPath: "/topics/sleep-energy",
    relatedClusters: ["chronic-inflammation", "weight-management", "behavioral-nutrition"],
    keywords: ["sleep", "energy", "insomnia", "fatigue", "circadian", "melatonin", "rest"],
  },
  {
    id: "womens-health",
    nameEn: "Women's Health",
    nameAr: "صحة المرأة",
    pillarPath: "/topics/womens-health",
    relatedClusters: ["weight-management", "insulin-resistance", "sleep-energy"],
    keywords: ["women", "hormonal", "menopause", "PCOS", "estrogen", "pregnancy", "perimenopause"],
  },
  {
    id: "chronic-inflammation",
    nameEn: "Chronic Inflammation",
    nameAr: "الالتهاب المزمن",
    pillarPath: "/topics/chronic-inflammation",
    relatedClusters: ["gut-health", "insulin-resistance", "fatty-liver", "sleep-energy"],
    keywords: ["inflammation", "anti-inflammatory", "CRP", "cytokines", "oxidative stress", "autoimmune"],
  },
  {
    id: "longevity",
    nameEn: "Longevity & Healthy Aging",
    nameAr: "طول العمر والشيخوخة الصحية",
    pillarPath: "/topics/longevity",
    relatedClusters: ["intermittent-fasting", "gut-health", "chronic-inflammation", "sleep-energy"],
    keywords: ["longevity", "aging", "telomeres", "senescence", "lifespan", "healthspan", "blue zones"],
  },
  {
    id: "sustainable-health",
    nameEn: "Sustainable Health",
    nameAr: "الصحة المستدامة",
    pillarPath: "/topics/sustainable-health",
    relatedClusters: ["behavioral-nutrition", "weight-management", "sleep-energy", "longevity"],
    keywords: ["sustainable", "long-term", "lifestyle", "prevention", "wellness", "holistic", "habits"],
  },
  {
    id: "feel-great",
    nameEn: "Feel Great System",
    nameAr: "نظام Feel Great",
    pillarPath: "/partner",
    relatedClusters: ["gut-health", "insulin-resistance", "weight-management", "intermittent-fasting"],
    keywords: ["feel great", "unimate", "balance", "unicity", "fiber matrix", "yerba mate"],
  },
];

// ============================================================
// INTERNAL LINK GENERATION
// ============================================================

export interface InternalLink {
  url: string;
  anchorTextEn: string;
  anchorTextAr: string;
  relevanceScore: number;
}

/**
 * Generate contextual internal links for an article based on its content and cluster.
 * Returns up to 5 internal links sorted by relevance.
 */
export function generateInternalLinks(
  articleContent: string,
  articleClusterId: string,
  existingArticles: Array<{ slug: string; titleEn: string; titleAr: string; category: string; keywords?: string }>
): InternalLink[] {
  const links: InternalLink[] = [];
  const cluster = TOPIC_CLUSTERS.find(c => c.id === articleClusterId);
  if (!cluster) return links;

  // 1. Always link to the pillar page (hub)
  links.push({
    url: cluster.pillarPath,
    anchorTextEn: `Learn more about ${cluster.nameEn}`,
    anchorTextAr: `اقرأ المزيد عن ${cluster.nameAr}`,
    relevanceScore: 10,
  });

  // 2. Link to related articles in the SAME cluster
  const sameClusterArticles = existingArticles.filter(a => a.category === articleClusterId);
  for (const related of sameClusterArticles.slice(0, 3)) {
    links.push({
      url: `/blog/${related.slug}`,
      anchorTextEn: related.titleEn,
      anchorTextAr: related.titleAr,
      relevanceScore: 8,
    });
  }

  // 3. Link to articles in RELATED clusters
  for (const relatedClusterId of cluster.relatedClusters.slice(0, 2)) {
    const relatedCluster = TOPIC_CLUSTERS.find(c => c.id === relatedClusterId);
    if (!relatedCluster) continue;

    const crossClusterArticles = existingArticles.filter(a => a.category === relatedClusterId);
    if (crossClusterArticles.length > 0) {
      const best = crossClusterArticles[0];
      links.push({
        url: `/blog/${best.slug}`,
        anchorTextEn: best.titleEn,
        anchorTextAr: best.titleAr,
        relevanceScore: 6,
      });
    } else {
      // Link to the related pillar page
      links.push({
        url: relatedCluster.pillarPath,
        anchorTextEn: `Explore ${relatedCluster.nameEn}`,
        anchorTextAr: `استكشف ${relatedCluster.nameAr}`,
        relevanceScore: 5,
      });
    }
  }

  // 4. Always include key conversion pages
  links.push({
    url: "/health-assessment",
    anchorTextEn: "Take Your Free Health Assessment",
    anchorTextAr: "ابدأ التقييم الصحي المجاني",
    relevanceScore: 7,
  });

  links.push({
    url: "/success-stories",
    anchorTextEn: "Read Success Stories",
    anchorTextAr: "اقرأ قصص النجاح",
    relevanceScore: 4,
  });

  // 5. Cross-site links to partner site
  const PARTNER_SITE = "https://feelgreatap-h8jahypk.manus.space";
  const partnerLinks: Record<string, { path: string; titleEn: string; titleAr: string }[]> = {
    "insulin-resistance": [
      { path: "/articles/best-program-for-insulin-resistance", titleEn: "Best Program for Insulin Resistance", titleAr: "أفضل برنامج لمقاومة الأنسولين" },
    ],
    "intermittent-fasting": [
      { path: "/articles/intermittent-fasting-feel-great", titleEn: "Intermittent Fasting with Feel Great", titleAr: "الصيام المتقطع مع Feel Great" },
    ],
    "weight-management": [
      { path: "/articles/weight-management-feel-great", titleEn: "Weight Management with Feel Great System", titleAr: "إدارة الوزن مع نظام Feel Great" },
    ],
    "gut-health": [
      { path: "/articles/gut-health-microbiome", titleEn: "Gut Health & Microbiome Guide", titleAr: "دليل صحة الأمعاء والميكروبيوم" },
    ],
    "feel-great": [
      { path: "/", titleEn: "Feel Great Partner Program", titleAr: "برنامج شراكة Feel Great" },
    ],
  };

  const partnerClusterLinks = partnerLinks[articleClusterId] || partnerLinks["feel-great"] || [];
  for (const pl of partnerClusterLinks.slice(0, 1)) {
    links.push({
      url: `${PARTNER_SITE}${pl.path}`,
      anchorTextEn: pl.titleEn,
      anchorTextAr: pl.titleAr,
      relevanceScore: 5,
    });
  }

  // 6. Link to related research studies
  const researchTopicMap: Record<string, { slug: string; titleEn: string; titleAr: string }[]> = {
    "insulin-resistance": [
      { slug: "bios-life-balance-cholesterol-cleveland-clinic-2006", titleEn: "Balance Reduces LDL by 24.5% - Clinical Trial", titleAr: "بالانس يخفض LDL بنسبة 24.5% - دراسة سريرية" },
    ],
    "intermittent-fasting": [
      { slug: "intermittent-fasting-network-meta-analysis-bmj-2025", titleEn: "BMJ 2025: IF Works - 99 Clinical Trials", titleAr: "BMJ 2025: الصيام المتقطع فعّال - 99 تجربة" },
      { slug: "time-restricted-eating-metabolic-syndrome-annals-2024", titleEn: "TRE Improves Metabolic Syndrome - RCT", titleAr: "الأكل المقيد زمنياً يحسن المتلازمة الأيضية" },
    ],
    "weight-management": [
      { slug: "unimate-yerba-mate-glp1-incretin-gut-microbiome-2025", titleEn: "Unimate Stimulates GLP-1 Naturally", titleAr: "يونيماتي يحفز GLP-1 طبيعياً" },
      { slug: "intermittent-fasting-network-meta-analysis-bmj-2025", titleEn: "BMJ: All IF Strategies Reduce Weight", titleAr: "BMJ: جميع أنماط الصيام تخفض الوزن" },
    ],
    "gut-health": [
      { slug: "unimate-yerba-mate-glp1-incretin-gut-microbiome-2025", titleEn: "Yerba Mate & Gut Microbiome - GLP-1 Study", titleAr: "يربا ماتي والميكروبيوم - دراسة GLP-1" },
    ],
    "feel-great": [
      { slug: "unimate-yerba-mate-glp1-incretin-gut-microbiome-2025", titleEn: "Unimate GLP-1 Research", titleAr: "بحث يونيماتي و GLP-1" },
      { slug: "bios-life-balance-cholesterol-cleveland-clinic-2006", titleEn: "Balance Cholesterol Clinical Trial", titleAr: "دراسة بالانس والكوليسترول" },
    ],
    "diabetes": [
      { slug: "bios-life-balance-cholesterol-cleveland-clinic-2006", titleEn: "Balance Clinical Evidence", titleAr: "أدلة بالانس السريرية" },
      { slug: "time-restricted-eating-metabolic-syndrome-annals-2024", titleEn: "TRE for Metabolic Health", titleAr: "TRE للصحة الأيضية" },
    ],
  };

  const researchLinks = researchTopicMap[articleClusterId] || researchTopicMap["feel-great"] || [];
  for (const rl of researchLinks.slice(0, 2)) {
    links.push({
      url: `/research/${rl.slug}`,
      anchorTextEn: `📊 Research: ${rl.titleEn}`,
      anchorTextAr: `📊 بحث: ${rl.titleAr}`,
      relevanceScore: 7,
    });
  }

  // Sort by relevance and return top 8
  return links.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 8);
}

/**
 * Identify which cluster an article belongs to based on content keywords.
 */
export function identifyCluster(content: string, explicitCategory?: string): string {
  if (explicitCategory) {
    const match = TOPIC_CLUSTERS.find(c => c.id === explicitCategory);
    if (match) return match.id;
  }

  const contentLower = content.toLowerCase();
  let bestMatch = "sustainable-health";
  let bestScore = 0;

  for (const cluster of TOPIC_CLUSTERS) {
    let score = 0;
    for (const keyword of cluster.keywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cluster.id;
    }
  }

  return bestMatch;
}

/**
 * Get the cluster navigation data for a given article.
 * Returns the cluster info and sibling articles for the sidebar/footer navigation.
 */
export function getClusterNavigation(
  articleClusterId: string,
  currentSlug: string,
  allArticles: Array<{ slug: string; titleEn: string; titleAr: string; category: string }>
) {
  const cluster = TOPIC_CLUSTERS.find(c => c.id === articleClusterId);
  if (!cluster) return null;

  const siblings = allArticles
    .filter(a => a.category === articleClusterId && a.slug !== currentSlug)
    .slice(0, 5);

  const relatedClusters = cluster.relatedClusters
    .map(id => TOPIC_CLUSTERS.find(c => c.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return {
    cluster,
    siblings,
    relatedClusters,
  };
}
