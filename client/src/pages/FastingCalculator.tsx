import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Clock, Utensils, Moon, Sun, Coffee, Apple, Salad, AlertTriangle, CheckCircle, ArrowRight, Phone, Share2, Droplets } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

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
    focusFoods: {
      title: "Privilégiez ces aliments ✅",
      items: [
        "Protéines maigres : poulet, poisson, thon, crevettes, bœuf maigre, œufs",
        "Légumes : brocoli, épinards, concombre, courgette, poivrons, aubergine, champignons",
        "Graisses saines : avocat, huile d'olive, noix, graines de chia et de lin",
        "Bons glucides : riz brun, quinoa, avoine, légumineuses, fruits frais",
        "Boissons : eau, thé vert, café noir (pendant la fenêtre de jeûne)",
      ],
    },
    moderateFoods: {
      title: "À consommer avec modération ⚠️",
      items: [
        "Riz blanc, pain complet, pâtes de blé, couscous",
        "Fruits riches en sucre : banane mûre, mangue, pastèque, ananas",
        "Mayonnaise, sauce soja",
      ],
    },
    avoidFoods: {
      title: "Évitez ces aliments ❌",
      items: [
        "Pain blanc, biscuits, pâtisseries, gâteaux, sucreries",
        "Sodas, jus sucrés, boissons énergisantes",
        "Aliments frits, viandes transformées (saucisses, charcuterie)",
        "Huiles hydrogénées, plats préparés au micro-ondes",
      ],
    },
    portionTitle: "Guide des portions (Utilisez votre main !)",
    portions: [
      { label: "Protéines", size: "Taille de la paume" },
      { label: "Glucides", size: "Taille du poing" },
      { label: "Graisses", size: "Taille du pouce" },
      { label: "Légumes", size: "Un poing ou plus" },
      { label: "Fruits", size: "Un poing ou moins" },
    ],
    tipsTitle: "Conseils d'or pour le jeûne intermittent",
    tips: [
      "Buvez Unimate le matin pour stimuler la concentration et l'énergie pendant le jeûne",
      "Prenez Balance 10-15 minutes avant le dîner pour réduire l'impact des glucides",
      "Buvez 2-3 litres d'eau par jour (l'eau est permise pendant le jeûne)",
      "Faites de l'exercice 3-4 jours par semaine pendant au moins 30 minutes",
      "Dormez 7-8 heures par nuit pour améliorer le métabolisme",
    ],
    disclaimer: "Ce sont des conseils de coaching généraux, pas des prescriptions médicales. Consultez votre médecin avant de commencer un nouveau régime.",
    ctaTitle: "Vous voulez un programme personnalisé ?",
    ctaDesc: "Contactez Feras maintenant pour un plan de jeûne et nutrition conçu spécifiquement pour vos objectifs de santé",
    ctaBtn: "Discuter sur WhatsApp",
    ctaQuiz: "Quiz Santé Gratuit",
    shareTitle: "Partagez votre programme avec vos amis",
    resetBtn: "Nouveau calcul",
    methodBadge: "Feras Alayed Method™",
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
    focusFoods: {
      title: "Enfócate en estos alimentos ✅",
      items: [
        "Proteína magra: pechuga de pollo, pescado, atún, camarones, carne magra, huevos",
        "Verduras: brócoli, espinacas, pepino, calabacín, pimientos, berenjena, champiñones",
        "Grasas saludables: aguacate, aceite de oliva, nueces, semillas de chía y lino",
        "Buenos carbohidratos: arroz integral, quinoa, avena, legumbres, frutas frescas",
        "Bebidas: agua, té verde, café negro (durante la ventana de ayuno)",
      ],
    },
    moderateFoods: {
      title: "Consume con moderación ⚠️",
      items: [
        "Arroz blanco, pan integral, pasta de trigo, cuscús",
        "Frutas altas en azúcar: plátano maduro, mango, sandía, piña",
        "Mayonesa, salsa de soya",
      ],
    },
    avoidFoods: {
      title: "Evita estos alimentos ❌",
      items: [
        "Pan blanco, galletas, pasteles, dulces",
        "Refrescos, jugos azucarados, bebidas energéticas",
        "Alimentos fritos, carnes procesadas (salchichas, embutidos)",
        "Aceites hidrogenados, comidas preparadas de microondas",
      ],
    },
    portionTitle: "Guía de porciones (¡Usa tu mano!)",
    portions: [
      { label: "Proteína", size: "Tamaño de la palma" },
      { label: "Carbohidratos", size: "Tamaño del puño" },
      { label: "Grasas", size: "Tamaño del pulgar" },
      { label: "Verduras", size: "Un puño o más" },
      { label: "Frutas", size: "Un puño o menos" },
    ],
    tipsTitle: "Consejos de oro para el ayuno intermitente",
    tips: [
      "Bebe Unimate por la mañana para mejorar el enfoque y la energía durante el ayuno",
      "Toma Balance 10-15 minutos antes de cenar para reducir el impacto de los carbohidratos",
      "Bebe 2-3 litros de agua diarios (el agua está permitida durante el ayuno)",
      "Haz ejercicio 3-4 días por semana durante al menos 30 minutos",
      "Duerme 7-8 horas por noche para mejorar el metabolismo",
    ],
    disclaimer: "Estas son pautas generales de coaching, no prescripciones médicas. Consulta a tu médico antes de comenzar cualquier dieta nueva.",
    ctaTitle: "¿Quieres un programa personalizado?",
    ctaDesc: "Contacta a Feras ahora para un plan de ayuno y nutrición diseñado específicamente para tus objetivos de salud",
    ctaBtn: "Chatear por WhatsApp",
    ctaQuiz: "Quiz de Salud Gratis",
    shareTitle: "Comparte tu horario con amigos",
    resetBtn: "Nuevo cálculo",
    methodBadge: "Feras Alayed Method™",
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
    focusFoods: {
      title: "Konzentrieren Sie sich auf diese Lebensmittel ✅",
      items: [
        "Mageres Protein: Hähnchenbrust, Fisch, Thunfisch, Garnelen, mageres Rindfleisch, Eier",
        "Gemüse: Brokkoli, Spinat, Gurke, Zucchini, Paprika, Aubergine, Pilze, Salat",
        "Gesunde Fette: Avocado, Olivenöl, Nüsse, Chia- und Leinsamen",
        "Gute Kohlenhydrate: Naturreis, Quinoa, Haferflocken, Hülsenfrüchte, frisches Obst",
        "Getränke: Wasser, grüner Tee, schwarzer Kaffee (während des Fastenfensters)",
      ],
    },
    moderateFoods: {
      title: "In Maßen genießen ⚠️",
      items: [
        "Weißer Reis, Vollkornbrot, Weizennudeln, Couscous",
        "Zuckerreiches Obst: reife Banane, Mango, Wassermelone, Ananas",
        "Mayonnaise, Sojasoße",
      ],
    },
    avoidFoods: {
      title: "Diese Lebensmittel vermeiden ❌",
      items: [
        "Weißbrot, Kekse, Gebäck, Kuchen, Süßigkeiten",
        "Limonade, gesüßte Säfte, Energy-Drinks",
        "Frittierte Speisen, verarbeitetes Fleisch (Würstchen, Wurst)",
        "Gehärtete Öle, Fertiggerichte aus der Mikrowelle",
      ],
    },
    portionTitle: "Portionsguide (Nutzen Sie Ihre Hand!)",
    portions: [
      { label: "Protein", size: "Handflächengröße" },
      { label: "Kohlenhydrate", size: "Faustgröße" },
      { label: "Fette", size: "Daumengröße" },
      { label: "Gemüse", size: "Eine Faust oder mehr" },
      { label: "Obst", size: "Eine Faust oder weniger" },
    ],
    tipsTitle: "Goldene Tipps für Intervallfasten",
    tips: [
      "Trinken Sie Unimate morgens für bessere Konzentration und Energie während des Fastens",
      "Nehmen Sie Balance 10-15 Minuten vor dem Abendessen ein, um die Kohlenhydratwirkung zu reduzieren",
      "Trinken Sie täglich 2-3 Liter Wasser (Wasser ist während des Fastens erlaubt)",
      "Trainieren Sie 3-4 Tage pro Woche mindestens 30 Minuten",
      "Schlafen Sie 7-8 Stunden pro Nacht für besseren Stoffwechsel",
    ],
    disclaimer: "Dies sind allgemeine Coaching-Richtlinien, keine medizinischen Verschreibungen. Konsultieren Sie Ihren Arzt, bevor Sie eine neue Diät beginnen.",
    ctaTitle: "Möchten Sie ein personalisiertes Programm?",
    ctaDesc: "Kontaktieren Sie Feras jetzt für einen Fasten- und Ernährungsplan, der speziell auf Ihre Gesundheitsziele zugeschnitten ist",
    ctaBtn: "Auf WhatsApp chatten",
    ctaQuiz: "Kostenloser Gesundheitsquiz",
    shareTitle: "Teilen Sie Ihren Zeitplan mit Freunden",
    resetBtn: "Neue Berechnung",
    methodBadge: "Feras Alayed Method™",
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
    focusFoods: {
      title: "Bu gıdalara odaklanın ✅",
      items: [
        "Yağsız protein: tavuk göğsü, balık, ton balığı, karides, yağsız sığır eti, yumurta",
        "Sebzeler: brokoli, ıspanak, salatalık, kabak, biber, patlıcan, mantar, marul",
        "Sağlıklı yağlar: avokado, zeytinyağı, kuruyemişler, chia ve keten tohumları",
        "İyi karbonhidratlar: esmer pirinç, kinoa, yulaf, baklagiller, taze meyveler",
        "İçecekler: su, yeşil çay, sade kahve (oruç penceresi boyunca)",
      ],
    },
    moderateFoods: {
      title: "Ölçülü tüketin ⚠️",
      items: [
        "Beyaz pirinç, tam buğday ekmeği, buğday makarnası, kuskus",
        "Şeker oranı yüksek meyveler: olgun muz, mango, karpuz, ananas",
        "Mayonez, soya sosu",
      ],
    },
    avoidFoods: {
      title: "Bu gıdalardan kaçının ❌",
      items: [
        "Beyaz ekmek, bisküvi, hamur işleri, pasta, tatlılar",
        "Gazlı içecekler, şekerli meyve suları, enerji içecekleri",
        "Kızartmalar, işlenmiş etler (sosis, sucuk)",
        "Hidrojenize yağlar, hazır mikrodalga yemekleri",
      ],
    },
    portionTitle: "Porsiyon Rehberi (Elinizi Kullanın!)",
    portions: [
      { label: "Protein", size: "Avuç içi boyutu" },
      { label: "Karbonhidrat", size: "Yumruk boyutu" },
      { label: "Yağlar", size: "Başparmak boyutu" },
      { label: "Sebzeler", size: "Bir yumruk veya daha fazla" },
      { label: "Meyveler", size: "Bir yumruk veya daha az" },
    ],
    tipsTitle: "Aralıklı Oruç İçin Altın İpuçları",
    tips: [
      "Oruç sırasında odaklanma ve enerji için sabahları Unimate için",
      "Karbonhidrat etkisini azaltmak için akşam yemeğinden 10-15 dakika önce Balance alın",
      "Günde 2-3 litre su için (oruç sırasında su serbesttir)",
      "Haftada 3-4 gün en az 30 dakika egzersiz yapın",
      "Metabolizmayı iyileştirmek için gecelik 7-8 saat uyuyun",
    ],
    disclaimer: "Bunlar genel koçluk rehberleridir, tıbbi reçete değildir. Yeni bir diyete başlamadan önce doktorunuza danışın.",
    ctaTitle: "Kişiselleştirilmiş bir program ister misiniz?",
    ctaDesc: "Sağlık hedeflerinize özel tasarlanmış bir oruç ve beslenme planı için şimdi Feras ile iletişime geçin",
    ctaBtn: "WhatsApp'tan Yazın",
    ctaQuiz: "Ücretsiz Sağlık Testi",
    shareTitle: "Programınızı arkadaşlarınızla paylaşın",
    resetBtn: "Yeni Hesaplama",
    methodBadge: "Feras Alayed Method™",
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

// ============ Main Component ============
export default function FastingCalculator() {
  const { lang } = useLanguage();
  const t = i18n[lang] || i18n.en;
  const isRtl = lang === "ar";

  const [dinnerTime, setDinnerTime] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Calculate schedule based on dinner time
  const schedule = useMemo(() => {
    if (!dinnerTime) return null;
    // Fasting starts right after dinner
    const fastingStart = dinnerTime; // e.g., 20:00
    // Eating window opens 16 hours after fasting starts
    const eatingStart = addHours(fastingStart, 16); // e.g., 12:00 next day
    // Eating window closes 8 hours after it opens (= dinner time)
    const eatingEnd = addHours(eatingStart, 8); // e.g., 20:00
    // Unimate time: morning after fasting starts (7-9 AM range, or 11 hours after fasting start)
    const unimateTime = addHours(fastingStart, 11); // e.g., 07:00
    // Snack: 4 hours after eating starts
    const snackTime = addHours(eatingStart, 4); // e.g., 16:00

    return {
      fastingStart,
      eatingStart,
      unimateTime,
      snackTime,
      eatingEnd,
      times: [fastingStart, unimateTime, eatingStart, snackTime, eatingEnd],
    };
  }, [dinnerTime]);

  const handleCalculate = () => {
    if (dinnerTime) setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setDinnerTime("");
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
          {/* Method Badge */}
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
      {!showResults && (
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

      {/* Results Section */}
      {showResults && schedule && (
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl mx-auto px-4 space-y-8">
            {/* Schedule Card */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
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
            </div>

            {/* Nutrition Guidelines */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <Salad className="w-6 h-6 text-emerald-400" />
                {t.nutritionTitle}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Focus Foods */}
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
                {/* Moderate Foods */}
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
                {/* Avoid Foods */}
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
