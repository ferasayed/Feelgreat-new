import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Clock, Utensils, Moon, Sun, Coffee, Apple, Salad, AlertTriangle, CheckCircle, ArrowRight, Phone, Share2, Droplets, Download, User, Star, Bell, Timer } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ShareButtons from "@/components/ShareButtons";
import { PARTNER_STORIES } from "@/data/partnerStories";

// ============ 6-Language Content ============
const i18n: Record<string, {
  pageTitle: string;
  pageSubtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  calculateBtn: string;
  yourScheduleTitle: string;
  fastingWindow: string;
  eatingWindow: string;
  hours: string;
  scheduleItems: { icon: string; label: string; timeLabel: string }[];
  nutritionTitle: string;
  focusFoods: { title: string; items: string[] };
  moderateFoods: { title: string; items: string[] };
  avoidFoods: { title: string; items: string[] };
  portionTitle: string;
  portions: { label: string; size: string }[];
  tipsTitle: string;
  tips: string[];
  disclaimer: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  ctaQuiz: string;
  shareTitle: string;
  resetBtn: string;
  methodBadge: string;
  saveAsImage: string;
  savingImage: string;
  leadCapture: { title: string; subtitle: string; nameLabel: string; namePlaceholder: string; phonePlaceholder: string; phoneLabel: string; submitBtn: string; skip: string; privacy: string };
  successStories: { title: string; subtitle: string; viewAll: string };
  countdown: { title: string; fasting: string; eating: string; until: string; hours: string; minutes: string; seconds: string; currentlyFasting: string; currentlyEating: string };
  reminders: { enable: string; enabled: string; denied: string; unsupported: string; description: string; reminderSet: string; disableBtn: string };
}> = {
  ar: {
    pageTitle: "حاسبة مواعيد الصيام المتقطع 16:8",
    pageSubtitle: "أدخل وقت عشائك واحصل على جدول صيام مخصص لك مع نصائح غذائية مبنية على برنامج الصحة المستدامة",
    inputLabel: "ما هو وقت عشائك المعتاد؟",
    inputPlaceholder: "اختر الوقت",
    calculateBtn: "احسب جدولي",
    yourScheduleTitle: "جدول الصيام المخصص لك",
    fastingWindow: "فترة الصيام",
    eatingWindow: "فترة الأكل",
    hours: "ساعة",
    scheduleItems: [
      { icon: "moon", label: "بداية الصيام (بعد العشاء)", timeLabel: "بداية الصيام" },
      { icon: "coffee", label: "يونيميت + ماء / شاي / قهوة بدون سكر", timeLabel: "صباح اليوم التالي" },
      { icon: "utensils", label: "وجبة الغداء (كسر الصيام)", timeLabel: "كسر الصيام" },
      { icon: "apple", label: "وجبة خفيفة صحية", timeLabel: "سناك" },
      { icon: "salad", label: "وجبة العشاء (بالانس قبل الوجبة)", timeLabel: "العشاء" },
    ],
    nutritionTitle: "قواعد غذائية بسيطة من برنامج الصحة المستدامة",
    focusFoods: {
      title: "ركّز على هذه الأطعمة ✅",
      items: [
        "بروتين صافي: صدر دجاج، سمك، تونا، روبيان، لحم بقري قليل الدهن، بيض",
        "خضروات: بروكلي، سبانخ، خيار، كوسا، فلفل، باذنجان، فطر، خس",
        "دهون صحية: أفوكادو، زيت زيتون، مكسرات، بذور الشيا والكتان",
        "كربوهيدرات جيدة: أرز بني، كينوا، شوفان، بقوليات، فواكه طازجة",
        "مشروبات: ماء، شاي أخضر، قهوة بدون سكر أو حليب (أثناء الصيام)",
      ],
    },
    moderateFoods: {
      title: "تناولها باعتدال ⚠️",
      items: [
        "أرز أبيض، خبز حبوب كاملة، معكرونة القمح، كسكسي",
        "فواكه عالية السكر: موز ناضج، مانجو، بطيخ، أناناس",
        "مايونيز، صوص الصويا",
      ],
    },
    avoidFoods: {
      title: "تجنّب هذه الأطعمة ❌",
      items: [
        "خبز أبيض، بسكويت، معجنات، كيك، حلويات",
        "مشروبات غازية، عصائر محلاة، مشروبات الطاقة",
        "أطعمة مقلية، لحوم مصنعة (نقانق، سجق)",
        "زيوت مهدرجة، وجبات ميكروويف جاهزة",
      ],
    },
    portionTitle: "دليل الحصص (بيدك!)",
    portions: [
      { label: "البروتين", size: "بحجم كف اليد" },
      { label: "الكربوهيدرات", size: "بحجم قبضة اليد" },
      { label: "الدهون", size: "بحجم إصبع الإبهام" },
      { label: "الخضروات", size: "قبضة يد أو أكثر" },
      { label: "الفواكه", size: "قبضة يد أو أقل" },
    ],
    tipsTitle: "نصائح ذهبية للصيام المتقطع",
    tips: [
      "اشرب يونيميت في الصباح لتعزيز التركيز والطاقة أثناء الصيام",
      "تناول بالانس قبل وجبة العشاء بـ 10-15 دقيقة لتقليل تأثير الكربوهيدرات",
      "اشرب 2-3 لتر ماء يومياً (يمكنك شرب الماء أثناء الصيام)",
      "تمرّن 3-4 أيام أسبوعياً لمدة 30 دقيقة على الأقل",
      "نم 7-8 ساعات يومياً لتحسين الأيض وتقليل الجوع",
    ],
    disclaimer: "هذه إرشادات تدريبية عامة وليست وصفة طبية. استشر طبيبك قبل البدء بأي نظام غذائي جديد.",
    ctaTitle: "هل تريد برنامجاً مخصصاً لحالتك؟",
    ctaDesc: "تواصل مع فراس الآن للحصول على خطة صيام وتغذية مصممة خصيصاً لأهدافك الصحية",
    ctaBtn: "تواصل عبر واتساب",
    ctaQuiz: "اختبر صحتك مجاناً",
    shareTitle: "شارك جدولك مع أصدقائك",
    resetBtn: "حساب جديد",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "حفظ كصورة",
    savingImage: "جاري الحفظ...",
    leadCapture: {
      title: "أدخل بياناتك لعرض جدولك المخصص",
      subtitle: "سنرسل لك نصائح إضافية عبر واتساب",
      nameLabel: "الاسم",
      namePlaceholder: "اسمك الكريم",
      phoneLabel: "رقم الواتساب",
      phonePlaceholder: "05XXXXXXXX",
      submitBtn: "اعرض جدولي",
      skip: "تخطي",
      privacy: "بياناتك محمية ولن نشاركها مع أي طرف ثالث",
    },
    successStories: {
      title: "نتائج حقيقية مع الصيام المتقطع",
      subtitle: "قصص نجاح من مشتركين في برنامج الصحة المستدامة",
      viewAll: "شاهد جميع القصص",
    },
    countdown: { title: "العداد التنازلي", fasting: "صيام", eating: "أكل", until: "المتبقي حتى", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية", currentlyFasting: "أنت في فترة الصيام الآن", currentlyEating: "أنت في فترة الأكل الآن" },
    reminders: { enable: "تفعيل تذكير الصيام", enabled: "التذكيرات مفعّلة", denied: "الإشعارات محظورة", unsupported: "غير مدعوم", description: "احصل على تذكير يومي بمواعيد الصيام والأكل", reminderSet: "سيتم تذكيرك يومياً بمواعيد صيامك", disableBtn: "إيقاف التذكيرات" },
  },
  en: {
    pageTitle: "16:8 Intermittent Fasting Schedule Calculator",
    pageSubtitle: "Enter your dinner time and get a personalized fasting schedule with nutrition guidelines from the Sustainable Health Program",
    inputLabel: "What time do you usually have dinner?",
    inputPlaceholder: "Select time",
    calculateBtn: "Calculate My Schedule",
    yourScheduleTitle: "Your Personalized Fasting Schedule",
    fastingWindow: "Fasting Window",
    eatingWindow: "Eating Window",
    hours: "hours",
    scheduleItems: [
      { icon: "moon", label: "Start fasting (after dinner)", timeLabel: "Fasting starts" },
      { icon: "coffee", label: "Unimate + water / tea / coffee (no sugar)", timeLabel: "Next morning" },
      { icon: "utensils", label: "Lunch (break your fast)", timeLabel: "Break fast" },
      { icon: "apple", label: "Healthy snack", timeLabel: "Snack" },
      { icon: "salad", label: "Dinner (Balance before the meal)", timeLabel: "Dinner" },
    ],
    nutritionTitle: "Simple Nutrition Rules from the Sustainable Health Program",
    focusFoods: {
      title: "Focus on these foods ✅",
      items: [
        "Lean protein: chicken breast, fish, tuna, shrimp, lean beef, eggs",
        "Vegetables: broccoli, spinach, cucumber, zucchini, peppers, eggplant, mushrooms, lettuce",
        "Healthy fats: avocado, olive oil, nuts, chia & flax seeds",
        "Good carbs: brown rice, quinoa, oats, legumes, fresh fruits",
        "Drinks: water, green tea, black coffee (during fasting window)",
      ],
    },
    moderateFoods: {
      title: "Eat in moderation ⚠️",
      items: [
        "White rice, whole grain bread, wheat pasta, couscous",
        "High-sugar fruits: ripe banana, mango, watermelon, pineapple",
        "Mayonnaise, soy sauce",
      ],
    },
    avoidFoods: {
      title: "Avoid these foods ❌",
      items: [
        "White bread, biscuits, pastries, cakes, sweets",
        "Soda, sweetened juices, energy drinks",
        "Fried foods, processed meats (sausages, hot dogs)",
        "Hydrogenated oils, ready-made microwave meals",
      ],
    },
    portionTitle: "Portion Guide (Use Your Hand!)",
    portions: [
      { label: "Protein", size: "Palm size" },
      { label: "Carbs", size: "Fist size" },
      { label: "Fats", size: "Thumb size" },
      { label: "Vegetables", size: "One fist or more" },
      { label: "Fruits", size: "One fist or less" },
    ],
    tipsTitle: "Golden Tips for Intermittent Fasting",
    tips: [
      "Drink Unimate in the morning to boost focus and energy during fasting",
      "Take Balance 10-15 minutes before dinner to reduce carb impact",
      "Drink 2-3 liters of water daily (water is allowed during fasting)",
      "Exercise 3-4 days per week for at least 30 minutes",
      "Sleep 7-8 hours nightly to improve metabolism and reduce hunger",
    ],
    disclaimer: "These are general coaching guidelines, not medical prescriptions. Consult your doctor before starting any new diet.",
    ctaTitle: "Want a personalized program for your situation?",
    ctaDesc: "Connect with Feras now for a fasting and nutrition plan designed specifically for your health goals",
    ctaBtn: "Chat on WhatsApp",
    ctaQuiz: "Free Health Quiz",
    shareTitle: "Share your schedule with friends",
    resetBtn: "New Calculation",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "Save as Image",
    savingImage: "Saving...",
    leadCapture: {
      title: "Enter your details to see your schedule",
      subtitle: "We'll send you extra tips via WhatsApp",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      phoneLabel: "WhatsApp number",
      phonePlaceholder: "+1 XXX XXX XXXX",
      submitBtn: "Show My Schedule",
      skip: "Skip",
      privacy: "Your data is protected and never shared with third parties",
    },
    successStories: {
      title: "Real Results with Intermittent Fasting",
      subtitle: "Success stories from Sustainable Health Program members",
      viewAll: "View All Stories",
    },
    countdown: { title: "Live Countdown", fasting: "Fasting", eating: "Eating", until: "Time remaining until", hours: "hours", minutes: "min", seconds: "sec", currentlyFasting: "You are currently fasting", currentlyEating: "You are in your eating window" },
    reminders: { enable: "Enable Fasting Reminders", enabled: "Reminders Enabled", denied: "Notifications Blocked", unsupported: "Not Supported", description: "Get daily reminders for your fasting and eating times", reminderSet: "You'll be reminded daily of your fasting schedule", disableBtn: "Disable Reminders" },
  },
  fr: {
    pageTitle: "Calculateur de Jeûne Intermittent 16:8",
    pageSubtitle: "Entrez l'heure de votre dîner et obtenez un programme de jeûne personnalisé avec des conseils nutritionnels du Programme de Santé Durable",
    inputLabel: "À quelle heure dînez-vous habituellement ?",
    inputPlaceholder: "Sélectionner l'heure",
    calculateBtn: "Calculer mon programme",
    yourScheduleTitle: "Votre Programme de Jeûne Personnalisé",
    fastingWindow: "Fenêtre de jeûne",
    eatingWindow: "Fenêtre alimentaire",
    hours: "heures",
    scheduleItems: [
      { icon: "moon", label: "Début du jeûne (après le dîner)", timeLabel: "Début du jeûne" },
      { icon: "coffee", label: "Unimate + eau / thé / café (sans sucre)", timeLabel: "Le lendemain matin" },
      { icon: "utensils", label: "Déjeuner (rompre le jeûne)", timeLabel: "Rupture du jeûne" },
      { icon: "apple", label: "Collation saine", timeLabel: "Collation" },
      { icon: "salad", label: "Dîner (Balance avant le repas)", timeLabel: "Dîner" },
    ],
    nutritionTitle: "Règles nutritionnelles simples du Programme de Santé Durable",
    focusFoods: { title: "Privilégiez ces aliments ✅", items: ["Protéines maigres : poulet, poisson, thon, crevettes, bœuf maigre, œufs", "Légumes : brocoli, épinards, concombre, courgette, poivrons, aubergine, champignons", "Graisses saines : avocat, huile d'olive, noix, graines de chia et de lin", "Bons glucides : riz brun, quinoa, avoine, légumineuses, fruits frais", "Boissons : eau, thé vert, café noir (pendant la fenêtre de jeûne)"] },
    moderateFoods: { title: "À consommer avec modération ⚠️", items: ["Riz blanc, pain complet, pâtes de blé, couscous", "Fruits riches en sucre : banane mûre, mangue, pastèque, ananas", "Mayonnaise, sauce soja"] },
    avoidFoods: { title: "Évitez ces aliments ❌", items: ["Pain blanc, biscuits, pâtisseries, gâteaux, sucreries", "Sodas, jus sucrés, boissons énergisantes", "Aliments frits, viandes transformées (saucisses, charcuterie)", "Huiles hydrogénées, plats préparés au micro-ondes"] },
    portionTitle: "Guide des portions (Utilisez votre main !)",
    portions: [{ label: "Protéines", size: "Taille de la paume" }, { label: "Glucides", size: "Taille du poing" }, { label: "Graisses", size: "Taille du pouce" }, { label: "Légumes", size: "Un poing ou plus" }, { label: "Fruits", size: "Un poing ou moins" }],
    tipsTitle: "Conseils d'or pour le jeûne intermittent",
    tips: ["Buvez Unimate le matin pour stimuler la concentration et l'énergie pendant le jeûne", "Prenez Balance 10-15 minutes avant le dîner pour réduire l'impact des glucides", "Buvez 2-3 litres d'eau par jour (l'eau est permise pendant le jeûne)", "Faites de l'exercice 3-4 jours par semaine pendant au moins 30 minutes", "Dormez 7-8 heures par nuit pour améliorer le métabolisme"],
    disclaimer: "Ce sont des conseils de coaching généraux, pas des prescriptions médicales. Consultez votre médecin avant de commencer un nouveau régime.",
    ctaTitle: "Vous voulez un programme personnalisé ?",
    ctaDesc: "Contactez Feras maintenant pour un plan de jeûne et nutrition conçu spécifiquement pour vos objectifs de santé",
    ctaBtn: "Discuter sur WhatsApp",
    ctaQuiz: "Quiz Santé Gratuit",
    shareTitle: "Partagez votre programme avec vos amis",
    resetBtn: "Nouveau calcul",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "Enregistrer en image",
    savingImage: "Enregistrement...",
    leadCapture: { title: "Entrez vos coordonnées pour voir votre programme", subtitle: "Nous vous enverrons des conseils supplémentaires via WhatsApp", nameLabel: "Nom", namePlaceholder: "Votre nom", phoneLabel: "Numéro WhatsApp", phonePlaceholder: "+33 X XX XX XX XX", submitBtn: "Voir mon programme", skip: "Passer", privacy: "Vos données sont protégées et jamais partagées" },
    successStories: { title: "Résultats réels avec le jeûne intermittent", subtitle: "Histoires de réussite des membres du Programme de Santé Durable", viewAll: "Voir toutes les histoires" },
    countdown: { title: "Compte à rebours", fasting: "Jeûne", eating: "Repas", until: "Temps restant jusqu'à", hours: "heures", minutes: "min", seconds: "sec", currentlyFasting: "Vous êtes en période de jeûne", currentlyEating: "Vous êtes en période de repas" },
    reminders: { enable: "Activer les rappels", enabled: "Rappels activés", denied: "Notifications bloquées", unsupported: "Non supporté", description: "Recevez des rappels quotidiens pour vos heures de jeûne", reminderSet: "Vous serez rappelé quotidiennement", disableBtn: "Désactiver" },
  },
  es: {
    pageTitle: "Calculadora de Ayuno Intermitente 16:8",
    pageSubtitle: "Ingresa la hora de tu cena y obtén un horario de ayuno personalizado con pautas nutricionales del Programa de Salud Sostenible",
    inputLabel: "¿A qué hora cenas habitualmente?",
    inputPlaceholder: "Seleccionar hora",
    calculateBtn: "Calcular mi horario",
    yourScheduleTitle: "Tu Horario de Ayuno Personalizado",
    fastingWindow: "Ventana de ayuno",
    eatingWindow: "Ventana de alimentación",
    hours: "horas",
    scheduleItems: [
      { icon: "moon", label: "Inicio del ayuno (después de cenar)", timeLabel: "Inicio del ayuno" },
      { icon: "coffee", label: "Unimate + agua / té / café (sin azúcar)", timeLabel: "Mañana siguiente" },
      { icon: "utensils", label: "Almuerzo (romper el ayuno)", timeLabel: "Romper ayuno" },
      { icon: "apple", label: "Merienda saludable", timeLabel: "Merienda" },
      { icon: "salad", label: "Cena (Balance antes de la comida)", timeLabel: "Cena" },
    ],
    nutritionTitle: "Reglas nutricionales simples del Programa de Salud Sostenible",
    focusFoods: { title: "Enfócate en estos alimentos ✅", items: ["Proteína magra: pechuga de pollo, pescado, atún, camarones, carne magra, huevos", "Verduras: brócoli, espinacas, pepino, calabacín, pimientos, berenjena, champiñones", "Grasas saludables: aguacate, aceite de oliva, nueces, semillas de chía y lino", "Buenos carbohidratos: arroz integral, quinoa, avena, legumbres, frutas frescas", "Bebidas: agua, té verde, café negro (durante la ventana de ayuno)"] },
    moderateFoods: { title: "Consume con moderación ⚠️", items: ["Arroz blanco, pan integral, pasta de trigo, cuscús", "Frutas altas en azúcar: plátano maduro, mango, sandía, piña", "Mayonesa, salsa de soya"] },
    avoidFoods: { title: "Evita estos alimentos ❌", items: ["Pan blanco, galletas, pasteles, dulces", "Refrescos, jugos azucarados, bebidas energéticas", "Alimentos fritos, carnes procesadas (salchichas, embutidos)", "Aceites hidrogenados, comidas preparadas de microondas"] },
    portionTitle: "Guía de porciones (¡Usa tu mano!)",
    portions: [{ label: "Proteína", size: "Tamaño de la palma" }, { label: "Carbohidratos", size: "Tamaño del puño" }, { label: "Grasas", size: "Tamaño del pulgar" }, { label: "Verduras", size: "Un puño o más" }, { label: "Frutas", size: "Un puño o menos" }],
    tipsTitle: "Consejos de oro para el ayuno intermitente",
    tips: ["Bebe Unimate por la mañana para mejorar el enfoque y la energía durante el ayuno", "Toma Balance 10-15 minutos antes de cenar para reducir el impacto de los carbohidratos", "Bebe 2-3 litros de agua diarios (el agua está permitida durante el ayuno)", "Haz ejercicio 3-4 días por semana durante al menos 30 minutos", "Duerme 7-8 horas por noche para mejorar el metabolismo"],
    disclaimer: "Estas son pautas generales de coaching, no prescripciones médicas. Consulta a tu médico antes de comenzar cualquier dieta nueva.",
    ctaTitle: "¿Quieres un programa personalizado?",
    ctaDesc: "Contacta a Feras ahora para un plan de ayuno y nutrición diseñado específicamente para tus objetivos de salud",
    ctaBtn: "Chatear por WhatsApp",
    ctaQuiz: "Quiz de Salud Gratis",
    shareTitle: "Comparte tu horario con amigos",
    resetBtn: "Nuevo cálculo",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "Guardar como imagen",
    savingImage: "Guardando...",
    leadCapture: { title: "Ingresa tus datos para ver tu horario", subtitle: "Te enviaremos consejos adicionales por WhatsApp", nameLabel: "Nombre", namePlaceholder: "Tu nombre", phoneLabel: "Número de WhatsApp", phonePlaceholder: "+34 XXX XXX XXX", submitBtn: "Ver mi horario", skip: "Omitir", privacy: "Tus datos están protegidos y nunca se comparten" },
    successStories: { title: "Resultados reales con el ayuno intermitente", subtitle: "Historias de éxito de miembros del Programa de Salud Sostenible", viewAll: "Ver todas las historias" },
    countdown: { title: "Cuenta regresiva", fasting: "Ayuno", eating: "Comida", until: "Tiempo restante hasta", hours: "horas", minutes: "min", seconds: "seg", currentlyFasting: "Estás en período de ayuno", currentlyEating: "Estás en tu ventana de comida" },
    reminders: { enable: "Activar recordatorios", enabled: "Recordatorios activados", denied: "Notificaciones bloqueadas", unsupported: "No soportado", description: "Recibe recordatorios diarios de tus horarios de ayuno", reminderSet: "Se te recordará diariamente", disableBtn: "Desactivar" },
  },
  de: {
    pageTitle: "16:8 Intervallfasten Zeitplan-Rechner",
    pageSubtitle: "Geben Sie Ihre Abendessenszeit ein und erhalten Sie einen personalisierten Fastenplan mit Ernährungsrichtlinien aus dem Nachhaltigen Gesundheitsprogramm",
    inputLabel: "Wann essen Sie normalerweise zu Abend?",
    inputPlaceholder: "Zeit auswählen",
    calculateBtn: "Meinen Zeitplan berechnen",
    yourScheduleTitle: "Ihr persönlicher Fastenplan",
    fastingWindow: "Fastenfenster",
    eatingWindow: "Essensfenster",
    hours: "Stunden",
    scheduleItems: [
      { icon: "moon", label: "Fastenbeginn (nach dem Abendessen)", timeLabel: "Fastenbeginn" },
      { icon: "coffee", label: "Unimate + Wasser / Tee / Kaffee (ohne Zucker)", timeLabel: "Nächster Morgen" },
      { icon: "utensils", label: "Mittagessen (Fasten brechen)", timeLabel: "Fasten brechen" },
      { icon: "apple", label: "Gesunder Snack", timeLabel: "Snack" },
      { icon: "salad", label: "Abendessen (Balance vor der Mahlzeit)", timeLabel: "Abendessen" },
    ],
    nutritionTitle: "Einfache Ernährungsregeln aus dem Nachhaltigen Gesundheitsprogramm",
    focusFoods: { title: "Konzentrieren Sie sich auf diese Lebensmittel ✅", items: ["Mageres Protein: Hähnchenbrust, Fisch, Thunfisch, Garnelen, mageres Rindfleisch, Eier", "Gemüse: Brokkoli, Spinat, Gurke, Zucchini, Paprika, Aubergine, Pilze, Salat", "Gesunde Fette: Avocado, Olivenöl, Nüsse, Chia- und Leinsamen", "Gute Kohlenhydrate: Naturreis, Quinoa, Haferflocken, Hülsenfrüchte, frisches Obst", "Getränke: Wasser, grüner Tee, schwarzer Kaffee (während des Fastenfensters)"] },
    moderateFoods: { title: "In Maßen genießen ⚠️", items: ["Weißer Reis, Vollkornbrot, Weizennudeln, Couscous", "Zuckerreiches Obst: reife Banane, Mango, Wassermelone, Ananas", "Mayonnaise, Sojasoße"] },
    avoidFoods: { title: "Diese Lebensmittel vermeiden ❌", items: ["Weißbrot, Kekse, Gebäck, Kuchen, Süßigkeiten", "Limonade, gesüßte Säfte, Energy-Drinks", "Frittierte Speisen, verarbeitetes Fleisch (Würstchen, Wurst)", "Gehärtete Öle, Fertiggerichte aus der Mikrowelle"] },
    portionTitle: "Portionsguide (Nutzen Sie Ihre Hand!)",
    portions: [{ label: "Protein", size: "Handflächengröße" }, { label: "Kohlenhydrate", size: "Faustgröße" }, { label: "Fette", size: "Daumengröße" }, { label: "Gemüse", size: "Eine Faust oder mehr" }, { label: "Obst", size: "Eine Faust oder weniger" }],
    tipsTitle: "Goldene Tipps für Intervallfasten",
    tips: ["Trinken Sie Unimate morgens für bessere Konzentration und Energie während des Fastens", "Nehmen Sie Balance 10-15 Minuten vor dem Abendessen ein, um die Kohlenhydratwirkung zu reduzieren", "Trinken Sie täglich 2-3 Liter Wasser (Wasser ist während des Fastens erlaubt)", "Trainieren Sie 3-4 Tage pro Woche mindestens 30 Minuten", "Schlafen Sie 7-8 Stunden pro Nacht für besseren Stoffwechsel"],
    disclaimer: "Dies sind allgemeine Coaching-Richtlinien, keine medizinischen Verschreibungen. Konsultieren Sie Ihren Arzt, bevor Sie eine neue Diät beginnen.",
    ctaTitle: "Möchten Sie ein personalisiertes Programm?",
    ctaDesc: "Kontaktieren Sie Feras jetzt für einen Fasten- und Ernährungsplan, der speziell auf Ihre Gesundheitsziele zugeschnitten ist",
    ctaBtn: "Auf WhatsApp chatten",
    ctaQuiz: "Kostenloser Gesundheitsquiz",
    shareTitle: "Teilen Sie Ihren Zeitplan mit Freunden",
    resetBtn: "Neue Berechnung",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "Als Bild speichern",
    savingImage: "Wird gespeichert...",
    leadCapture: { title: "Geben Sie Ihre Daten ein, um Ihren Zeitplan zu sehen", subtitle: "Wir senden Ihnen zusätzliche Tipps über WhatsApp", nameLabel: "Name", namePlaceholder: "Ihr Name", phoneLabel: "WhatsApp-Nummer", phonePlaceholder: "+49 XXX XXXXXXX", submitBtn: "Meinen Zeitplan anzeigen", skip: "Überspringen", privacy: "Ihre Daten sind geschützt und werden nie weitergegeben" },
    successStories: { title: "Echte Ergebnisse mit Intervallfasten", subtitle: "Erfolgsgeschichten von Mitgliedern des Nachhaltigen Gesundheitsprogramms", viewAll: "Alle Geschichten ansehen" },
    countdown: { title: "Countdown", fasting: "Fasten", eating: "Essen", until: "Verbleibende Zeit bis", hours: "Std", minutes: "Min", seconds: "Sek", currentlyFasting: "Sie fasten gerade", currentlyEating: "Sie sind in Ihrer Essensphase" },
    reminders: { enable: "Erinnerungen aktivieren", enabled: "Erinnerungen aktiv", denied: "Benachrichtigungen blockiert", unsupported: "Nicht unterstützt", description: "Tägliche Erinnerungen an Ihre Fastenzeiten", reminderSet: "Sie werden täglich erinnert", disableBtn: "Deaktivieren" },
  },
  tr: {
    pageTitle: "16:8 Aralıklı Oruç Programı Hesaplayıcı",
    pageSubtitle: "Akşam yemeği saatinizi girin ve Sürdürülebilir Sağlık Programı'ndan beslenme rehberiyle kişiselleştirilmiş oruç programınızı alın",
    inputLabel: "Genellikle saat kaçta akşam yemeği yersiniz?",
    inputPlaceholder: "Saat seçin",
    calculateBtn: "Programımı Hesapla",
    yourScheduleTitle: "Kişiselleştirilmiş Oruç Programınız",
    fastingWindow: "Oruç penceresi",
    eatingWindow: "Yeme penceresi",
    hours: "saat",
    scheduleItems: [
      { icon: "moon", label: "Oruç başlangıcı (akşam yemeğinden sonra)", timeLabel: "Oruç başlangıcı" },
      { icon: "coffee", label: "Unimate + su / çay / kahve (şekersiz)", timeLabel: "Ertesi sabah" },
      { icon: "utensils", label: "Öğle yemeği (orucu boz)", timeLabel: "Orucu boz" },
      { icon: "apple", label: "Sağlıklı atıştırmalık", timeLabel: "Atıştırmalık" },
      { icon: "salad", label: "Akşam yemeği (yemekten önce Balance)", timeLabel: "Akşam yemeği" },
    ],
    nutritionTitle: "Sürdürülebilir Sağlık Programı'ndan Basit Beslenme Kuralları",
    focusFoods: { title: "Bu gıdalara odaklanın ✅", items: ["Yağsız protein: tavuk göğsü, balık, ton balığı, karides, yağsız sığır eti, yumurta", "Sebzeler: brokoli, ıspanak, salatalık, kabak, biber, patlıcan, mantar, marul", "Sağlıklı yağlar: avokado, zeytinyağı, kuruyemişler, chia ve keten tohumları", "İyi karbonhidratlar: esmer pirinç, kinoa, yulaf, baklagiller, taze meyveler", "İçecekler: su, yeşil çay, sade kahve (oruç penceresi boyunca)"] },
    moderateFoods: { title: "Ölçülü tüketin ⚠️", items: ["Beyaz pirinç, tam buğday ekmeği, buğday makarnası, kuskus", "Şeker oranı yüksek meyveler: olgun muz, mango, karpuz, ananas", "Mayonez, soya sosu"] },
    avoidFoods: { title: "Bu gıdalardan kaçının ❌", items: ["Beyaz ekmek, bisküvi, hamur işleri, pasta, tatlılar", "Gazlı içecekler, şekerli meyve suları, enerji içecekleri", "Kızartmalar, işlenmiş etler (sosis, sucuk)", "Hidrojenize yağlar, hazır mikrodalga yemekleri"] },
    portionTitle: "Porsiyon Rehberi (Elinizi Kullanın!)",
    portions: [{ label: "Protein", size: "Avuç içi boyutu" }, { label: "Karbonhidrat", size: "Yumruk boyutu" }, { label: "Yağlar", size: "Başparmak boyutu" }, { label: "Sebzeler", size: "Bir yumruk veya daha fazla" }, { label: "Meyveler", size: "Bir yumruk veya daha az" }],
    tipsTitle: "Aralıklı Oruç İçin Altın İpuçları",
    tips: ["Oruç sırasında odaklanma ve enerji için sabahları Unimate için", "Karbonhidrat etkisini azaltmak için akşam yemeğinden 10-15 dakika önce Balance alın", "Günde 2-3 litre su için (oruç sırasında su serbesttir)", "Haftada 3-4 gün en az 30 dakika egzersiz yapın", "Metabolizmayı iyileştirmek için gecelik 7-8 saat uyuyun"],
    disclaimer: "Bunlar genel koçluk rehberleridir, tıbbi reçete değildir. Yeni bir diyete başlamadan önce doktorunuza danışın.",
    ctaTitle: "Kişiselleştirilmiş bir program ister misiniz?",
    ctaDesc: "Sağlık hedeflerinize özel tasarlanmış bir oruç ve beslenme planı için şimdi Feras ile iletişime geçin",
    ctaBtn: "WhatsApp'tan Yazın",
    ctaQuiz: "Ücretsiz Sağlık Testi",
    shareTitle: "Programınızı arkadaşlarınızla paylaşın",
    resetBtn: "Yeni Hesaplama",
    methodBadge: "Feras Alayed Method™",
    saveAsImage: "Resim olarak kaydet",
    savingImage: "Kaydediliyor...",
    leadCapture: { title: "Programınızı görmek için bilgilerinizi girin", subtitle: "WhatsApp üzerinden ek ipuçları göndereceğiz", nameLabel: "İsim", namePlaceholder: "Adınız", phoneLabel: "WhatsApp numarası", phonePlaceholder: "+90 XXX XXX XX XX", submitBtn: "Programımı Göster", skip: "Atla", privacy: "Verileriniz korunur ve asla paylaşılmaz" },
    successStories: { title: "Aralıklı Oruç ile Gerçek Sonuçlar", subtitle: "Sürdürülebilir Sağlık Programı üyelerinden başarı hikayeleri", viewAll: "Tüm hikayeleri gör" },
    countdown: { title: "Geri Sayım", fasting: "Oruç", eating: "Yemek", until: "Kalan süre", hours: "saat", minutes: "dk", seconds: "sn", currentlyFasting: "Şu anda oruç tutuyorsunuz", currentlyEating: "Yemek pencerenizdesiniz" },
    reminders: { enable: "Hatırlatıcıları Etkinleştir", enabled: "Hatırlatıcılar Etkin", denied: "Bildirimler Engellendi", unsupported: "Desteklenmiyor", description: "Oruç saatleriniz için günlük hatırlatmalar alın", reminderSet: "Günlük olarak hatırlatılacaksınız", disableBtn: "Devre Dışı Bırak" },
  },
};

// ============ Time Utility Functions ============
function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h * 60 + m + hours * 60) % (24 * 60);
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

function formatTime12(time24: string, lang: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const suffix = lang === "ar"
    ? (ampm ? "م" : "ص")
    : (ampm ? "PM" : "AM");
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "moon": return Moon;
    case "coffee": return Coffee;
    case "utensils": return Utensils;
    case "apple": return Apple;
    case "salad": return Salad;
    default: return Clock;
  }
}

// ============ Helper: Convert base64url to Uint8Array for VAPID ============
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ============ Success Stories Data (weight-loss before-after) ============
const FASTING_STORIES = PARTNER_STORIES
  .filter(s => s.type === "before-after" && s.category === "weight-loss")
  .sort((a, b) => b.sortOrder - a.sortOrder)
  .slice(0, 8);

// ============ Main Component ============
export default function FastingCalculator() {
  const { lang } = useLanguage();
  const t = i18n[lang] || i18n.en;
  const isRtl = lang === "ar";

  const [dinnerTime, setDinnerTime] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [savingImage, setSavingImage] = useState(false);
  const [countdownState, setCountdownState] = useState<{ isFasting: boolean; hoursLeft: number; minutesLeft: number; secondsLeft: number; nextEvent: string } | null>(null);
  const [reminderState, setReminderState] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const scheduleRef = useRef<HTMLDivElement>(null);

  const registerLead = trpc.leads.register.useMutation();
  const subscribeMutation = trpc.push.subscribe.useMutation();

  // Calculate schedule based on dinner time
  const schedule = useMemo(() => {
    if (!dinnerTime) return null;
    const fastingStart = dinnerTime;
    const eatingStart = addHours(fastingStart, 16);
    const eatingEnd = addHours(eatingStart, 8);
    const unimateTime = addHours(fastingStart, 11);
    const snackTime = addHours(eatingStart, 4);

    return {
      fastingStart,
      eatingStart,
      unimateTime,
      snackTime,
      eatingEnd,
      times: [fastingStart, unimateTime, eatingStart, snackTime, eatingEnd],
    };
  }, [dinnerTime]);

  // ============ Live Countdown Timer ============
  const computeCountdown = useCallback(() => {
    if (!schedule) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const [fastH, fastM] = schedule.fastingStart.split(":").map(Number);
    const [eatH, eatM] = schedule.eatingStart.split(":").map(Number);
    const fastingStartMin = fastH * 60 + fastM;
    const eatingStartMin = eatH * 60 + eatM;

    // Determine if currently fasting or eating
    let isFasting: boolean;
    let targetMin: number;
    let nextEvent: string;

    if (eatingStartMin > fastingStartMin) {
      // Eating window is same day after fasting start (e.g. fasting 20:00 -> eating 12:00 next day)
      // Actually if dinner is at 20:00, fasting starts at 20:00, eating starts at 12:00 next day
      // So fasting: 20:00 -> 12:00, eating: 12:00 -> 20:00
      if (currentMinutes >= fastingStartMin || currentMinutes < eatingStartMin) {
        isFasting = true;
        targetMin = eatingStartMin;
        nextEvent = t.countdown.eating;
      } else {
        isFasting = false;
        targetMin = fastingStartMin;
        nextEvent = t.countdown.fasting;
      }
    } else {
      // Eating window wraps around midnight
      if (currentMinutes >= eatingStartMin && currentMinutes < fastingStartMin) {
        isFasting = false;
        targetMin = fastingStartMin;
        nextEvent = t.countdown.fasting;
      } else {
        isFasting = true;
        targetMin = eatingStartMin;
        nextEvent = t.countdown.eating;
      }
    }

    // Calculate time difference
    let diffMinutes = targetMin - currentMinutes;
    if (diffMinutes <= 0) diffMinutes += 24 * 60;
    let totalSeconds = diffMinutes * 60 - currentSeconds;
    if (totalSeconds < 0) totalSeconds += 24 * 60 * 60;

    const hoursLeft = Math.floor(totalSeconds / 3600);
    const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
    const secondsLeft = totalSeconds % 60;

    return { isFasting, hoursLeft, minutesLeft, secondsLeft, nextEvent };
  }, [schedule, t.countdown.eating, t.countdown.fasting]);

  useEffect(() => {
    if (!showResults || !schedule) return;
    const update = () => setCountdownState(computeCountdown());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [showResults, schedule, computeCountdown]);

  // ============ Notification Permission Check ============
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setReminderState("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setReminderState(sub ? "granted" : "default");
        });
      });
    } else if (Notification.permission === "denied") {
      setReminderState("denied");
    }
  }, []);

  const handleEnableReminders = async () => {
    if (reminderState !== "default") return;
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setReminderState("denied");
        return;
      }
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        toast.error("Push configuration error");
        return;
      }
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as ArrayBuffer,
      });
      const subJson = subscription.toJSON();
      await subscribeMutation.mutateAsync({
        endpoint: subJson.endpoint!,
        p256dh: subJson.keys!.p256dh!,
        auth: subJson.keys!.auth!,
        language: lang,
      });
      // Send fasting schedule to the service worker for periodic reminders
      if (schedule) {
        localStorage.setItem("fasting_schedule", JSON.stringify({
          fastingStart: schedule.fastingStart,
          eatingStart: schedule.eatingStart,
          eatingEnd: schedule.eatingEnd,
        }));
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: "SET_FASTING_SCHEDULE",
          schedule: {
            fastingStart: schedule.fastingStart,
            eatingStart: schedule.eatingStart,
            eatingEnd: schedule.eatingEnd,
          },
        });
        // Try to register periodic sync (Chrome 80+)
        if ("periodicSync" in reg) {
          try {
            await (reg as any).periodicSync.register("fasting-reminder-check", {
              minInterval: 60 * 60 * 1000, // 1 hour
            });
          } catch { /* Periodic sync not granted */ }
        }
      }
      setReminderState("granted");
      toast.success(t.reminders.reminderSet);
    } catch (error) {
      console.error("[Fasting Reminder] Error:", error);
      toast.error(lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again.");
    }
  };

  const handleCalculate = () => {
    if (!dinnerTime) return;
    // Show lead capture form if not already submitted
    if (!leadSubmitted) {
      setShowLeadForm(true);
    } else {
      setShowResults(true);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone) return;
    try {
      await registerLead.mutateAsync({
        fullName: leadName || "Fasting Calculator User",
        phone: leadPhone,
        source: "fasting-calculator",
        language: lang,
      });
      setLeadSubmitted(true);
      setShowLeadForm(false);
      setShowResults(true);
      toast.success(lang === "ar" ? "تم حفظ بياناتك بنجاح!" : "Your details have been saved!");
    } catch {
      toast.error(lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again.");
    }
  };

  const handleSkipLead = () => {
    setLeadSubmitted(true);
    setShowLeadForm(false);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setDinnerTime("");
  };

  const handleSaveAsImage = async () => {
    if (!scheduleRef.current) return;
    setSavingImage(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(scheduleRef.current, {
        backgroundColor: "#0a1628",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `fasting-schedule-16-8.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success(lang === "ar" ? "تم حفظ الصورة!" : "Image saved!");
    } catch {
      toast.error(lang === "ar" ? "فشل حفظ الصورة" : "Failed to save image");
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0a1628] text-white ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2035] to-[#0a1628]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 mb-6">
            <span className="text-amber-400 text-sm font-medium">{t.methodBadge}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {t.pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {t.pageSubtitle}
          </p>
        </div>
      </section>

      {/* Calculator Input Section */}
      {!showResults && !showLeadForm && (
        <section className="py-12 md:py-16">
          <div className="container max-w-lg mx-auto px-4">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <label className="block text-lg font-semibold text-white mb-4 text-center">
                {t.inputLabel}
              </label>
              <input
                type="time"
                value={dinnerTime}
                onChange={(e) => setDinnerTime(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-slate-900/80 border border-slate-600 text-white text-center text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
              <button
                onClick={handleCalculate}
                disabled={!dinnerTime}
                className="w-full mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg transition-all hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
              >
                {t.calculateBtn}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture Form */}
      {showLeadForm && !showResults && (
        <section className="py-12 md:py-16">
          <div className="container max-w-lg mx-auto px-4">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">{t.leadCapture.title}</h2>
              <p className="text-white/60 text-sm text-center mb-6">{t.leadCapture.subtitle}</p>
              
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-1.5 block">{t.leadCapture.nameLabel}</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder={t.leadCapture.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-1.5 block">{t.leadCapture.phoneLabel} *</label>
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder={t.leadCapture.phonePlaceholder}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    dir="ltr"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!leadPhone || registerLead.isPending}
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg transition-all hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                >
                  {registerLead.isPending ? "..." : t.leadCapture.submitBtn}
                </button>
                <button
                  type="button"
                  onClick={handleSkipLead}
                  className="w-full text-center text-white/40 hover:text-white/70 text-sm py-2 transition-colors"
                >
                  {t.leadCapture.skip}
                </button>
                <p className="text-white/30 text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3 h-3" />
                  {t.leadCapture.privacy}
                </p>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && schedule && (
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl mx-auto px-4 space-y-8">
            {/* Schedule Card (capturable for PNG) */}
            <div ref={scheduleRef} className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">{t.yourScheduleTitle}</h2>
              
              {/* Fasting/Eating Windows Summary */}
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-xl p-4 text-center">
                  <Moon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <p className="text-sm text-indigo-300">{t.fastingWindow}</p>
                  <p className="text-2xl font-bold text-white">16 {t.hours}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {formatTime12(schedule.fastingStart, lang)} → {formatTime12(schedule.eatingStart, lang)}
                  </p>
                </div>
                <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <Sun className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300">{t.eatingWindow}</p>
                  <p className="text-2xl font-bold text-white">8 {t.hours}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {formatTime12(schedule.eatingStart, lang)} → {formatTime12(schedule.eatingEnd, lang)}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0 relative">
                <div className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-amber-500 to-emerald-500`} />
                {t.scheduleItems.map((item, idx) => {
                  const IconComp = getIconComponent(item.icon);
                  const time = schedule.times[idx];
                  const isEating = idx >= 2;
                  return (
                    <div key={idx} className="flex items-center gap-4 py-4 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${
                        isEating ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-indigo-500/20 border border-indigo-500/40'
                      }`}>
                        <IconComp className={`w-5 h-5 ${isEating ? 'text-emerald-400' : 'text-indigo-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm md:text-base">{item.label}</p>
                        <p className="text-white/50 text-xs">{item.timeLabel}</p>
                      </div>
                      <div className="text-amber-400 font-mono font-bold text-lg shrink-0">
                        {formatTime12(time, lang)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Branding footer for the image */}
              <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-amber-400/60 text-xs font-medium">Feras Alayed Method™</span>
                <span className="text-white/30 text-xs">feelgreat.us.com/fasting-calculator</span>
              </div>
            </div>

            {/* Save as Image Button */}
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={handleSaveAsImage}
                disabled={savingImage}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium transition-all active:scale-[0.97] disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {savingImage ? t.savingImage : t.saveAsImage}
              </button>
            </div>

            {/* Live Countdown Timer */}
            {countdownState && (
              <div className={`rounded-2xl p-6 md:p-8 border backdrop-blur-sm shadow-2xl ${
                countdownState.isFasting
                  ? 'bg-indigo-900/30 border-indigo-500/30'
                  : 'bg-emerald-900/30 border-emerald-500/30'
              }`}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Timer className={`w-6 h-6 ${countdownState.isFasting ? 'text-indigo-400' : 'text-emerald-400'}`} />
                  <h2 className="text-xl md:text-2xl font-bold">{t.countdown.title}</h2>
                </div>
                <p className={`text-center text-sm mb-4 ${countdownState.isFasting ? 'text-indigo-300' : 'text-emerald-300'}`}>
                  {countdownState.isFasting ? t.countdown.currentlyFasting : t.countdown.currentlyEating}
                </p>
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <div className="text-center">
                    <div className={`text-4xl md:text-5xl font-mono font-bold ${countdownState.isFasting ? 'text-indigo-300' : 'text-emerald-300'}`}>
                      {String(countdownState.hoursLeft).padStart(2, '0')}
                    </div>
                    <p className="text-white/50 text-xs mt-1">{t.countdown.hours}</p>
                  </div>
                  <span className="text-white/30 text-3xl font-light">:</span>
                  <div className="text-center">
                    <div className={`text-4xl md:text-5xl font-mono font-bold ${countdownState.isFasting ? 'text-indigo-300' : 'text-emerald-300'}`}>
                      {String(countdownState.minutesLeft).padStart(2, '0')}
                    </div>
                    <p className="text-white/50 text-xs mt-1">{t.countdown.minutes}</p>
                  </div>
                  <span className="text-white/30 text-3xl font-light">:</span>
                  <div className="text-center">
                    <div className={`text-4xl md:text-5xl font-mono font-bold ${countdownState.isFasting ? 'text-indigo-300' : 'text-emerald-300'}`}>
                      {String(countdownState.secondsLeft).padStart(2, '0')}
                    </div>
                    <p className="text-white/50 text-xs mt-1">{t.countdown.seconds}</p>
                  </div>
                </div>
                <p className="text-center text-white/60 text-sm mt-4">
                  {t.countdown.until} <span className="font-semibold text-white">{countdownState.nextEvent}</span>
                </p>
              </div>
            )}

            {/* Fasting Reminder Notification */}
            {reminderState !== "unsupported" && (
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1 text-center sm:text-start">
                  <p className="text-white font-medium">{reminderState === "granted" ? t.reminders.enabled : t.reminders.enable}</p>
                  <p className="text-white/50 text-sm">{reminderState === "granted" ? t.reminders.reminderSet : t.reminders.description}</p>
                </div>
                {reminderState === "default" && (
                  <button
                    onClick={handleEnableReminders}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all active:scale-[0.97] whitespace-nowrap"
                  >
                    {t.reminders.enable}
                  </button>
                )}
                {reminderState === "granted" && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{t.reminders.enabled}</span>
                  </div>
                )}
                {reminderState === "denied" && (
                  <span className="text-red-400 text-sm">{t.reminders.denied}</span>
                )}
              </div>
            )}

            {/* Nutrition Guidelines */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <Salad className="w-6 h-6 text-emerald-400" />
                {t.nutritionTitle}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
                  <h3 className="font-bold text-emerald-400 mb-3 text-sm">{t.focusFoods.title}</h3>
                  <ul className="space-y-2">
                    {t.focusFoods.items.map((item, i) => (
                      <li key={i} className="text-white/70 text-xs leading-relaxed flex gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl p-4">
                  <h3 className="font-bold text-amber-400 mb-3 text-sm">{t.moderateFoods.title}</h3>
                  <ul className="space-y-2">
                    {t.moderateFoods.items.map((item, i) => (
                      <li key={i} className="text-white/70 text-xs leading-relaxed flex gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
                  <h3 className="font-bold text-red-400 mb-3 text-sm">{t.avoidFoods.title}</h3>
                  <ul className="space-y-2">
                    {t.avoidFoods.items.map((item, i) => (
                      <li key={i} className="text-white/70 text-xs leading-relaxed flex gap-2">
                        <span className="text-red-400 shrink-0">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Portion Guide */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-2xl">🤚</span>
                {t.portionTitle}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {t.portions.map((p, i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-600/30 rounded-xl p-3 text-center">
                    <p className="text-amber-400 font-bold text-sm mb-1">{p.label}</p>
                    <p className="text-white/70 text-xs">{p.size}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Golden Tips */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <Droplets className="w-6 h-6 text-amber-400" />
                {t.tipsTitle}
              </h2>
              <div className="space-y-3">
                {t.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-900/40 rounded-lg p-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-white/80 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories Section */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-3 mb-2">
                  <Star className="w-6 h-6 text-amber-400" />
                  {t.successStories.title}
                </h2>
                <p className="text-white/60 text-sm">{t.successStories.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FASTING_STORIES.map((story) => (
                  <div key={story.id} className="relative group rounded-xl overflow-hidden border border-slate-600/30 hover:border-amber-500/40 transition-all">
                    <img
                      src={story.thumbnailUrl}
                      alt={lang === "ar" ? story.altAr : story.altEn}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link href="/success-stories" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                  {t.successStories.viewAll}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs leading-relaxed">{t.disclaimer}</p>
            </div>

            {/* Share Section */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold mb-4 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                {t.shareTitle}
              </h3>
              <ShareButtons
                url="/fasting-calculator"
                title={t.pageTitle}
                description={t.pageSubtitle}
                lang={lang}
              />
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{t.ctaTitle}</h2>
              <p className="text-white/70 mb-6">{t.ctaDesc}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/96877020770?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%B5%D9%8A%D8%A7%D9%85%20%D9%85%D8%AE%D8%B5%D8%B5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all active:scale-[0.97]"
                >
                  <Phone className="w-5 h-5" />
                  {t.ctaBtn}
                </a>
                <Link
                  href="/health-assessment"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t.ctaQuiz}
                </Link>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white/70 hover:text-white transition-all text-sm"
              >
                {t.resetBtn}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
}
