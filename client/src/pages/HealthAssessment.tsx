import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Heart, Activity, Brain, Scale, Zap, Moon, ChevronRight, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "assessment" | "loading" | "results" | "consultation";
type QualificationLevel = "green" | "yellow" | "red";

interface AssessmentAnswers {
  age: string;
  gender: string;
  primaryGoal: string;
  currentEnergy: string;
  sleepQuality: string;
  stressLevel: string;
  exerciseFrequency: string;
  dietQuality: string;
  previousDiets: string;
}

// ============ Multi-language content ============
const i18n: Record<string, {
  pageTitle: string;
  metaDesc: string;
  questionOf: (c: number, t: number) => string;
  prevQuestion: string;
  questions: { key: string; question: string; options: string[] }[];
  loading: { title: string; desc: string };
  results: {
    title: string;
    subtitle: string;
    scoreLabel: string;
    good: string;
    needsImprovement: string;
    needsAttention: string;
    recsTitle: string;
    ctaTitle: string;
    ctaDesc: string;
    bookBtn: string;
    whatsappBtn: string;
    peopleHelped: string;
    countries: string;
    experience: string;
  };
  qualification: {
    green: { badge: string; msg: string };
    yellow: { badge: string; msg: string };
    red: { badge: string; msg: string };
  };
  consultation: {
    title: string;
    subtitle: string;
    expectTitle: string;
    expectations: string[];
    bookWhatsApp: string;
    returnHome: string;
    consultWith: string;
    specialistTitle: string;
  };
}> = {
  ar: {
    pageTitle: "اختبار صحي مجاني | هل عندك مقاومة إنسولين؟",
    metaDesc: "اكتشف سبب مشكلتك الصحية خلال دقيقة واحدة. اختبار ذكي مبني على أحدث الأبحاث العلمية.",
    questionOf: (c, t) => `السؤال ${c} من ${t}`,
    prevQuestion: "→ السؤال السابق",
    questions: [
      { key: "age", question: "كم عمرك؟", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "الجنس", options: ["أنثى", "ذكر", "أفضل عدم الإجابة"] },
      { key: "primaryGoal", question: "ما هدفك الصحي الأساسي؟", options: ["إنقاص الوزن بشكل مستدام", "التحكم بالسكر / ما قبل السكري", "زيادة مستوى الطاقة", "تحسين صحة الأمعاء", "تحسين جودة النوم", "الصحة العامة وطول العمر"] },
      { key: "currentEnergy", question: "كيف تقيّم مستوى طاقتك اليومية؟", options: ["منخفض جداً - مرهق طوال اليوم", "منخفض - انهيار متكرر بعد الظهر", "متوسط - بعض الساعات الجيدة", "جيد - نشيط غالباً", "ممتاز - طاقة مستقرة طوال اليوم"] },
      { key: "sleepQuality", question: "كيف جودة نومك؟", options: ["سيئة - صعوبة في النوم أو الاستمرار", "مقبولة - أستيقظ متعباً", "متوسطة - يمكن أن تكون أفضل", "جيدة - نوم مريح غالباً", "ممتازة - أستيقظ منتعشاً"] },
      { key: "stressLevel", question: "كيف تصف مستوى التوتر لديك؟", options: ["ساحق - توتر مستمر", "عالي - متوتر بشكل متكرر", "متوسط - يمكن التحكم فيه", "منخفض - نادراً ما أتوتر", "بسيط - هادئ جداً"] },
      { key: "exerciseFrequency", question: "كم مرة تمارس الرياضة؟", options: ["أبداً / نادراً", "1-2 مرات أسبوعياً", "3-4 مرات أسبوعياً", "5+ مرات أسبوعياً", "حركة يومية + تمارين منظمة"] },
      { key: "dietQuality", question: "كيف تصف نظامك الغذائي الحالي؟", options: ["أغلبه وجبات سريعة / مصنعة", "مختلط - بعضه صحي وبعضه لا", "صحي إلى حد ما مع بعض الاستثناءات", "صحي جداً - أطعمة كاملة", "نظام صحي صارم"] },
      { key: "previousDiets", question: "كم حمية جربت في آخر 5 سنوات؟", options: ["لا شيء", "1-2 حمية", "3-5 حميات", "6-10 حميات", "أكثر من 10"] },
    ],
    loading: { title: "جاري تحليل إجاباتك بالذكاء الاصطناعي...", desc: "نقوم بإنشاء تقرير صحي مخصص لك بناءً على أحدث الأبحاث العلمية" },
    results: {
      title: "نتائج تقييمك الصحي",
      subtitle: "بناءً على إجاباتك، إليك ملفك الصحي المخصص",
      scoreLabel: "درجة صحتك الأيضية",
      good: "جيد",
      needsImprovement: "يحتاج تحسين",
      needsAttention: "يحتاج اهتمام فوري",
      recsTitle: "توصياتك المخصصة",
      ctaTitle: "ابدأ رحلة التحول الآن",
      ctaDesc: "بناءً على تقييمك، يمكن لمنهج فراس العايد™ مساعدتك في تحقيق تحسينات ملموسة خلال 90 يوماً.",
      bookBtn: "احجز استشارة مجانية",
      whatsappBtn: "تحدث عبر واتساب",
      peopleHelped: "شخص تمت مساعدته",
      countries: "دولة",
      experience: "سنوات خبرة",
    },
    qualification: {
      green: { badge: "جاهز للبدء", msg: "بناءً على إجاباتك، أنت مرشح مثالي لبرنامج التحول الصحي. تواصل مع فراس الآن لتبدأ فوراً." },
      yellow: { badge: "يحتاج معلومات أكثر", msg: "لديك أسئلة مشروعة. دعنا نجيب عليها — تصفح مقالاتنا أو اسأل الخبير مباشرة." },
      red: { badge: "مرحلة الاستكشاف", msg: "ممتاز أنك بدأت تهتم بصحتك! ابدأ بقراءة دليلنا المجاني عن مقاومة الإنسولين." },
    },
    consultation: {
      title: "احجز استشارتك المجانية",
      subtitle: "تواصل مع فراس العايد، أخصائي التغذية العلاجية والسلوكية، لاستشارة شخصية لمدة 15 دقيقة.",
      expectTitle: "ماذا تتوقع:",
      expectations: ["مراجعة نتائج تقييمك الصحي", "توصيات مخصصة بناءً على أهدافك", "تعريف بمنهج فراس العايد™", "بدون ضغط أو التزام — فقط إرشاد مفيد"],
      bookWhatsApp: "احجز عبر واتساب",
      returnHome: "العودة للرئيسية",
      consultWith: "استشارتك ستكون مع:",
      specialistTitle: "أخصائي التغذية العلاجية والسلوكية",
    },
  },
  en: {
    pageTitle: "Free Health Quiz | Do You Have Insulin Resistance?",
    metaDesc: "Discover the root cause of your health issues in 1 minute. AI-powered quiz based on the latest scientific research.",
    questionOf: (c, t) => `Question ${c} of ${t}`,
    prevQuestion: "← Previous question",
    questions: [
      { key: "age", question: "What is your age range?", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "What is your gender?", options: ["Female", "Male", "Prefer not to say"] },
      { key: "primaryGoal", question: "What is your primary health goal?", options: ["Lose weight sustainably", "Manage blood sugar / prediabetes", "Increase energy levels", "Improve gut health", "Better sleep quality", "Overall wellness & longevity"] },
      { key: "currentEnergy", question: "How would you rate your daily energy levels?", options: ["Very low - exhausted most of the day", "Low - frequent afternoon crashes", "Moderate - some good hours", "Good - mostly energized", "Excellent - consistent energy"] },
      { key: "sleepQuality", question: "How is your sleep quality?", options: ["Poor - difficulty falling/staying asleep", "Fair - wake up tired", "Average - could be better", "Good - mostly restful", "Excellent - wake refreshed"] },
      { key: "stressLevel", question: "How would you describe your stress levels?", options: ["Overwhelming - constant stress", "High - frequently stressed", "Moderate - manageable", "Low - rarely stressed", "Minimal - very calm"] },
      { key: "exerciseFrequency", question: "How often do you exercise?", options: ["Never / rarely", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily movement + structured exercise"] },
      { key: "dietQuality", question: "How would you describe your current diet?", options: ["Mostly processed / fast food", "Mixed - some healthy, some not", "Fairly healthy with occasional indulgences", "Very healthy - whole foods focused", "Strict health-focused diet"] },
      { key: "previousDiets", question: "How many diets have you tried in the past 5 years?", options: ["None", "1-2 diets", "3-5 diets", "6-10 diets", "More than 10"] },
    ],
    loading: { title: "AI is analyzing your answers...", desc: "Creating your personalized health report based on the latest scientific research" },
    results: {
      title: "Your Health Assessment Results",
      subtitle: "Based on your responses, here's your personalized health profile",
      scoreLabel: "Your Metabolic Health Score",
      good: "Good",
      needsImprovement: "Needs Improvement",
      needsAttention: "Needs Attention",
      recsTitle: "Your Personalized Recommendations",
      ctaTitle: "Start Your Transformation Journey",
      ctaDesc: "Based on your assessment, the Feras Alayed Method™ can help you achieve measurable improvements within 90 days.",
      bookBtn: "Book Free Consultation",
      whatsappBtn: "Chat on WhatsApp",
      peopleHelped: "People Helped",
      countries: "Countries",
      experience: "Experience",
    },
    qualification: {
      green: { badge: "Ready to Start", msg: "Based on your answers, you're an ideal candidate for the health transformation program. Connect with Feras now to start immediately." },
      yellow: { badge: "Needs More Info", msg: "You have valid questions. Let us answer them — browse our articles or ask the expert directly." },
      red: { badge: "Exploring", msg: "Great that you're starting to care about your health! Begin by reading our free guide on insulin resistance." },
    },
    consultation: {
      title: "Book Your Free Consultation",
      subtitle: "Connect with Feras Al-Ayed, Therapeutic & Behavioral Nutrition Specialist, for a personalized 15-minute consultation.",
      expectTitle: "What to Expect:",
      expectations: ["Review of your health assessment results", "Personalized recommendations based on your goals", "Introduction to the Feras Alayed Method™", "No pressure, no obligation — just helpful guidance"],
      bookWhatsApp: "Book via WhatsApp",
      returnHome: "Return to Homepage",
      consultWith: "Your consultation will be with:",
      specialistTitle: "Therapeutic & Behavioral Nutrition Specialist",
    },
  },
  fr: {
    pageTitle: "Quiz Santé Gratuit | Avez-vous une Résistance à l'Insuline ?",
    metaDesc: "Découvrez la cause de vos problèmes de santé en 1 minute. Quiz intelligent basé sur les dernières recherches.",
    questionOf: (c, t) => `Question ${c} sur ${t}`,
    prevQuestion: "← Question précédente",
    questions: [
      { key: "age", question: "Quelle est votre tranche d'âge ?", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "Quel est votre sexe ?", options: ["Femme", "Homme", "Préfère ne pas répondre"] },
      { key: "primaryGoal", question: "Quel est votre objectif santé principal ?", options: ["Perdre du poids durablement", "Gérer la glycémie / prédiabète", "Augmenter l'énergie", "Améliorer la santé intestinale", "Meilleure qualité de sommeil", "Bien-être général et longévité"] },
      { key: "currentEnergy", question: "Comment évaluez-vous votre énergie quotidienne ?", options: ["Très basse - épuisé(e) toute la journée", "Basse - coups de fatigue fréquents", "Moyenne - quelques bonnes heures", "Bonne - généralement énergique", "Excellente - énergie constante"] },
      { key: "sleepQuality", question: "Comment est la qualité de votre sommeil ?", options: ["Mauvaise - difficulté à s'endormir", "Passable - réveil fatigué", "Moyenne - pourrait être mieux", "Bonne - sommeil réparateur", "Excellente - réveil frais"] },
      { key: "stressLevel", question: "Comment décrivez-vous votre niveau de stress ?", options: ["Accablant - stress constant", "Élevé - souvent stressé(e)", "Modéré - gérable", "Faible - rarement stressé(e)", "Minimal - très calme"] },
      { key: "exerciseFrequency", question: "À quelle fréquence faites-vous de l'exercice ?", options: ["Jamais / rarement", "1-2 fois par semaine", "3-4 fois par semaine", "5+ fois par semaine", "Mouvement quotidien + exercice structuré"] },
      { key: "dietQuality", question: "Comment décrivez-vous votre alimentation actuelle ?", options: ["Principalement transformée / fast-food", "Mixte - un peu sain, un peu non", "Assez saine avec quelques écarts", "Très saine - aliments complets", "Régime santé strict"] },
      { key: "previousDiets", question: "Combien de régimes avez-vous essayé ces 5 dernières années ?", options: ["Aucun", "1-2 régimes", "3-5 régimes", "6-10 régimes", "Plus de 10"] },
    ],
    loading: { title: "L'IA analyse vos réponses...", desc: "Création de votre rapport santé personnalisé basé sur les dernières recherches" },
    results: {
      title: "Résultats de votre évaluation",
      subtitle: "Voici votre profil santé personnalisé",
      scoreLabel: "Score de Santé Métabolique",
      good: "Bon",
      needsImprovement: "À améliorer",
      needsAttention: "Attention requise",
      recsTitle: "Vos recommandations personnalisées",
      ctaTitle: "Commencez votre transformation",
      ctaDesc: "La Méthode Feras Alayed™ peut vous aider à obtenir des améliorations mesurables en 90 jours.",
      bookBtn: "Réserver une consultation gratuite",
      whatsappBtn: "Discuter sur WhatsApp",
      peopleHelped: "Personnes aidées",
      countries: "Pays",
      experience: "Expérience",
    },
    qualification: {
      green: { badge: "Prêt à commencer", msg: "Vous êtes un candidat idéal pour le programme. Contactez Feras maintenant." },
      yellow: { badge: "Besoin d'infos", msg: "Vous avez des questions légitimes. Parcourez nos articles ou demandez à l'expert." },
      red: { badge: "Exploration", msg: "Super que vous vous intéressiez à votre santé ! Lisez notre guide gratuit." },
    },
    consultation: {
      title: "Réservez votre consultation gratuite",
      subtitle: "Connectez-vous avec Feras Al-Ayed pour une consultation personnalisée de 15 minutes.",
      expectTitle: "À quoi s'attendre :",
      expectations: ["Revue de vos résultats", "Recommandations personnalisées", "Introduction à la Méthode Feras Alayed™", "Sans pression ni obligation"],
      bookWhatsApp: "Réserver via WhatsApp",
      returnHome: "Retour à l'accueil",
      consultWith: "Votre consultation sera avec :",
      specialistTitle: "Spécialiste en Nutrition Thérapeutique et Comportementale",
    },
  },
  es: {
    pageTitle: "Quiz de Salud Gratis | ¿Tienes Resistencia a la Insulina?",
    metaDesc: "Descubre la causa de tus problemas de salud en 1 minuto. Quiz inteligente basado en investigaciones científicas.",
    questionOf: (c, t) => `Pregunta ${c} de ${t}`,
    prevQuestion: "← Pregunta anterior",
    questions: [
      { key: "age", question: "¿Cuál es tu rango de edad?", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "¿Cuál es tu género?", options: ["Mujer", "Hombre", "Prefiero no decir"] },
      { key: "primaryGoal", question: "¿Cuál es tu objetivo de salud principal?", options: ["Perder peso de forma sostenible", "Controlar el azúcar / prediabetes", "Aumentar la energía", "Mejorar la salud intestinal", "Mejor calidad de sueño", "Bienestar general y longevidad"] },
      { key: "currentEnergy", question: "¿Cómo calificarías tu energía diaria?", options: ["Muy baja - agotado todo el día", "Baja - bajones frecuentes por la tarde", "Moderada - algunas horas buenas", "Buena - generalmente con energía", "Excelente - energía constante"] },
      { key: "sleepQuality", question: "¿Cómo es la calidad de tu sueño?", options: ["Mala - dificultad para dormir", "Regular - despierto cansado", "Media - podría ser mejor", "Buena - sueño reparador", "Excelente - despierto renovado"] },
      { key: "stressLevel", question: "¿Cómo describirías tu nivel de estrés?", options: ["Abrumador - estrés constante", "Alto - frecuentemente estresado", "Moderado - manejable", "Bajo - raramente estresado", "Mínimo - muy tranquilo"] },
      { key: "exerciseFrequency", question: "¿Con qué frecuencia haces ejercicio?", options: ["Nunca / raramente", "1-2 veces por semana", "3-4 veces por semana", "5+ veces por semana", "Movimiento diario + ejercicio estructurado"] },
      { key: "dietQuality", question: "¿Cómo describirías tu dieta actual?", options: ["Principalmente procesada / comida rápida", "Mixta - algo saludable, algo no", "Bastante saludable con excepciones", "Muy saludable - alimentos integrales", "Dieta estricta de salud"] },
      { key: "previousDiets", question: "¿Cuántas dietas has probado en los últimos 5 años?", options: ["Ninguna", "1-2 dietas", "3-5 dietas", "6-10 dietas", "Más de 10"] },
    ],
    loading: { title: "La IA está analizando tus respuestas...", desc: "Creando tu informe de salud personalizado basado en las últimas investigaciones" },
    results: {
      title: "Resultados de tu evaluación",
      subtitle: "Aquí está tu perfil de salud personalizado",
      scoreLabel: "Puntuación de Salud Metabólica",
      good: "Bueno",
      needsImprovement: "Necesita mejorar",
      needsAttention: "Necesita atención",
      recsTitle: "Tus recomendaciones personalizadas",
      ctaTitle: "Comienza tu transformación",
      ctaDesc: "El Método Feras Alayed™ puede ayudarte a lograr mejoras medibles en 90 días.",
      bookBtn: "Reservar consulta gratuita",
      whatsappBtn: "Chatear por WhatsApp",
      peopleHelped: "Personas ayudadas",
      countries: "Países",
      experience: "Experiencia",
    },
    qualification: {
      green: { badge: "Listo para empezar", msg: "Eres un candidato ideal. Contacta a Feras ahora para comenzar." },
      yellow: { badge: "Necesita más info", msg: "Tienes preguntas válidas. Navega nuestros artículos o pregunta al experto." },
      red: { badge: "Explorando", msg: "¡Genial que te intereses por tu salud! Lee nuestra guía gratuita." },
    },
    consultation: {
      title: "Reserva tu consulta gratuita",
      subtitle: "Conéctate con Feras Al-Ayed para una consulta personalizada de 15 minutos.",
      expectTitle: "Qué esperar:",
      expectations: ["Revisión de tus resultados", "Recomendaciones personalizadas", "Introducción al Método Feras Alayed™", "Sin presión ni obligación"],
      bookWhatsApp: "Reservar por WhatsApp",
      returnHome: "Volver al inicio",
      consultWith: "Tu consulta será con:",
      specialistTitle: "Especialista en Nutrición Terapéutica y Conductual",
    },
  },
  de: {
    pageTitle: "Kostenloser Gesundheitsquiz | Haben Sie Insulinresistenz?",
    metaDesc: "Entdecken Sie die Ursache Ihrer Gesundheitsprobleme in 1 Minute. KI-gestützter Quiz basierend auf neuester Forschung.",
    questionOf: (c, t) => `Frage ${c} von ${t}`,
    prevQuestion: "← Vorherige Frage",
    questions: [
      { key: "age", question: "Wie alt sind Sie?", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "Ihr Geschlecht?", options: ["Weiblich", "Männlich", "Keine Angabe"] },
      { key: "primaryGoal", question: "Was ist Ihr wichtigstes Gesundheitsziel?", options: ["Nachhaltig abnehmen", "Blutzucker / Prädiabetes managen", "Energielevel steigern", "Darmgesundheit verbessern", "Schlafqualität verbessern", "Allgemeines Wohlbefinden & Langlebigkeit"] },
      { key: "currentEnergy", question: "Wie bewerten Sie Ihr tägliches Energieniveau?", options: ["Sehr niedrig - den ganzen Tag erschöpft", "Niedrig - häufige Nachmittagstiefs", "Mittel - einige gute Stunden", "Gut - meistens energiegeladen", "Ausgezeichnet - konstante Energie"] },
      { key: "sleepQuality", question: "Wie ist Ihre Schlafqualität?", options: ["Schlecht - Schwierigkeiten einzuschlafen", "Mäßig - wache müde auf", "Durchschnittlich - könnte besser sein", "Gut - meist erholsam", "Ausgezeichnet - wache erfrischt auf"] },
      { key: "stressLevel", question: "Wie beschreiben Sie Ihr Stresslevel?", options: ["Überwältigend - ständiger Stress", "Hoch - häufig gestresst", "Moderat - handhabbar", "Niedrig - selten gestresst", "Minimal - sehr ruhig"] },
      { key: "exerciseFrequency", question: "Wie oft treiben Sie Sport?", options: ["Nie / selten", "1-2 Mal pro Woche", "3-4 Mal pro Woche", "5+ Mal pro Woche", "Tägliche Bewegung + strukturiertes Training"] },
      { key: "dietQuality", question: "Wie beschreiben Sie Ihre aktuelle Ernährung?", options: ["Hauptsächlich verarbeitet / Fast Food", "Gemischt - teils gesund, teils nicht", "Ziemlich gesund mit gelegentlichen Ausnahmen", "Sehr gesund - Vollwertkost", "Strenge Gesundheitsdiät"] },
      { key: "previousDiets", question: "Wie viele Diäten haben Sie in den letzten 5 Jahren probiert?", options: ["Keine", "1-2 Diäten", "3-5 Diäten", "6-10 Diäten", "Mehr als 10"] },
    ],
    loading: { title: "KI analysiert Ihre Antworten...", desc: "Erstellt Ihren personalisierten Gesundheitsbericht basierend auf neuester Forschung" },
    results: {
      title: "Ihre Bewertungsergebnisse",
      subtitle: "Hier ist Ihr personalisiertes Gesundheitsprofil",
      scoreLabel: "Metabolischer Gesundheitsscore",
      good: "Gut",
      needsImprovement: "Verbesserung nötig",
      needsAttention: "Aufmerksamkeit nötig",
      recsTitle: "Ihre personalisierten Empfehlungen",
      ctaTitle: "Starten Sie Ihre Transformation",
      ctaDesc: "Die Feras Alayed Methode™ kann Ihnen helfen, in 90 Tagen messbare Verbesserungen zu erzielen.",
      bookBtn: "Kostenlose Beratung buchen",
      whatsappBtn: "Per WhatsApp chatten",
      peopleHelped: "Menschen geholfen",
      countries: "Länder",
      experience: "Erfahrung",
    },
    qualification: {
      green: { badge: "Bereit zu starten", msg: "Sie sind ein idealer Kandidat. Kontaktieren Sie Feras jetzt." },
      yellow: { badge: "Mehr Infos nötig", msg: "Sie haben berechtigte Fragen. Lesen Sie unsere Artikel oder fragen Sie den Experten." },
      red: { badge: "Erkundung", msg: "Toll, dass Sie sich für Ihre Gesundheit interessieren! Lesen Sie unseren kostenlosen Leitfaden." },
    },
    consultation: {
      title: "Buchen Sie Ihre kostenlose Beratung",
      subtitle: "Verbinden Sie sich mit Feras Al-Ayed für eine 15-minütige personalisierte Beratung.",
      expectTitle: "Was Sie erwartet:",
      expectations: ["Überprüfung Ihrer Ergebnisse", "Personalisierte Empfehlungen", "Einführung in die Feras Alayed Methode™", "Kein Druck, keine Verpflichtung"],
      bookWhatsApp: "Über WhatsApp buchen",
      returnHome: "Zurück zur Startseite",
      consultWith: "Ihre Beratung wird sein mit:",
      specialistTitle: "Spezialist für Therapeutische & Verhaltensernährung",
    },
  },
  tr: {
    pageTitle: "Ücretsiz Sağlık Testi | İnsülin Direncin Var mı?",
    metaDesc: "Sağlık sorunlarınızın nedenini 1 dakikada keşfedin. En son bilimsel araştırmalara dayanan akıllı test.",
    questionOf: (c, t) => `Soru ${c} / ${t}`,
    prevQuestion: "← Önceki soru",
    questions: [
      { key: "age", question: "Yaş aralığınız nedir?", options: ["25-34", "35-44", "45-54", "55-64", "65+"] },
      { key: "gender", question: "Cinsiyetiniz?", options: ["Kadın", "Erkek", "Belirtmek istemiyorum"] },
      { key: "primaryGoal", question: "Temel sağlık hedefiniz nedir?", options: ["Sürdürülebilir kilo kaybı", "Kan şekeri / prediyabet yönetimi", "Enerji seviyesini artırma", "Bağırsak sağlığını iyileştirme", "Uyku kalitesini artırma", "Genel sağlık ve uzun ömür"] },
      { key: "currentEnergy", question: "Günlük enerji seviyenizi nasıl değerlendirirsiniz?", options: ["Çok düşük - gün boyu bitkin", "Düşük - sık öğleden sonra çöküşleri", "Orta - birkaç iyi saat", "İyi - genellikle enerjik", "Mükemmel - sabit enerji"] },
      { key: "sleepQuality", question: "Uyku kaliteniz nasıl?", options: ["Kötü - uykuya dalmakta zorluk", "Orta - yorgun uyanma", "Ortalama - daha iyi olabilir", "İyi - genellikle dinlendirici", "Mükemmel - tazelenmiş uyanma"] },
      { key: "stressLevel", question: "Stres seviyenizi nasıl tanımlarsınız?", options: ["Bunaltıcı - sürekli stres", "Yüksek - sık stresli", "Orta - yönetilebilir", "Düşük - nadiren stresli", "Minimal - çok sakin"] },
      { key: "exerciseFrequency", question: "Ne sıklıkla egzersiz yaparsınız?", options: ["Hiç / nadiren", "Haftada 1-2 kez", "Haftada 3-4 kez", "Haftada 5+ kez", "Günlük hareket + yapılandırılmış egzersiz"] },
      { key: "dietQuality", question: "Mevcut beslenmenizi nasıl tanımlarsınız?", options: ["Çoğunlukla işlenmiş / fast food", "Karışık - biraz sağlıklı, biraz değil", "Oldukça sağlıklı, ara sıra istisnalar", "Çok sağlıklı - tam gıda odaklı", "Sıkı sağlık diyeti"] },
      { key: "previousDiets", question: "Son 5 yılda kaç diyet denediniz?", options: ["Hiç", "1-2 diyet", "3-5 diyet", "6-10 diyet", "10'dan fazla"] },
    ],
    loading: { title: "Yapay zeka yanıtlarınızı analiz ediyor...", desc: "En son araştırmalara dayalı kişiselleştirilmiş sağlık raporunuz oluşturuluyor" },
    results: {
      title: "Değerlendirme Sonuçlarınız",
      subtitle: "İşte kişiselleştirilmiş sağlık profiliniz",
      scoreLabel: "Metabolik Sağlık Puanı",
      good: "İyi",
      needsImprovement: "İyileştirme gerekli",
      needsAttention: "Dikkat gerekli",
      recsTitle: "Kişiselleştirilmiş önerileriniz",
      ctaTitle: "Dönüşümünüzü başlatın",
      ctaDesc: "Feras Alayed Metodu™ 90 günde ölçülebilir iyileşmeler elde etmenize yardımcı olabilir.",
      bookBtn: "Ücretsiz danışmanlık ayırtın",
      whatsappBtn: "WhatsApp'tan yazın",
      peopleHelped: "Kişiye yardım edildi",
      countries: "Ülke",
      experience: "Deneyim",
    },
    qualification: {
      green: { badge: "Başlamaya hazır", msg: "İdeal bir adaysınız. Hemen başlamak için Feras ile iletişime geçin." },
      yellow: { badge: "Daha fazla bilgi gerekli", msg: "Geçerli sorularınız var. Makalelerimize göz atın veya uzmana sorun." },
      red: { badge: "Keşif aşaması", msg: "Sağlığınızla ilgilenmeniz harika! Ücretsiz rehberimizi okuyun." },
    },
    consultation: {
      title: "Ücretsiz danışmanlığınızı ayırtın",
      subtitle: "15 dakikalık kişiselleştirilmiş danışmanlık için Feras Al-Ayed ile bağlantı kurun.",
      expectTitle: "Ne beklemelisiniz:",
      expectations: ["Sonuçlarınızın incelenmesi", "Kişiselleştirilmiş öneriler", "Feras Alayed Metodu™ tanıtımı", "Baskı yok, zorunluluk yok"],
      bookWhatsApp: "WhatsApp'tan ayırtın",
      returnHome: "Ana sayfaya dön",
      consultWith: "Danışmanlığınız şu kişiyle olacak:",
      specialistTitle: "Terapötik & Davranışsal Beslenme Uzmanı",
    },
  },
};

export default function HealthAssessment() {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";
  const t = i18n[lang] || i18n.en;
  const [step, setStep] = useState<Step>("assessment");
  const [aiReport, setAiReport] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [qualification, setQualification] = useState<QualificationLevel>("yellow");
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    age: "", gender: "", primaryGoal: "", currentEnergy: "",
    sleepQuality: "", stressLevel: "", exerciseFrequency: "",
    dietQuality: "", previousDiets: "",
  });

  useEffect(() => {
    document.title = t.pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.metaDesc);
  }, [t]);

  const registerLead = trpc.leads.register.useMutation();
  const generateReport = trpc.assessment.generateAIReport.useMutation({
    onSuccess: (data) => {
      if (data.success && data.report) {
        setAiReport(data.report);
        // AI Qualification based on score
        const score = data.report.score;
        if (score <= 40) setQualification("green"); // Low score = high urgency = ready to buy
        else if (score <= 65) setQualification("yellow");
        else setQualification("red"); // High score = less urgency = exploring
        setStep("results");
      }
    },
    onError: () => {
      setStep("results");
    },
  });

  const handleAnswer = (value: string) => {
    const key = t.questions[currentQuestion].key as keyof AssessmentAnswers;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (currentQuestion < t.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep("loading");
      generateReport.mutate({
        answers: updated,
        language: lang,
        source: "health-assessment-quiz",
      });
      registerLead.mutate({
        fullName: "Quiz Completion",
        phone: "",
        source: "quiz-funnel-completion",
      });
    }
  };

  const calculateScore = (): number => {
    let score = 50;
    const optionIndex = (key: keyof AssessmentAnswers) => {
      const q = t.questions.find(q => q.key === key);
      if (!q) return 2;
      const idx = q.options.indexOf(answers[key]);
      return idx >= 0 ? idx : 2;
    };
    // Energy: 0=worst, 4=best
    score += [-15, -10, 0, 10, 15][optionIndex("currentEnergy")] || 0;
    // Sleep: 0=worst, 4=best
    score += [-15, -10, 0, 10, 15][optionIndex("sleepQuality")] || 0;
    // Stress: 0=worst, 4=best
    score += [-15, -10, 0, 10, 15][optionIndex("stressLevel")] || 0;
    // Exercise: 0=worst, 4=best
    score += [-10, -5, 5, 10, 15][optionIndex("exerciseFrequency")] || 0;
    // Diet: 0=worst, 4=best
    score += [-15, -5, 5, 10, 12][optionIndex("dietQuality")] || 0;
    return Math.max(10, Math.min(100, score));
  };

  const getQualification = (score: number): QualificationLevel => {
    if (score <= 40) return "green"; // Low health = high urgency = ready to buy
    if (score <= 65) return "yellow"; // Medium = needs info
    return "red"; // High health = just exploring
  };

  // ============ RENDER: Assessment Questions ============
  const renderAssessment = () => {
    const q = t.questions[currentQuestion];
    const icons = [Heart, Heart, Scale, Zap, Moon, Brain, Activity, Heart, Scale];
    const Icon = icons[currentQuestion] || Heart;
    const progress = ((currentQuestion + 1) / t.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isRtl ? "rtl" : "ltr"}>
        <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-700">
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feras Alayed Method™</Link>
            <p className="text-slate-400 text-sm">{t.questionOf(currentQuestion + 1, t.questions.length)}</p>
          </div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{q.question}</h2>
          </div>

          <div className="space-y-3">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full text-start p-4 rounded-xl border border-slate-700 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-200 group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="mt-6 text-slate-400 hover:text-white transition-colors text-sm"
            >
              {t.prevQuestion}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============ RENDER: Loading ============
  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center" dir={isRtl ? "rtl" : "ltr"}>
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold mb-3">{t.loading.title}</h2>
        <p className="text-slate-400 max-w-md mx-auto">{t.loading.desc}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );

  // ============ RENDER: Results with AI Qualification ============
  const renderResults = () => {
    const score = aiReport?.score || calculateScore();
    const qual = aiReport ? qualification : getQualification(calculateScore());
    const scoreColor = score >= 70 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400";
    const scoreLabel = score >= 70 ? t.results.good : score >= 50 ? t.results.needsImprovement : t.results.needsAttention;
    const qualData = t.qualification[qual];
    const qualBg = qual === "green" ? "bg-green-500/10 border-green-500/30" : qual === "yellow" ? "bg-amber-500/10 border-amber-500/30" : "bg-blue-500/10 border-blue-500/30";
    const qualIcon = qual === "green" ? <TrendingUp className="w-5 h-5 text-green-400" /> : qual === "yellow" ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <Shield className="w-5 h-5 text-blue-400" />;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isRtl ? "rtl" : "ltr"}>
        <div className="container max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feras Alayed Method™</Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.results.title}</h1>
            <p className="text-slate-400">{t.results.subtitle}</p>
          </div>

          {/* Score */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">{t.results.scoreLabel}</p>
            <div className={`text-6xl font-bold ${scoreColor} mb-2`}>{score}</div>
            <p className={`text-lg ${scoreColor}`}>{scoreLabel}</p>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-6">
              <div className={`h-3 rounded-full transition-all duration-1000 ${score >= 70 ? "bg-green-400" : score >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* AI Qualification Badge */}
          <div className={`${qualBg} border rounded-xl p-6 mb-8`}>
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1">{qualIcon}</div>
              <div>
                <span className="font-bold text-lg">{qualData.badge}</span>
                <p className="text-slate-300 mt-1">{qualData.msg}</p>
              </div>
            </div>
          </div>

          {/* AI Report sections */}
          {aiReport?.topRisks && aiReport.topRisks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                {lang === "ar" ? "المخاطر المحددة" : "Identified Risks"}
              </h2>
              <div className="space-y-3">
                {aiReport.topRisks.map((risk: any, i: number) => (
                  <div key={i} className={`p-4 rounded-xl border ${risk.urgency === "immediate" ? "border-red-500/40 bg-red-500/5" : risk.urgency === "soon" ? "border-amber-500/40 bg-amber-500/5" : "border-slate-600 bg-slate-800/30"}`}>
                    <h3 className="font-semibold">{risk.risk}</h3>
                    <p className="text-sm text-slate-400 mt-1">{risk.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 90-Day Action Plan */}
          {aiReport?.actionPlan && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                {lang === "ar" ? "خطة العمل لـ 90 يوم" : "Your 90-Day Action Plan"}
              </h2>
              <div className="space-y-4">
                {[aiReport.actionPlan.phase1, aiReport.actionPlan.phase2, aiReport.actionPlan.phase3].map((phase: any, i: number) => phase && (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">{i + 1}</div>
                      <h3 className="font-semibold">{phase.title}</h3>
                    </div>
                    <ul className="space-y-2 ms-11">
                      {phase.actions?.map((action: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualification-based CTA */}
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">{t.results.ctaTitle}</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">{t.results.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {qual === "green" && (
                <>
                  <a
                    href="https://wa.me/96877020770?text=أكملت الاختبار الصحي وأرغب بالبدء فوراً في برنامج التحول"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {t.results.whatsappBtn} <ArrowRight className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setStep("consultation")}
                    className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    {t.results.bookBtn}
                  </button>
                </>
              )}
              {qual === "yellow" && (
                <>
                  <button
                    onClick={() => setStep("consultation")}
                    className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {t.results.bookBtn} <ArrowRight className="w-5 h-5" />
                  </button>
                  <Link
                    href="/ask-expert"
                    className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors flex items-center justify-center"
                  >
                    {lang === "ar" ? "اسأل الخبير" : "Ask the Expert"}
                  </Link>
                </>
              )}
              {qual === "red" && (
                <>
                  <Link
                    href="/blog"
                    className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {lang === "ar" ? "اقرأ المقالات" : "Read Articles"} <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/start"
                    className="px-8 py-4 border border-slate-600 text-slate-300 font-bold rounded-xl hover:bg-slate-700/50 transition-colors flex items-center justify-center"
                  >
                    {lang === "ar" ? "ابدأ هنا" : "Start Here"}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Trust */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">10,000+</div>
              <div className="text-sm text-slate-400">{t.results.peopleHelped}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">30+</div>
              <div className="text-sm text-slate-400">{t.results.countries}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">15+</div>
              <div className="text-sm text-slate-400">{t.results.experience}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ RENDER: Consultation ============
  const renderConsultation = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feras Alayed Method™</Link>
          <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.consultation.title}</h1>
          <p className="text-slate-400 max-w-lg mx-auto">{t.consultation.subtitle}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">{t.consultation.expectTitle}</h3>
          <ul className="space-y-4 mb-8">
            {t.consultation.expectations.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            <a
              href="https://wa.me/96877020770?text=أكملت الاختبار الصحي وأرغب بحجز استشارة مجانية مع فراس"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
            >
              {t.consultation.bookWhatsApp} <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="w-full px-8 py-4 border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 transition-colors flex items-center justify-center"
            >
              {t.consultation.returnHome}
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">{t.consultation.consultWith}</p>
          <p className="font-semibold text-lg mt-1">Feras Al-Ayed</p>
          <p className="text-amber-400 text-sm">{t.consultation.specialistTitle}</p>
          <p className="text-slate-500 text-sm">Presidential Sapphire | 15+ Years Experience</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {step === "assessment" && renderAssessment()}
      {step === "loading" && renderLoading()}
      {step === "results" && renderResults()}
      {step === "consultation" && renderConsultation()}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.pageTitle,
            description: t.metaDesc,
            url: "https://feelgreat.us.com/health-assessment",
            isPartOf: { "@type": "WebSite", name: "Feras Alayed Method", url: "https://feelgreat.us.com" },
            author: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
            },
          }),
        }}
      />
    </>
  );
}
