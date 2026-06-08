import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Globe, Heart, Brain, Users, TrendingUp, Mic, BookOpen, Award,
  Target, Lightbulb, Handshake, GraduationCap, ArrowRight, ChevronDown, ChevronUp,
  Compass, Sparkles, Crown, Rocket, Library, MessageCircle
} from "lucide-react";

// ============================================================
// 6-LANGUAGE UI DICTIONARY
// ============================================================
type Lang = "ar" | "en" | "fr" | "es" | "de" | "tr";

const UI: Record<Lang, Record<string, string>> = {
  ar: {
    home: "الرئيسية", knowledgeHub: "مركز المعرفة", countries: "دولة",
    ferasName: "فراس العايد",
    subtitle: "مفكر ومدرب ومُثقف عالمي في الصحة والنمو والتمكين الإنساني",
    heroDesc: "مساعدة الناس على إطلاق إمكاناتهم البشرية الكاملة من خلال الصحة المستدامة، التغذية السلوكية، القيادة، وريادة الأعمال",
    quote1: "شخص أكثر صحة يبني عائلة أقوى.",
    quote2: "عائلة أقوى تبني مجتمعاً أقوى.",
    quote3: "مجتمع أقوى يبني عالماً أفضل.",
    audioLabel: "رسالة فراس",
    // Table of contents
    tocMission: "الرسالة", tocPhilosophy: "الفلسفة", tocHealth: "الصحة", tocNutrition: "التغذية",
    tocImpact: "الأثر", tocSpeaking: "المحاضرات", tocLeadership: "القيادة", tocResearch: "الأبحاث",
    tocStories: "القصص", tocArticles: "المقالات", tocBusiness: "الأعمال", tocWorkTogether: "تعاون",
    // Section 1: Mission
    missionTitle: "الرسالة والرؤية",
    missionStatement: "المهمة ليست مجرد تحسين الصحة. المهمة هي مساعدة الناس على إطلاق إمكاناتهم البشرية الكاملة.",
    missionDesc: "من خلال دمج الصحة المستدامة، التغذية السلوكية، تطوير القيادة، والتمكين المالي — نبني جيلاً جديداً من القادة الأصحاء القادرين على إحداث تأثير حقيقي في العالم.",
    missionNote: "هذه ليست رحلات منفصلة. إنها رحلة واحدة متكاملة.",
    // Mission badges
    health: "الصحة", growth: "النمو", leadership: "القيادة", purpose: "الهدف", prosperity: "الازدهار", impact: "الأثر",
    // Section 2: Philosophy
    philosophyTitle: "فلسفة الصحة والقيادة والإمكانات البشرية",
    philoQuote1: "النجاح الحقيقي لا يُقاس بالمال وحده.",
    philoQuote2: "النجاح الحقيقي هو القدرة على بناء الصحة دون التضحية بالثروة.",
    philoQuote3: "بناء الثروة دون التضحية بالقيم.",
    philoQuote4: "النمو شخصياً مع مساعدة الآخرين على النمو.",
    philoQuote5: "إنشاء حياة ناجحة، مستدامة، وذات معنى.",
    healthFirst: "الصحة أولاً", healthFirstDesc: "بدون الصحة، لا شيء آخر مهم. إنها الأساس الذي يُبنى عليه كل شيء.",
    leadYourself: "قُد نفسك", leadYourselfDesc: "قبل أن تقود الآخرين، يجب أن تتقن قيادة الذات من خلال الانضباط والوعي والهدف.",
    empowerOthers: "مكّن الآخرين", empowerOthersDesc: "المقياس الحقيقي للنجاح هو عدد الحيوات التي ساعدت في تحويلها.",
    // Section 3: Sustainable Health
    sustainableHealthTitle: "إطار الصحة المستدامة",
    sustainableHealthDesc: "نهج شامل ومتكامل يجمع بين التغذية العلاجية، العلوم السلوكية، وتحسين الصحة الأيضية لإحداث تحولات دائمة في نمط الحياة. ليس حمية مؤقتة، بل نظام حياة مستدام.",
    exploreHealthHub: "استكشف مركز الصحة المستدامة",
    // Section 4: Behavioral Nutrition
    behavioralNutritionTitle: "إطار التغذية السلوكية",
    behavioralNutritionDesc: "تغيير العادات الغذائية ليس مجرد معرفة ماذا نأكل، بل فهم لماذا نأكل وكيف نبني سلوكيات صحية مستدامة. هذا هو ما يميز التغذية السلوكية عن الأنظمة الغذائية التقليدية.",
    // Section 5: Global Impact
    globalImpactTitle: "الأثر العالمي والدول",
    globalImpactDesc: "من خلال المحاضرات، ورش العمل، برامج التدريب، مبادرات تطوير القيادة، ومشاريع التثقيف الصحي — عمل فراس مع أفراد وفرق عبر دول وثقافات متعددة، مُحدثاً أثراً ملموساً في حياة الآلاف.",
    countriesStat: "دولة", partnersStat: "شريك", transformationsStat: "تحول", yearsStat: "سنوات من الأثر",
    // Section 6: Speaking
    speakingTitle: "المحاضرات وورش العمل",
    speakingDesc: "يقدم فراس محاضرات وورش عمل متخصصة في الصحة المستدامة، التغذية السلوكية، القيادة، والإمكانات البشرية — للمؤسسات، الشركات، المجتمعات، والأفراد.",
    // Section 7: Leadership
    leadershipTitle: "برامج تطوير القيادة",
    leadershipDesc: "تمكين الأفراد والفرق من القيادة بهدف، بناء التأثير، إلهام الآخرين، وإحداث أثر حقيقي في مجتمعاتهم. القيادة تبدأ بقيادة الذات — والذات تبدأ بالصحة.",
    // Section 8: Research
    researchTitle: "مركز التعليقات البحثية",
    researchDesc: "تحليل وتبسيط أحدث الأبحاث العلمية في الصحة الأيضية، التغذية، والسلوك البشري — لمساعدة الناس على اتخاذ قرارات مبنية على العلم.",
    viewAllResearch: "عرض جميع الأبحاث",
    // Section 9: Success Stories
    successStoriesTitle: "مركز قصص النجاح",
    successStoriesDesc: "قصص ملهمة من أشخاص حقيقيين حوّلوا صحتهم، ثقتهم، قدراتهم القيادية، مستقبلهم المالي، وجودة حياتهم — من خلال العمل مع فراس وتطبيق مبادئ الصحة المستدامة.",
    exploreStories: "استكشف قصص النجاح",
    // Section 10: Media
    mediaTitle: "الإعلام والمقابلات", platforms: "المنصات", contentAreas: "مجالات المحتوى",
    // Section 11: Articles
    articlesTitle: "أحدث المقالات", viewAll: "عرض الكل",
    // Section 12: Latest Research
    latestResearchTitle: "أحدث الأبحاث العلمية",
    // Section 13: Health Library
    healthLibraryTitle: "المكتبة الصحية",
    healthLibraryDesc: "مكتبة شاملة من المحتوى الصحي المبني على الأدلة العلمية، منظمة في مراكز معرفية متخصصة — كل مركز يغطي موضوعاً صحياً بعمق.",
    exploreLibrary: "استكشف المكتبة الصحية",
    // Section 14: Entrepreneurship
    entrepreneurshipTitle: "ريادة الأعمال والتمكين المالي",
    entrepreneurshipDesc: "مساعدة الناس على اكتشاف الفرص، تطوير التفكير الريادي، إنشاء مصادر دخل إضافية، وبناء حرية ومرونة أكبر في الحياة — من خلال ريادة الأعمال الصحية والتمكين المالي المستدام.",
    discoverPartnership: "اكتشف فرصة الشراكة",
    // Section 15: Partnerships
    partnershipsTitle: "الشراكات الاستراتيجية",
    partnershipsDesc: "يتعاون فراس بنشاط مع المنظمات، القادة، رواد الأعمال، المعلمين، وصناع التغيير الذين يشاركونه رؤية إنشاء مجتمعات أكثر صحة وقوة وتمكيناً.",
    // Section 16: Mastermind
    mastermindTitle: "مشاريع العقل المدبر والقيادة",
    mastermindDesc: "بيئات نمو تعاونية مصممة للقادة الطموحين الذين يريدون تسريع نموهم الشخصي والمهني من خلال التعلم الجماعي والمساءلة المتبادلة.",
    // Section 17: Resources
    resourcesTitle: "موارد التنمية البشرية",
    resourcesDesc: "أدوات وموارد مجانية مصممة لمساعدتك على بدء رحلة التحول — من التقييمات الصحية إلى برامج الـ 90 يوم إلى المكتبة العلمية.",
    // Section 18: Principles
    principlesTitle: "المبادئ والمعتقدات الأساسية",
    // Section 19: FAQ
    faqTitle: "الأسئلة الشائعة",
    // Section 20: Work with Feras
    workWithFerasTitle: "العمل مع فراس",
    workWithFerasDesc: "سواء كنت تبحث عن تحسين صحتك، تطوير قيادتك، بناء مصدر دخل إضافي، أو إحداث تأثير أكبر في حياتك — فراس يقدم مسارات متعددة للتعاون والنمو المشترك.",
    healthConsultation: "استشارة صحية", healthConsultationDesc: "تقييم مجاني لصحتك الأيضية",
    healthPartnership: "شراكة صحية", healthPartnershipDesc: "ابنِ عملك الصحي الهادف",
    directContact: "تواصل مباشر", directContactDesc: "واتساب للاستفسارات",
    // Footer
    footerTitle: "فراس العايد - مركز المعرفة",
    footerDesc: "مفكر ومدرب ومُثقف عالمي في الصحة المستدامة، التغذية السلوكية، القيادة، الإمكانات البشرية، ريادة الأعمال، والتمكين المالي",
    blog: "المدونة", research: "الأبحاث", healthLibrary: "المكتبة الصحية",
    successStories: "قصص النجاح", healthAssessment: "التقييم الصحي", partnership: "الشراكة",
    healthScience: "علوم الصحة", topics: "المواضيع",
  },
  en: {
    home: "Home", knowledgeHub: "Knowledge Hub", countries: "Countries",
    ferasName: "Feras Alayed",
    subtitle: "Global Thinker, Educator & Mentor in Health, Growth & Human Empowerment",
    heroDesc: "Helping people unlock their full human potential through sustainable health, behavioral nutrition, leadership, and entrepreneurship",
    quote1: "A healthier person creates a stronger family.",
    quote2: "A stronger family creates a stronger community.",
    quote3: "A stronger community creates a better world.",
    audioLabel: "Feras's Message",
    tocMission: "Mission", tocPhilosophy: "Philosophy", tocHealth: "Health", tocNutrition: "Nutrition",
    tocImpact: "Impact", tocSpeaking: "Speaking", tocLeadership: "Leadership", tocResearch: "Research",
    tocStories: "Stories", tocArticles: "Articles", tocBusiness: "Business", tocWorkTogether: "Work Together",
    missionTitle: "Mission & Vision",
    missionStatement: "The mission is not simply to improve health. The mission is to help people unlock their full human potential.",
    missionDesc: "By integrating sustainable health, behavioral nutrition, leadership development, and financial empowerment — we build a new generation of healthy leaders capable of creating real impact in the world.",
    missionNote: "These are not separate journeys. They are one integrated journey.",
    health: "Health", growth: "Growth", leadership: "Leadership", purpose: "Purpose", prosperity: "Prosperity", impact: "Impact",
    philosophyTitle: "Health, Leadership & Human Potential Philosophy",
    philoQuote1: "True success is not measured by money alone.",
    philoQuote2: "True success is the ability to build health without sacrificing wealth.",
    philoQuote3: "To build wealth without sacrificing values.",
    philoQuote4: "To grow personally while helping others grow.",
    philoQuote5: "To create a life that is successful, sustainable, and meaningful.",
    healthFirst: "Health First", healthFirstDesc: "Without health, nothing else matters. It is the foundation upon which everything is built.",
    leadYourself: "Lead Yourself", leadYourselfDesc: "Before you can lead others, you must master self-leadership through discipline, awareness, and purpose.",
    empowerOthers: "Empower Others", empowerOthersDesc: "The ultimate measure of success is how many lives you've helped transform.",
    sustainableHealthTitle: "Sustainable Health Framework",
    sustainableHealthDesc: "A comprehensive, integrated approach combining therapeutic nutrition, behavioral science, and metabolic health optimization for lasting lifestyle transformations. Not a temporary diet, but a sustainable life system.",
    exploreHealthHub: "Explore Sustainable Health Hub",
    behavioralNutritionTitle: "Behavioral Nutrition Framework",
    behavioralNutritionDesc: "Changing eating habits isn't just about knowing what to eat, but understanding why we eat and how to build sustainable healthy behaviors. This is what distinguishes behavioral nutrition from traditional diets.",
    globalImpactTitle: "Global Impact & Countries Served",
    globalImpactDesc: "Through speaking engagements, workshops, coaching programs, leadership development initiatives, and health education projects — Feras has worked with individuals and teams across multiple countries and cultures, creating tangible impact in thousands of lives.",
    countriesStat: "Countries", partnersStat: "Partners", transformationsStat: "Transformations", yearsStat: "Years of Impact",
    speakingTitle: "Speaking & Workshops",
    speakingDesc: "Feras delivers specialized lectures and workshops on sustainable health, behavioral nutrition, leadership, and human potential — for organizations, corporations, communities, and individuals.",
    leadershipTitle: "Leadership Development Programs",
    leadershipDesc: "Empowering individuals and teams to lead with purpose, build influence, inspire others, and create meaningful impact. Leadership starts with self-leadership — and self-leadership starts with health.",
    researchTitle: "Research Commentary Center",
    researchDesc: "Analyzing and simplifying the latest scientific research in metabolic health, nutrition, and human behavior — helping people make science-based decisions.",
    viewAllResearch: "View All Research",
    successStoriesTitle: "Success Stories Hub",
    successStoriesDesc: "Inspiring stories from real people who transformed their health, confidence, leadership abilities, financial future, and quality of life — through working with Feras and applying sustainable health principles.",
    exploreStories: "Explore Success Stories",
    mediaTitle: "Media & Interviews", platforms: "Platforms", contentAreas: "Content Areas",
    articlesTitle: "Featured Articles", viewAll: "View All",
    latestResearchTitle: "Latest Scientific Research",
    healthLibraryTitle: "Health Library Access",
    healthLibraryDesc: "A comprehensive library of evidence-based health content, organized into specialized knowledge hubs — each covering a health topic in depth.",
    exploreLibrary: "Explore Health Library",
    entrepreneurshipTitle: "Entrepreneurship & Financial Empowerment",
    entrepreneurshipDesc: "Helping people discover opportunities, develop entrepreneurial thinking, create additional income streams, and build greater freedom — through health entrepreneurship and sustainable financial empowerment.",
    discoverPartnership: "Discover Partnership Opportunity",
    partnershipsTitle: "Strategic Partnerships",
    partnershipsDesc: "Feras actively collaborates with organizations, leaders, entrepreneurs, educators, and change-makers who share a vision of creating healthier, stronger, and more empowered communities.",
    mastermindTitle: "Mastermind & Leadership Projects",
    mastermindDesc: "Collaborative growth environments designed for ambitious leaders who want to accelerate their personal and professional growth through collective learning and mutual accountability.",
    resourcesTitle: "Human Development Resources",
    resourcesDesc: "Free tools and resources designed to help you start your transformation journey — from health assessments to 90-day programs to the scientific library.",
    principlesTitle: "Core Principles & Beliefs",
    faqTitle: "Frequently Asked Questions",
    workWithFerasTitle: "Work With Feras",
    workWithFerasDesc: "Whether you're looking to improve your health, develop your leadership, build an additional income stream, or create greater impact — Feras offers multiple paths for collaboration and mutual growth.",
    healthConsultation: "Health Consultation", healthConsultationDesc: "Free metabolic health assessment",
    healthPartnership: "Health Partnership", healthPartnershipDesc: "Build your purpose-driven health business",
    directContact: "Direct Contact", directContactDesc: "WhatsApp for inquiries",
    footerTitle: "Feras Alayed - Knowledge Hub",
    footerDesc: "Global thinker, educator & mentor in sustainable health, behavioral nutrition, leadership, human potential, entrepreneurship & financial empowerment",
    blog: "Blog", research: "Research", healthLibrary: "Health Library",
    successStories: "Success Stories", healthAssessment: "Health Assessment", partnership: "Partnership",
    healthScience: "Health Science", topics: "Topics",
  },
  fr: {
    home: "Accueil", knowledgeHub: "Centre de Connaissances", countries: "Pays",
    ferasName: "Feras Alayed",
    subtitle: "Penseur mondial, éducateur et mentor en santé, croissance et autonomisation humaine",
    heroDesc: "Aider les gens à libérer leur plein potentiel humain grâce à la santé durable, la nutrition comportementale, le leadership et l'entrepreneuriat",
    quote1: "Une personne en meilleure santé crée une famille plus forte.",
    quote2: "Une famille plus forte crée une communauté plus forte.",
    quote3: "Une communauté plus forte crée un monde meilleur.",
    audioLabel: "Message de Feras",
    tocMission: "Mission", tocPhilosophy: "Philosophie", tocHealth: "Santé", tocNutrition: "Nutrition",
    tocImpact: "Impact", tocSpeaking: "Conférences", tocLeadership: "Leadership", tocResearch: "Recherche",
    tocStories: "Histoires", tocArticles: "Articles", tocBusiness: "Affaires", tocWorkTogether: "Collaborer",
    missionTitle: "Mission et Vision",
    missionStatement: "La mission n'est pas simplement d'améliorer la santé. La mission est d'aider les gens à libérer leur plein potentiel humain.",
    missionDesc: "En intégrant la santé durable, la nutrition comportementale, le développement du leadership et l'autonomisation financière — nous construisons une nouvelle génération de leaders sains capables de créer un impact réel.",
    missionNote: "Ce ne sont pas des voyages séparés. C'est un voyage intégré unique.",
    health: "Santé", growth: "Croissance", leadership: "Leadership", purpose: "Objectif", prosperity: "Prospérité", impact: "Impact",
    philosophyTitle: "Philosophie de la Santé, du Leadership et du Potentiel Humain",
    philoQuote1: "Le vrai succès ne se mesure pas uniquement à l'argent.",
    philoQuote2: "Le vrai succès est la capacité de construire la santé sans sacrifier la richesse.",
    philoQuote3: "Construire la richesse sans sacrifier les valeurs.",
    philoQuote4: "Grandir personnellement tout en aidant les autres à grandir.",
    philoQuote5: "Créer une vie réussie, durable et significative.",
    healthFirst: "La Santé d'Abord", healthFirstDesc: "Sans la santé, rien d'autre ne compte. C'est le fondement sur lequel tout est construit.",
    leadYourself: "Dirigez-vous", leadYourselfDesc: "Avant de diriger les autres, vous devez maîtriser l'auto-leadership par la discipline, la conscience et le but.",
    empowerOthers: "Autonomisez les Autres", empowerOthersDesc: "La mesure ultime du succès est le nombre de vies que vous avez aidé à transformer.",
    sustainableHealthTitle: "Cadre de Santé Durable",
    sustainableHealthDesc: "Une approche complète et intégrée combinant nutrition thérapeutique, sciences comportementales et optimisation de la santé métabolique pour des transformations durables du mode de vie.",
    exploreHealthHub: "Explorer le Centre de Santé Durable",
    behavioralNutritionTitle: "Cadre de Nutrition Comportementale",
    behavioralNutritionDesc: "Changer les habitudes alimentaires ne consiste pas seulement à savoir quoi manger, mais à comprendre pourquoi nous mangeons et comment construire des comportements sains durables.",
    globalImpactTitle: "Impact Mondial et Pays Desservis",
    globalImpactDesc: "À travers des conférences, ateliers, programmes de coaching et projets d'éducation sanitaire — Feras a travaillé avec des individus et des équipes dans plusieurs pays et cultures.",
    countriesStat: "Pays", partnersStat: "Partenaires", transformationsStat: "Transformations", yearsStat: "Années d'Impact",
    speakingTitle: "Conférences et Ateliers",
    speakingDesc: "Feras propose des conférences et ateliers spécialisés en santé durable, nutrition comportementale, leadership et potentiel humain.",
    leadershipTitle: "Programmes de Développement du Leadership",
    leadershipDesc: "Permettre aux individus et aux équipes de diriger avec un objectif, de construire l'influence et de créer un impact significatif.",
    researchTitle: "Centre de Commentaires de Recherche",
    researchDesc: "Analyser et simplifier les dernières recherches scientifiques en santé métabolique, nutrition et comportement humain.",
    viewAllResearch: "Voir Toutes les Recherches",
    successStoriesTitle: "Centre des Histoires de Succès",
    successStoriesDesc: "Des histoires inspirantes de personnes réelles qui ont transformé leur santé, leur confiance et leur qualité de vie.",
    exploreStories: "Explorer les Histoires de Succès",
    mediaTitle: "Médias et Interviews", platforms: "Plateformes", contentAreas: "Domaines de Contenu",
    articlesTitle: "Articles en Vedette", viewAll: "Voir Tout",
    latestResearchTitle: "Dernières Recherches Scientifiques",
    healthLibraryTitle: "Accès à la Bibliothèque Santé",
    healthLibraryDesc: "Une bibliothèque complète de contenu santé basé sur les preuves, organisée en centres de connaissances spécialisés.",
    exploreLibrary: "Explorer la Bibliothèque Santé",
    entrepreneurshipTitle: "Entrepreneuriat et Autonomisation Financière",
    entrepreneurshipDesc: "Aider les gens à découvrir des opportunités, développer la pensée entrepreneuriale et construire une plus grande liberté financière.",
    discoverPartnership: "Découvrir l'Opportunité de Partenariat",
    partnershipsTitle: "Partenariats Stratégiques",
    partnershipsDesc: "Feras collabore activement avec des organisations, leaders et entrepreneurs qui partagent une vision de communautés plus saines.",
    mastermindTitle: "Projets Mastermind et Leadership",
    mastermindDesc: "Des environnements de croissance collaborative conçus pour les leaders ambitieux qui veulent accélérer leur développement.",
    resourcesTitle: "Ressources de Développement Humain",
    resourcesDesc: "Outils et ressources gratuits conçus pour vous aider à commencer votre voyage de transformation.",
    principlesTitle: "Principes et Croyances Fondamentaux",
    faqTitle: "Questions Fréquemment Posées",
    workWithFerasTitle: "Travailler avec Feras",
    workWithFerasDesc: "Que vous cherchiez à améliorer votre santé, développer votre leadership ou créer un impact plus grand — Feras offre plusieurs voies de collaboration.",
    healthConsultation: "Consultation Santé", healthConsultationDesc: "Évaluation gratuite de santé métabolique",
    healthPartnership: "Partenariat Santé", healthPartnershipDesc: "Construisez votre entreprise santé",
    directContact: "Contact Direct", directContactDesc: "WhatsApp pour les demandes",
    footerTitle: "Feras Alayed - Centre de Connaissances",
    footerDesc: "Penseur mondial, éducateur et mentor en santé durable, nutrition comportementale, leadership et autonomisation",
    blog: "Blog", research: "Recherche", healthLibrary: "Bibliothèque Santé",
    successStories: "Histoires de Succès", healthAssessment: "Évaluation Santé", partnership: "Partenariat",
    healthScience: "Sciences de la Santé", topics: "Sujets",
  },
  es: {
    home: "Inicio", knowledgeHub: "Centro de Conocimiento", countries: "Países",
    ferasName: "Feras Alayed",
    subtitle: "Pensador global, educador y mentor en salud, crecimiento y empoderamiento humano",
    heroDesc: "Ayudando a las personas a liberar su máximo potencial humano a través de la salud sostenible, nutrición conductual, liderazgo y emprendimiento",
    quote1: "Una persona más saludable crea una familia más fuerte.",
    quote2: "Una familia más fuerte crea una comunidad más fuerte.",
    quote3: "Una comunidad más fuerte crea un mundo mejor.",
    audioLabel: "Mensaje de Feras",
    tocMission: "Misión", tocPhilosophy: "Filosofía", tocHealth: "Salud", tocNutrition: "Nutrición",
    tocImpact: "Impacto", tocSpeaking: "Conferencias", tocLeadership: "Liderazgo", tocResearch: "Investigación",
    tocStories: "Historias", tocArticles: "Artículos", tocBusiness: "Negocios", tocWorkTogether: "Colaborar",
    missionTitle: "Misión y Visión",
    missionStatement: "La misión no es simplemente mejorar la salud. La misión es ayudar a las personas a liberar su máximo potencial humano.",
    missionDesc: "Al integrar salud sostenible, nutrición conductual, desarrollo de liderazgo y empoderamiento financiero — construimos una nueva generación de líderes saludables capaces de crear impacto real.",
    missionNote: "Estos no son viajes separados. Es un viaje integrado único.",
    health: "Salud", growth: "Crecimiento", leadership: "Liderazgo", purpose: "Propósito", prosperity: "Prosperidad", impact: "Impacto",
    philosophyTitle: "Filosofía de Salud, Liderazgo y Potencial Humano",
    philoQuote1: "El verdadero éxito no se mide solo por el dinero.",
    philoQuote2: "El verdadero éxito es la capacidad de construir salud sin sacrificar la riqueza.",
    philoQuote3: "Construir riqueza sin sacrificar valores.",
    philoQuote4: "Crecer personalmente mientras ayudas a otros a crecer.",
    philoQuote5: "Crear una vida exitosa, sostenible y significativa.",
    healthFirst: "Salud Primero", healthFirstDesc: "Sin salud, nada más importa. Es el fundamento sobre el cual todo se construye.",
    leadYourself: "Lidera tu Vida", leadYourselfDesc: "Antes de liderar a otros, debes dominar el auto-liderazgo a través de la disciplina y el propósito.",
    empowerOthers: "Empodera a Otros", empowerOthersDesc: "La medida definitiva del éxito es cuántas vidas has ayudado a transformar.",
    sustainableHealthTitle: "Marco de Salud Sostenible",
    sustainableHealthDesc: "Un enfoque integral que combina nutrición terapéutica, ciencias conductuales y optimización de la salud metabólica para transformaciones duraderas del estilo de vida.",
    exploreHealthHub: "Explorar Centro de Salud Sostenible",
    behavioralNutritionTitle: "Marco de Nutrición Conductual",
    behavioralNutritionDesc: "Cambiar los hábitos alimenticios no se trata solo de saber qué comer, sino de entender por qué comemos y cómo construir comportamientos saludables sostenibles.",
    globalImpactTitle: "Impacto Global y Países Atendidos",
    globalImpactDesc: "A través de conferencias, talleres, programas de coaching y proyectos de educación sanitaria — Feras ha trabajado con individuos y equipos en múltiples países y culturas.",
    countriesStat: "Países", partnersStat: "Socios", transformationsStat: "Transformaciones", yearsStat: "Años de Impacto",
    speakingTitle: "Conferencias y Talleres",
    speakingDesc: "Feras ofrece conferencias y talleres especializados en salud sostenible, nutrición conductual, liderazgo y potencial humano.",
    leadershipTitle: "Programas de Desarrollo de Liderazgo",
    leadershipDesc: "Empoderar a individuos y equipos para liderar con propósito, construir influencia y crear impacto significativo.",
    researchTitle: "Centro de Comentarios de Investigación",
    researchDesc: "Analizando y simplificando las últimas investigaciones científicas en salud metabólica, nutrición y comportamiento humano.",
    viewAllResearch: "Ver Toda la Investigación",
    successStoriesTitle: "Centro de Historias de Éxito",
    successStoriesDesc: "Historias inspiradoras de personas reales que transformaron su salud, confianza y calidad de vida.",
    exploreStories: "Explorar Historias de Éxito",
    mediaTitle: "Medios y Entrevistas", platforms: "Plataformas", contentAreas: "Áreas de Contenido",
    articlesTitle: "Artículos Destacados", viewAll: "Ver Todo",
    latestResearchTitle: "Últimas Investigaciones Científicas",
    healthLibraryTitle: "Acceso a la Biblioteca de Salud",
    healthLibraryDesc: "Una biblioteca completa de contenido de salud basado en evidencia, organizada en centros de conocimiento especializados.",
    exploreLibrary: "Explorar Biblioteca de Salud",
    entrepreneurshipTitle: "Emprendimiento y Empoderamiento Financiero",
    entrepreneurshipDesc: "Ayudando a las personas a descubrir oportunidades, desarrollar pensamiento emprendedor y construir mayor libertad financiera.",
    discoverPartnership: "Descubrir Oportunidad de Asociación",
    partnershipsTitle: "Asociaciones Estratégicas",
    partnershipsDesc: "Feras colabora activamente con organizaciones, líderes y emprendedores que comparten una visión de comunidades más saludables.",
    mastermindTitle: "Proyectos Mastermind y Liderazgo",
    mastermindDesc: "Entornos de crecimiento colaborativo diseñados para líderes ambiciosos que quieren acelerar su desarrollo.",
    resourcesTitle: "Recursos de Desarrollo Humano",
    resourcesDesc: "Herramientas y recursos gratuitos diseñados para ayudarte a comenzar tu viaje de transformación.",
    principlesTitle: "Principios y Creencias Fundamentales",
    faqTitle: "Preguntas Frecuentes",
    workWithFerasTitle: "Trabajar con Feras",
    workWithFerasDesc: "Ya sea que busques mejorar tu salud, desarrollar tu liderazgo o crear mayor impacto — Feras ofrece múltiples caminos de colaboración.",
    healthConsultation: "Consulta de Salud", healthConsultationDesc: "Evaluación gratuita de salud metabólica",
    healthPartnership: "Asociación de Salud", healthPartnershipDesc: "Construye tu negocio de salud",
    directContact: "Contacto Directo", directContactDesc: "WhatsApp para consultas",
    footerTitle: "Feras Alayed - Centro de Conocimiento",
    footerDesc: "Pensador global, educador y mentor en salud sostenible, nutrición conductual, liderazgo y empoderamiento",
    blog: "Blog", research: "Investigación", healthLibrary: "Biblioteca de Salud",
    successStories: "Historias de Éxito", healthAssessment: "Evaluación de Salud", partnership: "Asociación",
    healthScience: "Ciencias de la Salud", topics: "Temas",
  },
  de: {
    home: "Startseite", knowledgeHub: "Wissenszentrum", countries: "Länder",
    ferasName: "Feras Alayed",
    subtitle: "Globaler Denker, Pädagoge und Mentor für Gesundheit, Wachstum und menschliche Ermächtigung",
    heroDesc: "Menschen helfen, ihr volles menschliches Potenzial durch nachhaltige Gesundheit, Verhaltensernährung, Führung und Unternehmertum zu entfalten",
    quote1: "Ein gesünderer Mensch schafft eine stärkere Familie.",
    quote2: "Eine stärkere Familie schafft eine stärkere Gemeinschaft.",
    quote3: "Eine stärkere Gemeinschaft schafft eine bessere Welt.",
    audioLabel: "Feras' Nachricht",
    tocMission: "Mission", tocPhilosophy: "Philosophie", tocHealth: "Gesundheit", tocNutrition: "Ernährung",
    tocImpact: "Wirkung", tocSpeaking: "Vorträge", tocLeadership: "Führung", tocResearch: "Forschung",
    tocStories: "Geschichten", tocArticles: "Artikel", tocBusiness: "Geschäft", tocWorkTogether: "Zusammenarbeit",
    missionTitle: "Mission und Vision",
    missionStatement: "Die Mission ist nicht einfach die Gesundheit zu verbessern. Die Mission ist, Menschen zu helfen, ihr volles menschliches Potenzial zu entfalten.",
    missionDesc: "Durch die Integration von nachhaltiger Gesundheit, Verhaltensernährung, Führungsentwicklung und finanzieller Ermächtigung bauen wir eine neue Generation gesunder Führungskräfte auf.",
    missionNote: "Dies sind keine getrennten Reisen. Es ist eine integrierte Reise.",
    health: "Gesundheit", growth: "Wachstum", leadership: "Führung", purpose: "Zweck", prosperity: "Wohlstand", impact: "Wirkung",
    philosophyTitle: "Philosophie der Gesundheit, Führung und des menschlichen Potenzials",
    philoQuote1: "Wahrer Erfolg wird nicht nur am Geld gemessen.",
    philoQuote2: "Wahrer Erfolg ist die Fähigkeit, Gesundheit aufzubauen, ohne Wohlstand zu opfern.",
    philoQuote3: "Wohlstand aufbauen, ohne Werte zu opfern.",
    philoQuote4: "Persönlich wachsen und gleichzeitig anderen beim Wachsen helfen.",
    philoQuote5: "Ein Leben schaffen, das erfolgreich, nachhaltig und bedeutungsvoll ist.",
    healthFirst: "Gesundheit Zuerst", healthFirstDesc: "Ohne Gesundheit ist nichts anderes wichtig. Sie ist das Fundament, auf dem alles aufgebaut wird.",
    leadYourself: "Führe Dich Selbst", leadYourselfDesc: "Bevor du andere führen kannst, musst du Selbstführung durch Disziplin und Zweck meistern.",
    empowerOthers: "Andere Ermächtigen", empowerOthersDesc: "Das ultimative Maß für Erfolg ist, wie viele Leben du transformiert hast.",
    sustainableHealthTitle: "Rahmen für Nachhaltige Gesundheit",
    sustainableHealthDesc: "Ein umfassender, integrierter Ansatz, der therapeutische Ernährung, Verhaltenswissenschaft und metabolische Gesundheitsoptimierung für dauerhafte Lebensstiltransformationen kombiniert.",
    exploreHealthHub: "Nachhaltiges Gesundheitszentrum Erkunden",
    behavioralNutritionTitle: "Rahmen für Verhaltensernährung",
    behavioralNutritionDesc: "Essgewohnheiten zu ändern bedeutet nicht nur zu wissen, was man essen soll, sondern zu verstehen, warum wir essen und wie wir nachhaltige gesunde Verhaltensweisen aufbauen.",
    globalImpactTitle: "Globale Wirkung und Bediente Länder",
    globalImpactDesc: "Durch Vorträge, Workshops, Coaching-Programme und Gesundheitsbildungsprojekte hat Feras mit Einzelpersonen und Teams in mehreren Ländern und Kulturen gearbeitet.",
    countriesStat: "Länder", partnersStat: "Partner", transformationsStat: "Transformationen", yearsStat: "Jahre Wirkung",
    speakingTitle: "Vorträge und Workshops",
    speakingDesc: "Feras bietet spezialisierte Vorträge und Workshops zu nachhaltiger Gesundheit, Verhaltensernährung, Führung und menschlichem Potenzial.",
    leadershipTitle: "Programme zur Führungsentwicklung",
    leadershipDesc: "Einzelpersonen und Teams befähigen, mit Zweck zu führen, Einfluss aufzubauen und bedeutsame Wirkung zu erzielen.",
    researchTitle: "Forschungskommentar-Zentrum",
    researchDesc: "Die neueste wissenschaftliche Forschung in metabolischer Gesundheit, Ernährung und menschlichem Verhalten analysieren und vereinfachen.",
    viewAllResearch: "Alle Forschung Anzeigen",
    successStoriesTitle: "Erfolgsgeschichten-Zentrum",
    successStoriesDesc: "Inspirierende Geschichten von echten Menschen, die ihre Gesundheit, ihr Vertrauen und ihre Lebensqualität transformiert haben.",
    exploreStories: "Erfolgsgeschichten Erkunden",
    mediaTitle: "Medien und Interviews", platforms: "Plattformen", contentAreas: "Inhaltsbereiche",
    articlesTitle: "Ausgewählte Artikel", viewAll: "Alle Anzeigen",
    latestResearchTitle: "Neueste Wissenschaftliche Forschung",
    healthLibraryTitle: "Zugang zur Gesundheitsbibliothek",
    healthLibraryDesc: "Eine umfassende Bibliothek evidenzbasierter Gesundheitsinhalte, organisiert in spezialisierten Wissenszentren.",
    exploreLibrary: "Gesundheitsbibliothek Erkunden",
    entrepreneurshipTitle: "Unternehmertum und Finanzielle Ermächtigung",
    entrepreneurshipDesc: "Menschen helfen, Möglichkeiten zu entdecken, unternehmerisches Denken zu entwickeln und größere finanzielle Freiheit aufzubauen.",
    discoverPartnership: "Partnerschaftsmöglichkeit Entdecken",
    partnershipsTitle: "Strategische Partnerschaften",
    partnershipsDesc: "Feras arbeitet aktiv mit Organisationen, Führungskräften und Unternehmern zusammen, die eine Vision gesünderer Gemeinschaften teilen.",
    mastermindTitle: "Mastermind- und Führungsprojekte",
    mastermindDesc: "Kollaborative Wachstumsumgebungen für ambitionierte Führungskräfte, die ihre Entwicklung beschleunigen wollen.",
    resourcesTitle: "Ressourcen für Menschliche Entwicklung",
    resourcesDesc: "Kostenlose Tools und Ressourcen, die Ihnen helfen, Ihre Transformationsreise zu beginnen.",
    principlesTitle: "Grundprinzipien und Überzeugungen",
    faqTitle: "Häufig Gestellte Fragen",
    workWithFerasTitle: "Mit Feras Arbeiten",
    workWithFerasDesc: "Ob Sie Ihre Gesundheit verbessern, Ihre Führung entwickeln oder größere Wirkung erzielen möchten — Feras bietet mehrere Wege der Zusammenarbeit.",
    healthConsultation: "Gesundheitsberatung", healthConsultationDesc: "Kostenlose metabolische Gesundheitsbewertung",
    healthPartnership: "Gesundheitspartnerschaft", healthPartnershipDesc: "Bauen Sie Ihr Gesundheitsunternehmen auf",
    directContact: "Direkter Kontakt", directContactDesc: "WhatsApp für Anfragen",
    footerTitle: "Feras Alayed - Wissenszentrum",
    footerDesc: "Globaler Denker, Pädagoge und Mentor für nachhaltige Gesundheit, Verhaltensernährung, Führung und Ermächtigung",
    blog: "Blog", research: "Forschung", healthLibrary: "Gesundheitsbibliothek",
    successStories: "Erfolgsgeschichten", healthAssessment: "Gesundheitsbewertung", partnership: "Partnerschaft",
    healthScience: "Gesundheitswissenschaft", topics: "Themen",
  },
  tr: {
    home: "Ana Sayfa", knowledgeHub: "Bilgi Merkezi", countries: "Ülke",
    ferasName: "Feras Alayed",
    subtitle: "Sağlık, büyüme ve insan güçlendirmesinde küresel düşünür, eğitimci ve mentor",
    heroDesc: "İnsanların sürdürülebilir sağlık, davranışsal beslenme, liderlik ve girişimcilik yoluyla tam insan potansiyellerini açığa çıkarmalarına yardımcı olmak",
    quote1: "Daha sağlıklı bir insan daha güçlü bir aile yaratır.",
    quote2: "Daha güçlü bir aile daha güçlü bir toplum yaratır.",
    quote3: "Daha güçlü bir toplum daha iyi bir dünya yaratır.",
    audioLabel: "Feras'ın Mesajı",
    tocMission: "Misyon", tocPhilosophy: "Felsefe", tocHealth: "Sağlık", tocNutrition: "Beslenme",
    tocImpact: "Etki", tocSpeaking: "Konuşmalar", tocLeadership: "Liderlik", tocResearch: "Araştırma",
    tocStories: "Hikayeler", tocArticles: "Makaleler", tocBusiness: "İş", tocWorkTogether: "İşbirliği",
    missionTitle: "Misyon ve Vizyon",
    missionStatement: "Misyon sadece sağlığı iyileştirmek değil. Misyon, insanların tam insan potansiyellerini açığa çıkarmalarına yardımcı olmaktır.",
    missionDesc: "Sürdürülebilir sağlık, davranışsal beslenme, liderlik geliştirme ve finansal güçlendirmeyi entegre ederek — gerçek etki yaratabilecek sağlıklı liderlerin yeni bir neslini inşa ediyoruz.",
    missionNote: "Bunlar ayrı yolculuklar değil. Tek bir entegre yolculuktur.",
    health: "Sağlık", growth: "Büyüme", leadership: "Liderlik", purpose: "Amaç", prosperity: "Refah", impact: "Etki",
    philosophyTitle: "Sağlık, Liderlik ve İnsan Potansiyeli Felsefesi",
    philoQuote1: "Gerçek başarı sadece parayla ölçülmez.",
    philoQuote2: "Gerçek başarı, zenginlikten ödün vermeden sağlık inşa etme yeteneğidir.",
    philoQuote3: "Değerlerden ödün vermeden zenginlik inşa etmek.",
    philoQuote4: "Başkalarının büyümesine yardımcı olurken kişisel olarak büyümek.",
    philoQuote5: "Başarılı, sürdürülebilir ve anlamlı bir yaşam yaratmak.",
    healthFirst: "Önce Sağlık", healthFirstDesc: "Sağlık olmadan başka hiçbir şey önemli değil. Her şeyin üzerine inşa edildiği temeldir.",
    leadYourself: "Kendini Yönet", leadYourselfDesc: "Başkalarını yönetmeden önce, disiplin ve amaç yoluyla öz-liderliği ustalaşmalısınız.",
    empowerOthers: "Başkalarını Güçlendir", empowerOthersDesc: "Başarının nihai ölçüsü, kaç hayatı dönüştürmeye yardımcı olduğunuzdur.",
    sustainableHealthTitle: "Sürdürülebilir Sağlık Çerçevesi",
    sustainableHealthDesc: "Terapötik beslenme, davranış bilimi ve metabolik sağlık optimizasyonunu kalıcı yaşam tarzı dönüşümleri için birleştiren kapsamlı, entegre bir yaklaşım.",
    exploreHealthHub: "Sürdürülebilir Sağlık Merkezini Keşfet",
    behavioralNutritionTitle: "Davranışsal Beslenme Çerçevesi",
    behavioralNutritionDesc: "Yeme alışkanlıklarını değiştirmek sadece ne yeneceğini bilmek değil, neden yediğimizi anlamak ve sürdürülebilir sağlıklı davranışlar inşa etmektir.",
    globalImpactTitle: "Küresel Etki ve Hizmet Verilen Ülkeler",
    globalImpactDesc: "Konuşmalar, atölyeler, koçluk programları ve sağlık eğitimi projeleri aracılığıyla — Feras birçok ülke ve kültürde bireyler ve ekiplerle çalışmıştır.",
    countriesStat: "Ülke", partnersStat: "Ortak", transformationsStat: "Dönüşüm", yearsStat: "Yıllık Etki",
    speakingTitle: "Konuşmalar ve Atölyeler",
    speakingDesc: "Feras, sürdürülebilir sağlık, davranışsal beslenme, liderlik ve insan potansiyeli konularında uzmanlaşmış konuşmalar ve atölyeler sunar.",
    leadershipTitle: "Liderlik Geliştirme Programları",
    leadershipDesc: "Bireyleri ve ekipleri amaçla liderlik etmeye, etki oluşturmaya ve anlamlı bir fark yaratmaya güçlendirmek.",
    researchTitle: "Araştırma Yorum Merkezi",
    researchDesc: "Metabolik sağlık, beslenme ve insan davranışındaki en son bilimsel araştırmaları analiz etmek ve basitleştirmek.",
    viewAllResearch: "Tüm Araştırmaları Görüntüle",
    successStoriesTitle: "Başarı Hikayeleri Merkezi",
    successStoriesDesc: "Sağlıklarını, güvenlerini ve yaşam kalitelerini dönüştüren gerçek insanlardan ilham verici hikayeler.",
    exploreStories: "Başarı Hikayelerini Keşfet",
    mediaTitle: "Medya ve Röportajlar", platforms: "Platformlar", contentAreas: "İçerik Alanları",
    articlesTitle: "Öne Çıkan Makaleler", viewAll: "Tümünü Gör",
    latestResearchTitle: "En Son Bilimsel Araştırmalar",
    healthLibraryTitle: "Sağlık Kütüphanesi Erişimi",
    healthLibraryDesc: "Uzmanlaşmış bilgi merkezlerinde düzenlenmiş, kanıta dayalı sağlık içeriğinin kapsamlı bir kütüphanesi.",
    exploreLibrary: "Sağlık Kütüphanesini Keşfet",
    entrepreneurshipTitle: "Girişimcilik ve Finansal Güçlendirme",
    entrepreneurshipDesc: "İnsanların fırsatları keşfetmelerine, girişimci düşünce geliştirmelerine ve daha büyük finansal özgürlük inşa etmelerine yardımcı olmak.",
    discoverPartnership: "Ortaklık Fırsatını Keşfet",
    partnershipsTitle: "Stratejik Ortaklıklar",
    partnershipsDesc: "Feras, daha sağlıklı topluluklar vizyonunu paylaşan organizasyonlar, liderler ve girişimcilerle aktif olarak işbirliği yapar.",
    mastermindTitle: "Mastermind ve Liderlik Projeleri",
    mastermindDesc: "Gelişimlerini hızlandırmak isteyen hırslı liderler için tasarlanmış işbirlikçi büyüme ortamları.",
    resourcesTitle: "İnsan Gelişimi Kaynakları",
    resourcesDesc: "Dönüşüm yolculuğunuza başlamanıza yardımcı olmak için tasarlanmış ücretsiz araçlar ve kaynaklar.",
    principlesTitle: "Temel İlkeler ve İnançlar",
    faqTitle: "Sıkça Sorulan Sorular",
    workWithFerasTitle: "Feras ile Çalışmak",
    workWithFerasDesc: "Sağlığınızı iyileştirmek, liderliğinizi geliştirmek veya daha büyük etki yaratmak istiyorsanız — Feras birden fazla işbirliği yolu sunar.",
    healthConsultation: "Sağlık Danışmanlığı", healthConsultationDesc: "Ücretsiz metabolik sağlık değerlendirmesi",
    healthPartnership: "Sağlık Ortaklığı", healthPartnershipDesc: "Sağlık işinizi kurun",
    directContact: "Doğrudan İletişim", directContactDesc: "Sorular için WhatsApp",
    footerTitle: "Feras Alayed - Bilgi Merkezi",
    footerDesc: "Sürdürülebilir sağlık, davranışsal beslenme, liderlik ve güçlendirmede küresel düşünür, eğitimci ve mentor",
    blog: "Blog", research: "Araştırma", healthLibrary: "Sağlık Kütüphanesi",
    successStories: "Başarı Hikayeleri", healthAssessment: "Sağlık Değerlendirmesi", partnership: "Ortaklık",
    healthScience: "Sağlık Bilimi", topics: "Konular",
  },
};

// Multilingual data arrays helper
function ml(data: Record<Lang, string>, lang: Lang): string {
  return data[lang] || data.en;
}

// Strategic hierarchy - 6 languages
const strategicHierarchy = [
  { ar: "الصحة المستدامة", en: "Sustainable Health", fr: "Santé Durable", es: "Salud Sostenible", de: "Nachhaltige Gesundheit", tr: "Sürdürülebilir Sağlık", icon: Heart },
  { ar: "التغذية السلوكية", en: "Behavioral Nutrition", fr: "Nutrition Comportementale", es: "Nutrición Conductual", de: "Verhaltensernährung", tr: "Davranışsal Beslenme", icon: Brain },
  { ar: "القيادة", en: "Leadership", fr: "Leadership", es: "Liderazgo", de: "Führung", tr: "Liderlik", icon: Crown },
  { ar: "الإمكانات البشرية", en: "Human Potential", fr: "Potentiel Humain", es: "Potencial Humano", de: "Menschliches Potenzial", tr: "İnsan Potansiyeli", icon: Sparkles },
  { ar: "ريادة الأعمال", en: "Entrepreneurship", fr: "Entrepreneuriat", es: "Emprendimiento", de: "Unternehmertum", tr: "Girişimcilik", icon: Rocket },
  { ar: "التمكين المالي", en: "Financial Empowerment", fr: "Autonomisation Financière", es: "Empoderamiento Financiero", de: "Finanzielle Ermächtigung", tr: "Finansal Güçlendirme", icon: TrendingUp },
];

// Countries
const countries = [
  { ar: "المملكة العربية السعودية", en: "Saudi Arabia", fr: "Arabie Saoudite", es: "Arabia Saudita", de: "Saudi-Arabien", tr: "Suudi Arabistan" },
  { ar: "الإمارات العربية المتحدة", en: "United Arab Emirates", fr: "Émirats Arabes Unis", es: "Emiratos Árabes Unidos", de: "Vereinigte Arabische Emirate", tr: "Birleşik Arap Emirlikleri" },
  { ar: "عُمان", en: "Oman", fr: "Oman", es: "Omán", de: "Oman", tr: "Umman" },
  { ar: "الكويت", en: "Kuwait", fr: "Koweït", es: "Kuwait", de: "Kuwait", tr: "Kuveyt" },
  { ar: "البحرين", en: "Bahrain", fr: "Bahreïn", es: "Baréin", de: "Bahrain", tr: "Bahreyn" },
  { ar: "قطر", en: "Qatar", fr: "Qatar", es: "Catar", de: "Katar", tr: "Katar" },
  { ar: "الأردن", en: "Jordan", fr: "Jordanie", es: "Jordania", de: "Jordanien", tr: "Ürdün" },
  { ar: "مصر", en: "Egypt", fr: "Égypte", es: "Egipto", de: "Ägypten", tr: "Mısır" },
  { ar: "تركيا", en: "Turkey", fr: "Turquie", es: "Turquía", de: "Türkei", tr: "Türkiye" },
  { ar: "الولايات المتحدة", en: "United States", fr: "États-Unis", es: "Estados Unidos", de: "Vereinigte Staaten", tr: "Amerika Birleşik Devletleri" },
  { ar: "المملكة المتحدة", en: "United Kingdom", fr: "Royaume-Uni", es: "Reino Unido", de: "Vereinigtes Königreich", tr: "Birleşik Krallık" },
  { ar: "ألمانيا", en: "Germany", fr: "Allemagne", es: "Alemania", de: "Deutschland", tr: "Almanya" },
  { ar: "هولندا", en: "Netherlands", fr: "Pays-Bas", es: "Países Bajos", de: "Niederlande", tr: "Hollanda" },
  { ar: "السويد", en: "Sweden", fr: "Suède", es: "Suecia", de: "Schweden", tr: "İsveç" },
  { ar: "ماليزيا", en: "Malaysia", fr: "Malaisie", es: "Malasia", de: "Malaysia", tr: "Malezya" },
];

// Speaking topics
const speakingTopics = [
  { ar: "الصحة المستدامة وتحسين الأيض", en: "Sustainable Health & Metabolic Optimization", fr: "Santé Durable et Optimisation Métabolique", es: "Salud Sostenible y Optimización Metabólica", de: "Nachhaltige Gesundheit und Stoffwechseloptimierung", tr: "Sürdürülebilir Sağlık ve Metabolik Optimizasyon" },
  { ar: "التغذية السلوكية وهندسة العادات", en: "Behavioral Nutrition & Habit Architecture", fr: "Nutrition Comportementale et Architecture des Habitudes", es: "Nutrición Conductual y Arquitectura de Hábitos", de: "Verhaltensernährung und Gewohnheitsarchitektur", tr: "Davranışsal Beslenme ve Alışkanlık Mimarisi" },
  { ar: "الإمكانات البشرية والأداء الأمثل", en: "Human Potential & Peak Performance", fr: "Potentiel Humain et Performance Optimale", es: "Potencial Humano y Rendimiento Máximo", de: "Menschliches Potenzial und Spitzenleistung", tr: "İnsan Potansiyeli ve Zirve Performans" },
  { ar: "القيادة وتطوير الفرق", en: "Leadership & Team Development", fr: "Leadership et Développement d'Équipe", es: "Liderazgo y Desarrollo de Equipos", de: "Führung und Teamentwicklung", tr: "Liderlik ve Takım Geliştirme" },
  { ar: "الوقاية من الاحتراق وإدارة الطاقة", en: "Burnout Prevention & Energy Management", fr: "Prévention du Burnout et Gestion de l'Énergie", es: "Prevención del Burnout y Gestión de Energía", de: "Burnout-Prävention und Energiemanagement", tr: "Tükenmişlik Önleme ve Enerji Yönetimi" },
  { ar: "ريادة الأعمال والنمو المالي", en: "Entrepreneurship & Financial Growth", fr: "Entrepreneuriat et Croissance Financière", es: "Emprendimiento y Crecimiento Financiero", de: "Unternehmertum und Finanzielles Wachstum", tr: "Girişimcilik ve Finansal Büyüme" },
  { ar: "مبادئ النجاح والعقلية", en: "Success Principles & Mindset", fr: "Principes de Succès et État d'Esprit", es: "Principios de Éxito y Mentalidad", de: "Erfolgsprinzipien und Denkweise", tr: "Başarı İlkeleri ve Zihniyet" },
  { ar: "بناء المجتمع والأثر الاجتماعي", en: "Community Building & Social Impact", fr: "Construction Communautaire et Impact Social", es: "Construcción de Comunidad e Impacto Social", de: "Gemeinschaftsaufbau und Soziale Wirkung", tr: "Topluluk Oluşturma ve Sosyal Etki" },
  { ar: "صحة المرأة والتوازن الهرموني", en: "Women's Health & Hormonal Balance", fr: "Santé des Femmes et Équilibre Hormonal", es: "Salud de la Mujer y Equilibrio Hormonal", de: "Frauengesundheit und Hormonelles Gleichgewicht", tr: "Kadın Sağlığı ve Hormonal Denge" },
];

// Health library hubs
const healthLibraryHubs = [
  { slug: "sustainable-health", ar: "الصحة المستدامة", en: "Sustainable Health", fr: "Santé Durable", es: "Salud Sostenible", de: "Nachhaltige Gesundheit", tr: "Sürdürülebilir Sağlık" },
  { slug: "insulin-resistance", ar: "مقاومة الأنسولين", en: "Insulin Resistance", fr: "Résistance à l'Insuline", es: "Resistencia a la Insulina", de: "Insulinresistenz", tr: "İnsülin Direnci" },
  { slug: "gut-health", ar: "صحة الأمعاء", en: "Gut Health", fr: "Santé Intestinale", es: "Salud Intestinal", de: "Darmgesundheit", tr: "Bağırsak Sağlığı" },
  { slug: "weight-loss", ar: "إنقاص الوزن", en: "Weight Loss", fr: "Perte de Poids", es: "Pérdida de Peso", de: "Gewichtsverlust", tr: "Kilo Verme" },
  { slug: "sleep", ar: "تحسين النوم", en: "Sleep Optimization", fr: "Optimisation du Sommeil", es: "Optimización del Sueño", de: "Schlafoptimierung", tr: "Uyku Optimizasyonu" },
  { slug: "womens-health", ar: "صحة المرأة", en: "Women's Health", fr: "Santé des Femmes", es: "Salud de la Mujer", de: "Frauengesundheit", tr: "Kadın Sağlığı" },
  { slug: "metabolic-health", ar: "الصحة الأيضية", en: "Metabolic Health", fr: "Santé Métabolique", es: "Salud Metabólica", de: "Stoffwechselgesundheit", tr: "Metabolik Sağlık" },
];

// FAQ Data
const faqs = [
  {
    q: { ar: "ما هو نهج فراس العايد في الصحة المستدامة؟", en: "What is Feras Alayed's approach to sustainable health?", fr: "Quelle est l'approche de Feras Alayed en matière de santé durable ?", es: "¿Cuál es el enfoque de Feras Alayed para la salud sostenible?", de: "Was ist Feras Alayeds Ansatz für nachhaltige Gesundheit?", tr: "Feras Alayed'in sürdürülebilir sağlık yaklaşımı nedir?" },
    a: { ar: "يجمع فراس بين التغذية العلاجية، العلوم السلوكية، وتحسين الصحة الأيضية لإحداث تحولات مستدامة في نمط الحياة. يركز نهجه على الأسباب الجذرية بدلاً من الأعراض، باستخدام بروتوكولات مبنية على الأدلة.", en: "Feras combines therapeutic nutrition, behavioral science, and metabolic health optimization to create lasting lifestyle transformations. His approach focuses on root causes rather than symptoms, using evidence-based protocols.", fr: "Feras combine nutrition thérapeutique, sciences comportementales et optimisation de la santé métabolique pour créer des transformations durables du mode de vie.", es: "Feras combina nutrición terapéutica, ciencias conductuales y optimización de la salud metabólica para crear transformaciones duraderas del estilo de vida.", de: "Feras kombiniert therapeutische Ernährung, Verhaltenswissenschaft und metabolische Gesundheitsoptimierung für dauerhafte Lebensstiltransformationen.", tr: "Feras, kalıcı yaşam tarzı dönüşümleri yaratmak için terapötik beslenme, davranış bilimi ve metabolik sağlık optimizasyonunu birleştirir." },
  },
  {
    q: { ar: "كيف يدمج فراس القيادة مع الصحة؟", en: "How does Feras integrate leadership with health?", fr: "Comment Feras intègre-t-il le leadership à la santé ?", es: "¿Cómo integra Feras el liderazgo con la salud?", de: "Wie integriert Feras Führung mit Gesundheit?", tr: "Feras liderliği sağlıkla nasıl bütünleştirir?" },
    a: { ar: "يؤمن فراس بأن القيادة الحقيقية تبدأ بقيادة الذات، والتي تبدأ بالصحة. القائد الصحي يمتلك طاقة ووضوح ومرونة أكبر لإلهام الفرق وإحداث الأثر.", en: "Feras believes that true leadership starts with self-leadership, which begins with health. A healthy leader has more energy, clarity, and resilience to inspire teams and create impact.", fr: "Feras croit que le vrai leadership commence par l'auto-leadership, qui commence par la santé. Un leader sain a plus d'énergie et de clarté.", es: "Feras cree que el verdadero liderazgo comienza con el auto-liderazgo, que comienza con la salud. Un líder saludable tiene más energía y claridad.", de: "Feras glaubt, dass wahre Führung mit Selbstführung beginnt, die mit Gesundheit beginnt. Ein gesunder Führer hat mehr Energie und Klarheit.", tr: "Feras, gerçek liderliğin sağlıkla başlayan öz-liderlikle başladığına inanır. Sağlıklı bir lider daha fazla enerji ve netliğe sahiptir." },
  },
  {
    q: { ar: "ما هي التغذية السلوكية وكيف تختلف عن الأنظمة الغذائية التقليدية؟", en: "What is behavioral nutrition and how is it different from traditional diets?", fr: "Qu'est-ce que la nutrition comportementale et en quoi diffère-t-elle des régimes traditionnels ?", es: "¿Qué es la nutrición conductual y cómo se diferencia de las dietas tradicionales?", de: "Was ist Verhaltensernährung und wie unterscheidet sie sich von traditionellen Diäten?", tr: "Davranışsal beslenme nedir ve geleneksel diyetlerden nasıl farklıdır?" },
    a: { ar: "التغذية السلوكية تركز على فهم لماذا نأكل بدلاً من مجرد ماذا نأكل. تستخدم مبادئ العلوم السلوكية لإحداث تغيير دائم.", en: "Behavioral nutrition focuses on understanding WHY we eat rather than just WHAT to eat. It uses behavioral science principles to create lasting change, unlike traditional diets that rely on willpower.", fr: "La nutrition comportementale se concentre sur la compréhension du POURQUOI nous mangeons plutôt que simplement du QUOI manger.", es: "La nutrición conductual se centra en entender POR QUÉ comemos en lugar de solo QUÉ comer.", de: "Verhaltensernährung konzentriert sich darauf zu verstehen, WARUM wir essen, anstatt nur WAS wir essen sollen.", tr: "Davranışsal beslenme, sadece NE yeneceğini değil, NEDEN yediğimizi anlamaya odaklanır." },
  },
  {
    q: { ar: "في أي دول يعمل فراس؟", en: "What countries does Feras work in?", fr: "Dans quels pays Feras travaille-t-il ?", es: "¿En qué países trabaja Feras?", de: "In welchen Ländern arbeitet Feras?", tr: "Feras hangi ülkelerde çalışıyor?" },
    a: { ar: "عمل فراس مع أفراد وفرق في أكثر من 15 دولة تشمل السعودية، الإمارات، عُمان، الكويت، الأردن، تركيا، أمريكا، بريطانيا، ألمانيا، هولندا، السويد، وماليزيا.", en: "Feras has worked with individuals and teams across 15+ countries including Saudi Arabia, UAE, Oman, Kuwait, Jordan, Turkey, USA, UK, Germany, Netherlands, Sweden, and Malaysia.", fr: "Feras a travaillé avec des individus et des équipes dans plus de 15 pays, dont l'Arabie Saoudite, les EAU, Oman, le Koweït, la Jordanie, la Turquie, les USA et l'Allemagne.", es: "Feras ha trabajado con individuos y equipos en más de 15 países, incluyendo Arabia Saudita, EAU, Omán, Kuwait, Jordania, Turquía, EE.UU. y Alemania.", de: "Feras hat mit Einzelpersonen und Teams in über 15 Ländern gearbeitet, darunter Saudi-Arabien, VAE, Oman, Kuwait, Jordanien, Türkei, USA und Deutschland.", tr: "Feras, Suudi Arabistan, BAE, Umman, Kuveyt, Ürdün, Türkiye, ABD ve Almanya dahil 15'ten fazla ülkede bireyler ve ekiplerle çalışmıştır." },
  },
  {
    q: { ar: "ما هي العلاقة بين فراس العايد وبرنامج Feel Great؟", en: "What is the relationship between Feras Alayed and Feel Great?", fr: "Quelle est la relation entre Feras Alayed et Feel Great ?", es: "¿Cuál es la relación entre Feras Alayed y Feel Great?", de: "Was ist die Beziehung zwischen Feras Alayed und Feel Great?", tr: "Feras Alayed ile Feel Great arasındaki ilişki nedir?" },
    a: { ar: "Feel Great هو إحدى الأدوات المبنية على الأدلة التي يستخدمها فراس ضمن إطاره الأوسع للصحة المستدامة. عمل فراس يمتد أبعد بكثير من أي برنامج واحد.", en: "Feel Great is one of several evidence-based tools that Feras uses within his broader sustainable health framework. Feras's work extends far beyond any single program.", fr: "Feel Great est l'un des outils basés sur les preuves que Feras utilise dans son cadre plus large de santé durable.", es: "Feel Great es una de varias herramientas basadas en evidencia que Feras usa dentro de su marco más amplio de salud sostenible.", de: "Feel Great ist eines von mehreren evidenzbasierten Werkzeugen, die Feras in seinem breiteren Rahmen für nachhaltige Gesundheit verwendet.", tr: "Feel Great, Feras'ın daha geniş sürdürülebilir sağlık çerçevesinde kullandığı kanıta dayalı araçlardan biridir." },
  },
  {
    q: { ar: "كيف يمكنني العمل مع فراس؟", en: "How can I work with Feras?", fr: "Comment puis-je travailler avec Feras ?", es: "¿Cómo puedo trabajar con Feras?", de: "Wie kann ich mit Feras arbeiten?", tr: "Feras ile nasıl çalışabilirim?" },
    a: { ar: "يمكنك العمل مع فراس من خلال الاستشارات الصحية، التدريب القيادي، برامج الشراكة، مجموعات العقل المدبر، أو حضور ورشه ومحاضراته.", en: "You can work with Feras through health consultations, leadership coaching, partnership programs, mastermind groups, or attending his workshops and speaking events.", fr: "Vous pouvez travailler avec Feras à travers des consultations santé, du coaching en leadership, des programmes de partenariat ou des ateliers.", es: "Puedes trabajar con Feras a través de consultas de salud, coaching de liderazgo, programas de asociación o talleres.", de: "Sie können mit Feras durch Gesundheitsberatungen, Führungscoaching, Partnerschaftsprogramme oder Workshops arbeiten.", tr: "Feras ile sağlık danışmanlıkları, liderlik koçluğu, ortaklık programları veya atölyeler aracılığıyla çalışabilirsiniz." },
  },
  {
    q: { ar: "ما الذي يجعل نهج فراس فريداً؟", en: "What makes Feras's approach unique?", fr: "Qu'est-ce qui rend l'approche de Feras unique ?", es: "¿Qué hace único el enfoque de Feras?", de: "Was macht Feras' Ansatz einzigartig?", tr: "Feras'ın yaklaşımını benzersiz kılan nedir?" },
    a: { ar: "تفرد فراس يكمن في نهجه المتكامل: لا يفصل الصحة عن القيادة، أو النمو الشخصي عن التمكين المالي. يراها كنظام واحد مترابط.", en: "Feras's uniqueness lies in his integrated approach: he doesn't separate health from leadership, or personal growth from financial empowerment. He sees them as one interconnected system.", fr: "L'unicité de Feras réside dans son approche intégrée : il ne sépare pas la santé du leadership, ni la croissance personnelle de l'autonomisation financière.", es: "La singularidad de Feras radica en su enfoque integrado: no separa la salud del liderazgo, ni el crecimiento personal del empoderamiento financiero.", de: "Feras' Einzigartigkeit liegt in seinem integrierten Ansatz: Er trennt Gesundheit nicht von Führung oder persönliches Wachstum von finanzieller Ermächtigung.", tr: "Feras'ın benzersizliği entegre yaklaşımında yatar: sağlığı liderlikten veya kişisel büyümeyi finansal güçlendirmeden ayırmaz." },
  },
];

export default function FerasKnowledgeHub() {
  const { lang } = useLanguage();
  const l = lang as Lang;
  const t = UI[l] || UI.en;
  const isRtl = lang === "ar";
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { data: articles } = trpc.blog.list.useQuery({ limit: 6, offset: 0 });
  const { data: research } = trpc.research.list.useQuery({ limit: 6, offset: 0 });

  // Helper to get field from multilingual data arrays
  const getField = (item: Record<string, any>) => item[l] || item.en;

  // JSON-LD schemas
  const personSchema = {
    "@context": "https://schema.org", "@type": "Person",
    "@id": "https://feelgreat.us.com/#feras-alayed",
    "name": "Feras Alayed", "alternateName": ["فراس العايد", "Feras Al-Ayed"],
    "jobTitle": "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor",
    "url": "https://feelgreat.us.com/feras-alayed",
    "image": "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
    "sameAs": ["https://www.instagram.com/use2lose", "https://www.tiktok.com/@feras.alayed"],
    "knowsAbout": ["Sustainable Health", "Behavioral Nutrition", "Leadership Development", "Human Potential", "Entrepreneurship"],
    "worksFor": { "@type": "Organization", "name": "Feras Alayed - Knowledge Hub", "url": "https://feelgreat.us.com" },
    "award": ["Presidential Sapphire - Unicity International"],
    "nationality": { "@type": "Country", "name": "Saudi Arabia" }
  };

  const websiteSchema = {
    "@context": "https://schema.org", "@type": "WebPage",
    "name": `${t.ferasName} - ${t.knowledgeHub}`,
    "description": t.footerDesc,
    "url": "https://feelgreat.us.com/feras-alayed",
    "mainEntity": { "@id": "https://feelgreat.us.com/#feras-alayed" },
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question", "name": faq.q.en,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a.en }
    }))
  };

  useEffect(() => {
    document.title = `${t.ferasName} | ${t.knowledgeHub} - ${t.subtitle}`;
    const existing = document.querySelectorAll('script[data-feras-hub]');
    existing.forEach(el => el.remove());
    [personSchema, websiteSchema, faqSchema].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-feras-hub', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-feras-hub]').forEach(el => el.remove()); };
  }, [l]);

  return (
    <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`}>

      {/* ===== HERO ===== */}
      <header className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)' }} />
        </div>
        <div className="container max-w-6xl relative z-10">
          <nav className="text-sm text-emerald-300/70 mb-8">
            <Link href="/" className="hover:text-white">{t.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t.knowledgeHub}</span>
          </nav>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="shrink-0">
              <div className="relative">
                <img loading="lazy" src="/manus-storage/feras-professional_115956a2.png" alt="Feras Alayed" className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover object-top shadow-2xl ring-4 ring-emerald-400/30" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  15+ {t.countries}
                </div>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-start">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">{t.ferasName}</h1>
              <p className="text-xl text-emerald-300 font-medium mb-4">{t.subtitle}</p>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">{t.heroDesc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {strategicHierarchy.map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs border-emerald-400/40 text-emerald-200 bg-emerald-900/20">
                      {getField(item)}
                    </Badge>
                    {i < strategicHierarchy.length - 1 && <span className="text-emerald-400/60 text-xs">→</span>}
                  </span>
                ))}
              </div>
              <blockquote className="border-s-4 border-emerald-400 ps-4 text-slate-300 italic text-sm leading-relaxed">
                {t.quote1}<br/>{t.quote2}<br/>{t.quote3}
              </blockquote>
            </div>
          </div>
        </div>
      </header>

      {/* ===== AUDIO ===== */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b">
        <div className="container max-w-4xl py-6">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 shrink-0">
              <Mic className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-foreground">{t.audioLabel}</span>
            </div>
            <audio controls className="flex-1 h-10" preload="metadata" key={l}>
              <source src={{
                ar: '/manus-storage/knowledge-hub-intro-ar_607fe950.mp3',
                en: '/manus-storage/knowledge-hub-intro-en_d4bcbb3b.mp3',
                fr: '/manus-storage/knowledge-hub-intro-fr_d3ee70cf.mp3',
                es: '/manus-storage/knowledge-hub-intro-es_90299dd9.mp3',
                de: '/manus-storage/knowledge-hub-intro-de_3d458b34.mp3',
                tr: '/manus-storage/knowledge-hub-intro-tr_be9b63da.mp3',
              }[l] || '/manus-storage/knowledge-hub-intro-en_d4bcbb3b.mp3'} type="audio/mpeg" />
            </audio>
          </div>
        </div>
      </section>

      {/* ===== TABLE OF CONTENTS ===== */}
      <nav className="bg-muted/50 border-b sticky top-0 z-40 backdrop-blur-sm">
        <div className="container max-w-6xl py-3 overflow-x-auto">
          <div className="flex gap-4 text-xs font-medium whitespace-nowrap">
            {[
              { id: "mission", label: t.tocMission }, { id: "philosophy", label: t.tocPhilosophy },
              { id: "sustainable-health", label: t.tocHealth }, { id: "behavioral-nutrition", label: t.tocNutrition },
              { id: "global-impact", label: t.tocImpact }, { id: "speaking", label: t.tocSpeaking },
              { id: "leadership", label: t.tocLeadership }, { id: "research", label: t.tocResearch },
              { id: "success-stories", label: t.tocStories }, { id: "articles", label: t.tocArticles },
              { id: "entrepreneurship", label: t.tocBusiness }, { id: "work-with-feras", label: t.tocWorkTogether },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-muted-foreground hover:text-foreground transition-colors">{item.label}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="container max-w-6xl py-16 space-y-20">

        {/* SECTION 1: MISSION */}
        <section id="mission">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold">{t.missionTitle}</h2>
            </div>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-xl font-semibold text-foreground">{t.missionStatement}</p>
              <p className="text-muted-foreground leading-relaxed">{t.missionDesc}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[t.health, t.growth, t.leadership, t.purpose, t.prosperity, t.impact].map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-sm px-4 py-2 bg-white dark:bg-slate-800 shadow-sm">{item}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic pt-2">{t.missionNote}</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PHILOSOPHY */}
        <section id="philosophy">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lightbulb className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">{t.philosophyTitle}</h2>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 lg:p-10 max-w-4xl mx-auto">
            <div className="space-y-6">
              <blockquote className="text-center space-y-3 text-muted-foreground">
                <p className="text-xl font-semibold text-foreground">{t.philoQuote1}</p>
                <p>{t.philoQuote2}</p>
                <p>{t.philoQuote3}</p>
                <p>{t.philoQuote4}</p>
                <p className="text-xl font-semibold text-foreground pt-2">{t.philoQuote5}</p>
              </blockquote>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                  { title: t.healthFirst, desc: t.healthFirstDesc },
                  { title: t.leadYourself, desc: t.leadYourselfDesc },
                  { title: t.empowerOthers, desc: t.empowerOthersDesc },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <h4 className="font-bold mb-2 text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 3: SUSTAINABLE HEALTH */}
        <section id="sustainable-health">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold">{t.sustainableHealthTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">{t.sustainableHealthDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { ar: "الصحة الأيضية", en: "Metabolic Health", fr: "Santé Métabolique", es: "Salud Metabólica", de: "Stoffwechselgesundheit", tr: "Metabolik Sağlık", icon: "⚡", descAr: "تحسين حساسية الأنسولين وطاقة الخلايا", descEn: "Optimizing insulin sensitivity and cellular energy", descFr: "Optimiser la sensibilité à l'insuline", descEs: "Optimizar la sensibilidad a la insulina", descDe: "Insulinsensitivität optimieren", descTr: "İnsülin duyarlılığını optimize etmek" },
              { ar: "الميكروبيوم", en: "Gut Microbiome", fr: "Microbiome Intestinal", es: "Microbioma Intestinal", de: "Darmmikrobiom", tr: "Bağırsak Mikrobiyomu", icon: "🦠", descAr: "استعادة صحة الأمعاء لعافية الجسم كله", descEn: "Restoring gut health for whole-body wellness", descFr: "Restaurer la santé intestinale", descEs: "Restaurar la salud intestinal", descDe: "Darmgesundheit wiederherstellen", descTr: "Bağırsak sağlığını yeniden kazanmak" },
              { ar: "الصيام المتقطع", en: "Intermittent Fasting", fr: "Jeûne Intermittent", es: "Ayuno Intermitente", de: "Intervallfasten", tr: "Aralıklı Oruç", icon: "⏰", descAr: "صيام استراتيجي لإعادة ضبط الأيض", descEn: "Strategic fasting for metabolic reset", descFr: "Jeûne stratégique pour réinitialisation métabolique", descEs: "Ayuno estratégico para reinicio metabólico", descDe: "Strategisches Fasten für metabolischen Reset", descTr: "Metabolik sıfırlama için stratejik oruç" },
              { ar: "تحسين النوم", en: "Sleep Optimization", fr: "Optimisation du Sommeil", es: "Optimización del Sueño", de: "Schlafoptimierung", tr: "Uyku Optimizasyonu", icon: "😴", descAr: "النوم الجيد كمضاعف للصحة", descEn: "Quality sleep as a health multiplier", descFr: "Un sommeil de qualité comme multiplicateur de santé", descEs: "Sueño de calidad como multiplicador de salud", descDe: "Qualitätsschlaf als Gesundheitsmultiplikator", descTr: "Kaliteli uyku sağlık çarpanı olarak" },
              { ar: "إدارة التوتر", en: "Stress Management", fr: "Gestion du Stress", es: "Gestión del Estrés", de: "Stressmanagement", tr: "Stres Yönetimi", icon: "🧘", descAr: "تنظيم الكورتيزول والمرونة الذهنية", descEn: "Cortisol regulation and mental resilience", descFr: "Régulation du cortisol et résilience mentale", descEs: "Regulación del cortisol y resiliencia mental", descDe: "Cortisolregulierung und mentale Resilienz", descTr: "Kortizol düzenlemesi ve zihinsel dayanıklılık" },
              { ar: "الحركة والطاقة", en: "Movement & Energy", fr: "Mouvement et Énergie", es: "Movimiento y Energía", de: "Bewegung und Energie", tr: "Hareket ve Enerji", icon: "🏃", descAr: "أنماط حركة مستدامة للحيوية", descEn: "Sustainable movement patterns for vitality", descFr: "Modèles de mouvement durables pour la vitalité", descEs: "Patrones de movimiento sostenibles para la vitalidad", descDe: "Nachhaltige Bewegungsmuster für Vitalität", descTr: "Canlılık için sürdürülebilir hareket kalıpları" },
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm font-bold mb-1">{getField(item)}</p>
                  <p className="text-xs text-muted-foreground">{item[`desc${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof typeof item] as string || item.descEn}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/health-library/sustainable-health">
              <Button variant="outline" className="gap-2">{t.exploreHealthHub}<ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </section>

        {/* SECTION 4: BEHAVIORAL NUTRITION */}
        <section id="behavioral-nutrition">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold">{t.behavioralNutritionTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.behavioralNutritionDesc}</p>
        </section>

        <Separator />

        {/* SECTION 5: GLOBAL IMPACT */}
        <section id="global-impact">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold">{t.globalImpactTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.globalImpactDesc}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {countries.map((country, i) => (
              <Badge key={i} variant="outline" className="text-sm px-3 py-1.5">{getField(country)}</Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "15+", label: t.countriesStat },
              { value: "500+", label: t.partnersStat },
              { value: "1000+", label: t.transformationsStat },
              { value: "5+", label: t.yearsStat },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 6: SPEAKING */}
        <section id="speaking">
          <div className="flex items-center gap-3 mb-6">
            <Mic className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">{t.speakingTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.speakingDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {speakingTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-sm font-medium">{getField(topic)}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img loading="lazy" src="/manus-storage/feras-speaking_97c75a22.jpg" alt="Feras Speaking" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img loading="lazy" src="/manus-storage/feras-training_3e46aa5d.jpg" alt="Feras Training" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img loading="lazy" src="/manus-storage/feras-library_9789048d.jpg" alt="Feras Research" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 7: LEADERSHIP */}
        <section id="leadership">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold">{t.leadershipTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.leadershipDesc}</p>
        </section>

        {/* SECTION 8: RESEARCH */}
        <section id="research">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold">{t.researchTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.researchDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {research?.studies?.slice(0, 6).map((study: any) => (
              <Link key={study.slug} href={`/research/${study.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{study.journal}</Badge>
                      <Badge variant={study.evidenceLevel === "high" ? "default" : "secondary"} className="text-xs">{study.evidenceLevel}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {study[`title${l.charAt(0).toUpperCase() + l.slice(1)}`] || study.titleEn || study.titleAr}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {study[`summary30s${l.charAt(0).toUpperCase() + l.slice(1)}`] || study.summary30sEn || study.summary30sAr}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/research"><Button variant="outline" className="gap-2">{t.viewAllResearch}<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </section>

        <Separator />

        {/* SECTION 9: SUCCESS STORIES */}
        <section id="success-stories">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold">{t.successStoriesTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.successStoriesDesc}</p>
          <div className="mt-6 text-center">
            <Link href="/success-stories"><Button variant="outline" className="gap-2">{t.exploreStories}<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </section>

        {/* SECTION 11: ARTICLES */}
        <section id="articles">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{t.articlesTitle}</h2>
            <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">{t.viewAll} <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles?.articles?.slice(0, 6).map((article: any) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{article.category}</Badge>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {article[`title${l.charAt(0).toUpperCase() + l.slice(1)}`] || article.titleEn || article.titleAr}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article[`excerpt${l.charAt(0).toUpperCase() + l.slice(1)}`] || article.excerptEn || article.excerptAr}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* SECTION 13: HEALTH LIBRARY */}
        <section id="health-library">
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">{t.healthLibraryTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.healthLibraryDesc}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healthLibraryHubs.map((hub, i) => (
              <Link key={i} href={`/health-library/${hub.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full text-center">
                  <CardContent className="p-4"><p className="font-medium text-sm">{getField(hub)}</p></CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/health-library"><Button variant="outline" className="gap-2">{t.exploreLibrary}<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </section>

        {/* SECTION 14: ENTREPRENEURSHIP */}
        <section id="entrepreneurship">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold">{t.entrepreneurshipTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.entrepreneurshipDesc}</p>
          <div className="mt-6 text-center">
            <Link href="/partner-with-feras"><Button variant="outline" className="gap-2">{t.discoverPartnership}<ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </section>

        <Separator />

        {/* SECTION 15: PARTNERSHIPS */}
        <section id="partnerships">
          <div className="flex items-center gap-3 mb-6">
            <Handshake className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">{t.partnershipsTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.partnershipsDesc}</p>
        </section>

        {/* SECTION 16: MASTERMIND */}
        <section id="mastermind">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-violet-600" />
            <h2 className="text-3xl font-bold">{t.mastermindTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.mastermindDesc}</p>
        </section>

        <Separator />

        {/* SECTION 17: RESOURCES */}
        <section id="resources">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-8 h-8 text-cyan-600" />
            <h2 className="text-3xl font-bold">{t.resourcesTitle}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">{t.resourcesDesc}</p>
        </section>

        {/* SECTION 18: PRINCIPLES */}
        <section id="principles">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold">{t.principlesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { ar: "الصحة هي أساس كل نجاح — بدونها، لا شيء آخر مهم", en: "Health is the foundation of all success — without it, nothing else matters", fr: "La santé est le fondement de tout succès — sans elle, rien d'autre ne compte", es: "La salud es la base de todo éxito — sin ella, nada más importa", de: "Gesundheit ist das Fundament allen Erfolgs — ohne sie ist nichts anderes wichtig", tr: "Sağlık tüm başarının temelidir — onsuz başka hiçbir şey önemli değil" },
              { ar: "كل شخص يستحق حياة أفضل وأكثر صحة ومعنى", en: "Every person deserves a better, healthier, more meaningful life", fr: "Chaque personne mérite une vie meilleure, plus saine et plus significative", es: "Toda persona merece una vida mejor, más saludable y significativa", de: "Jeder Mensch verdient ein besseres, gesünderes, bedeutungsvolleres Leben", tr: "Her insan daha iyi, daha sağlıklı, daha anlamlı bir yaşamı hak eder" },
              { ar: "العلم يرشد الطريق، لكن السلوك يصنع التحول", en: "Science guides the path, but behavior creates the transformation", fr: "La science guide le chemin, mais le comportement crée la transformation", es: "La ciencia guía el camino, pero el comportamiento crea la transformación", de: "Wissenschaft zeigt den Weg, aber Verhalten schafft die Transformation", tr: "Bilim yolu gösterir, ama davranış dönüşümü yaratır" },
              { ar: "القيادة تبدأ بقيادة الذات، وقيادة الذات تبدأ بالصحة", en: "Leadership starts with self-leadership, and self-leadership starts with health", fr: "Le leadership commence par l'auto-leadership, et l'auto-leadership commence par la santé", es: "El liderazgo comienza con el auto-liderazgo, y el auto-liderazgo comienza con la salud", de: "Führung beginnt mit Selbstführung, und Selbstführung beginnt mit Gesundheit", tr: "Liderlik öz-liderlikle başlar ve öz-liderlik sağlıkla başlar" },
              { ar: "النمو ممارسة يومية، وليس وجهة نصل إليها", en: "Growth is a daily practice, not a destination to arrive at", fr: "La croissance est une pratique quotidienne, pas une destination", es: "El crecimiento es una práctica diaria, no un destino", de: "Wachstum ist eine tägliche Praxis, kein Ziel", tr: "Büyüme günlük bir pratiktir, varılacak bir hedef değil" },
              { ar: "المجتمع يضاعف التحول الفردي — ننمو معاً", en: "Community amplifies individual transformation — we grow together", fr: "La communauté amplifie la transformation individuelle — nous grandissons ensemble", es: "La comunidad amplifica la transformación individual — crecemos juntos", de: "Gemeinschaft verstärkt individuelle Transformation — wir wachsen zusammen", tr: "Topluluk bireysel dönüşümü güçlendirir — birlikte büyürüz" },
              { ar: "التمكين المالي نتيجة طبيعية لخلق قيمة حقيقية", en: "Financial empowerment is a natural result of creating real value", fr: "L'autonomisation financière est un résultat naturel de la création de valeur réelle", es: "El empoderamiento financiero es un resultado natural de crear valor real", de: "Finanzielle Ermächtigung ist ein natürliches Ergebnis der Schaffung echten Werts", tr: "Finansal güçlendirme gerçek değer yaratmanın doğal sonucudur" },
              { ar: "العالم يحتاج قادة أصحاء، وليس فقط ناجحين", en: "The world needs healthy leaders, not just successful ones", fr: "Le monde a besoin de leaders sains, pas seulement de leaders qui réussissent", es: "El mundo necesita líderes saludables, no solo exitosos", de: "Die Welt braucht gesunde Führungskräfte, nicht nur erfolgreiche", tr: "Dünya sağlıklı liderlere ihtiyaç duyar, sadece başarılı olanlara değil" },
            ].map((principle, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-900/40">
                <div className="w-8 h-8 rounded-full bg-yellow-200 dark:bg-yellow-900 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-sm shrink-0">{i + 1}</div>
                <p className="font-medium text-sm">{getField(principle)}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* SECTION 19: FAQ */}
        <section id="faq">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-slate-600" />
            <h2 className="text-3xl font-bold">{t.faqTitle}</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="overflow-hidden">
                <button className="w-full p-4 flex items-center justify-between text-start hover:bg-muted/50 transition-colors" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                  <span className="font-medium text-sm pe-4">{faq.q[l] || faq.q.en}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a[l] || faq.a.en}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* SECTION 20: WORK WITH FERAS */}
        <section id="work-with-feras" className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t.workWithFerasTitle}</h2>
            <p className="text-muted-foreground mb-8">{t.workWithFerasDesc}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link href="/health-assessment">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🩺</div>
                    <h4 className="font-bold text-sm mb-1">{t.healthConsultation}</h4>
                    <p className="text-xs text-muted-foreground">{t.healthConsultationDesc}</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/partner-with-feras">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🤝</div>
                    <h4 className="font-bold text-sm mb-1">{t.healthPartnership}</h4>
                    <p className="text-xs text-muted-foreground">{t.healthPartnershipDesc}</p>
                  </CardContent>
                </Card>
              </Link>
              <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-bold text-sm mb-1">{t.directContact}</h4>
                    <p className="text-xs text-muted-foreground">{t.directContactDesc}</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <section className="text-center text-sm text-muted-foreground space-y-4 pt-8">
          <p className="font-semibold text-foreground text-base">{t.footerTitle}</p>
          <p>{t.footerDesc}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {strategicHierarchy.map((item, i) => (
              <span key={i} className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">{getField(item)}</span>
                {i < strategicHierarchy.length - 1 && <span className="text-muted-foreground/50">→</span>}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/blog" className="hover:text-primary transition-colors">{t.blog}</Link>
            <Link href="/research" className="hover:text-primary transition-colors">{t.research}</Link>
            <Link href="/health-library" className="hover:text-primary transition-colors">{t.healthLibrary}</Link>
            <Link href="/success-stories" className="hover:text-primary transition-colors">{t.successStories}</Link>
            <Link href="/health-assessment" className="hover:text-primary transition-colors">{t.healthAssessment}</Link>
            <Link href="/partner-with-feras" className="hover:text-primary transition-colors">{t.partnership}</Link>
            <Link href="/today-in-health-science" className="hover:text-primary transition-colors">{t.healthScience}</Link>
            <Link href="/topics" className="hover:text-primary transition-colors">{t.topics}</Link>
          </div>
        </section>

      </main>
    </div>
  );
}
