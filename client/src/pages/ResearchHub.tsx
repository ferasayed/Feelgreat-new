import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOPICS = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "insulin resistance", labelAr: "مقاومة الإنسولين", labelEn: "Insulin Resistance" },
  { id: "metabolic health", labelAr: "الصحة الأيضية", labelEn: "Metabolic Health" },
  { id: "gut health", labelAr: "صحة الأمعاء", labelEn: "Gut Health" },
  { id: "weight loss", labelAr: "إنقاص الوزن", labelEn: "Weight Loss" },
  { id: "sleep", labelAr: "النوم", labelEn: "Sleep" },
  { id: "inflammation", labelAr: "الالتهاب", labelEn: "Inflammation" },
  { id: "nutrition", labelAr: "التغذية", labelEn: "Nutrition" },
  { id: "mental health", labelAr: "الصحة النفسية", labelEn: "Mental Health" },
  { id: "longevity", labelAr: "طول العمر", labelEn: "Longevity" },
  { id: "diabetes", labelAr: "السكري", labelEn: "Diabetes" },
  { id: "microbiome", labelAr: "الميكروبيوم", labelEn: "Microbiome" },
  { id: "women's health", labelAr: "صحة المرأة", labelEn: "Women's Health" },
];

const EVIDENCE_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  moderate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  preliminary: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "very-low": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const EVIDENCE_LABELS: Record<string, { ar: string; en: string }> = {
  high: { ar: "دليل قوي", en: "Strong Evidence" },
  moderate: { ar: "دليل متوسط", en: "Moderate Evidence" },
  low: { ar: "دليل ضعيف", en: "Low Evidence" },
  preliminary: { ar: "أولي", en: "Preliminary" },
  "very-low": { ar: "ضعيف جداً", en: "Very Low" },
};

// Helper to get multilingual research field
function getResearchField(study: any, field: string, lang: string): string {
  const langMap: Record<string, string> = { ar: 'Ar', en: 'En', fr: 'Fr', es: 'Es', de: 'De', tr: 'Tr' };
  const suffix = langMap[lang] || 'En';
  return study[`${field}${suffix}`] || study[`${field}En`] || study[`${field}Ar`] || '';
}

const RESEARCH_UI: Record<string, { title: string; subtitle: string; aiPowered: string; studies: string; updatedDaily: string; verifiedSources: string; disclaimer: string; disclaimerText: string; noStudies: string; addedSoon: string; noToday: string; checkLatest: string; noWeek: string; noMonth: string; noData: string; topicsCovered: string; sources: string; stayUpdated: string; stayUpdatedDesc: string; readBlog: string; latest: string; today: string; week: string; month: string; popular: string; impactful: string; preliminary: string; reads: string }> = {
  ar: { title: '\u0645\u0631\u0643\u0632 \u0627\u0644\u0623\u0628\u062d\u0627\u062b \u0627\u0644\u0639\u0644\u0645\u064a\u0629', subtitle: '\u0623\u062d\u062f\u062b \u0627\u0644\u062f\u0631\u0627\u0633\u0627\u062a \u0627\u0644\u0639\u0644\u0645\u064a\u0629 \u0645\u0646 \u0623\u0641\u0636\u0644 \u0627\u0644\u062c\u0627\u0645\u0639\u0627\u062a \u0648\u0627\u0644\u0645\u062c\u0644\u0627\u062a \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u2014 \u0645\u0628\u0633\u0637\u0629 \u0648\u0645\u062a\u0631\u062c\u0645\u0629 \u0644\u062a\u0641\u0647\u0645\u0647\u0627 \u0641\u064a 30 \u062b\u0627\u0646\u064a\u0629 \u0623\u0648 3 \u062f\u0642\u0627\u0626\u0642', aiPowered: '\u0645\u062f\u0639\u0648\u0645 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a', studies: '\u062f\u0631\u0627\u0633\u0629', updatedDaily: '\u062a\u062d\u062f\u064a\u062b \u064a\u0648\u0645\u064a', verifiedSources: '\u0645\u0635\u0627\u062f\u0631 \u0645\u0648\u062b\u0642\u0629', disclaimer: '\u062a\u0646\u0628\u064a\u0647:', disclaimerText: '\u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u062a\u0639\u0644\u064a\u0645\u064a \u0648\u0644\u064a\u0633 \u062a\u0634\u062e\u064a\u0635\u0627\u064b \u0637\u0628\u064a\u0627\u064b. \u0627\u0644\u062f\u0631\u0627\u0633\u0627\u062a \u0627\u0644\u0623\u0648\u0644\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u062d\u064a\u0648\u0627\u0646\u0627\u062a \u0623\u0648 \u0627\u0644\u062e\u0644\u0627\u064a\u0627 \u0644\u0627 \u062a\u064f\u0639\u062f \u0625\u062b\u0628\u0627\u062a\u0627\u064b \u0639\u0644\u0649 \u0627\u0644\u0628\u0634\u0631. \u0627\u0633\u062a\u0634\u0631 \u0637\u0628\u064a\u0628\u0643 \u062f\u0627\u0626\u0645\u0627\u064b.', noStudies: '\u0644\u0627 \u062a\u0648\u062c\u062f \u062f\u0631\u0627\u0633\u0627\u062a \u0628\u0639\u062f', addedSoon: '\u0633\u064a\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u062f\u0631\u0627\u0633\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u0642\u0631\u064a\u0628\u0627\u064b', noToday: '\u0644\u0627 \u062a\u0648\u062c\u062f \u062f\u0631\u0627\u0633\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u0627\u0644\u064a\u0648\u0645', checkLatest: '\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062f\u0631\u0627\u0633\u0627\u062a \u0627\u0644\u0623\u062d\u062f\u062b \u0623\u0648 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639', noWeek: '\u0644\u0627 \u062a\u0648\u062c\u062f \u062f\u0631\u0627\u0633\u0627\u062a \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639', noMonth: '\u0644\u0627 \u062a\u0648\u062c\u062f \u062f\u0631\u0627\u0633\u0627\u062a \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631', noData: '\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0628\u0639\u062f', topicsCovered: '\u0627\u0644\u0645\u0648\u0627\u0636\u064a\u0639 \u0627\u0644\u0645\u063a\u0637\u0627\u0629', sources: '\u0645\u0635\u0627\u062f\u0631\u0646\u0627 \u0627\u0644\u0639\u0644\u0645\u064a\u0629', stayUpdated: '\u0627\u0628\u0642\u064e \u0639\u0644\u0649 \u0627\u0637\u0644\u0627\u0639 \u0628\u0623\u062d\u062f\u062b \u0627\u0644\u0623\u0628\u062d\u0627\u062b', stayUpdatedDesc: '\u0646\u0636\u064a\u0641 \u062f\u0631\u0627\u0633\u0627\u062a \u062c\u062f\u064a\u062f\u0629 \u064a\u0648\u0645\u064a\u0627\u064b \u0645\u0646 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u062c\u0644\u0627\u062a \u0627\u0644\u0639\u0644\u0645\u064a\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629', readBlog: '\u0627\u0642\u0631\u0623 \u0645\u0642\u0627\u0644\u0627\u062a\u0646\u0627 \u0623\u064a\u0636\u0627\u064b', latest: '\u0627\u0644\u0623\u062d\u062f\u062b', today: '\u0627\u0644\u064a\u0648\u0645', week: '\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639', month: '\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631', popular: '\u0627\u0644\u0623\u0643\u062b\u0631 \u0642\u0631\u0627\u0621\u0629', impactful: '\u0627\u0644\u0623\u0643\u062b\u0631 \u062a\u0623\u062b\u064a\u0631\u0627\u064b', preliminary: '\u062f\u0631\u0627\u0633\u0629 \u0623\u0648\u0644\u064a\u0629', reads: '\u0642\u0631\u0627\u0621\u0629' },
  en: { title: 'Health Science Hub', subtitle: 'Latest scientific studies from top universities and journals \u2014 simplified so you can understand them in 30 seconds or 3 minutes', aiPowered: 'AI-Powered Research Summaries', studies: 'studies', updatedDaily: 'Updated daily', verifiedSources: 'Verified sources', disclaimer: 'Disclaimer:', disclaimerText: 'This content is educational, not medical advice. Preliminary animal/cell studies are not proof in humans. Always consult your doctor.', noStudies: 'No studies yet', addedSoon: 'New studies will be added soon', noToday: 'No new studies today', checkLatest: 'Check Latest or This Week tabs for recent studies', noWeek: 'No studies this week', noMonth: 'No studies this month', noData: 'No data yet', topicsCovered: 'Topics Covered', sources: 'Our Scientific Sources', stayUpdated: 'Stay Updated with Latest Research', stayUpdatedDesc: 'We add new studies daily from the world\'s top scientific journals', readBlog: 'Read Our Blog Too', latest: 'Latest', today: 'Today', week: 'This Week', month: 'This Month', popular: 'Most Read', impactful: 'Most Impactful', preliminary: 'Preliminary', reads: 'reads' },
  fr: { title: 'Centre de Recherche Scientifique', subtitle: 'Derni\u00e8res \u00e9tudes scientifiques simplifi\u00e9es des meilleures universit\u00e9s', aiPowered: 'R\u00e9sum\u00e9s aliment\u00e9s par l\'IA', studies: '\u00e9tudes', updatedDaily: 'Mise \u00e0 jour quotidienne', verifiedSources: 'Sources v\u00e9rifi\u00e9es', disclaimer: 'Avertissement :', disclaimerText: 'Ce contenu est \u00e9ducatif, pas un avis m\u00e9dical. Les \u00e9tudes pr\u00e9liminaires ne sont pas des preuves chez l\'homme.', noStudies: 'Aucune \u00e9tude', addedSoon: 'De nouvelles \u00e9tudes seront ajout\u00e9es bient\u00f4t', noToday: 'Pas de nouvelles \u00e9tudes aujourd\'hui', checkLatest: 'Consultez les onglets R\u00e9cents ou Cette semaine', noWeek: 'Pas d\'\u00e9tudes cette semaine', noMonth: 'Pas d\'\u00e9tudes ce mois', noData: 'Pas encore de donn\u00e9es', topicsCovered: 'Sujets couverts', sources: 'Nos sources scientifiques', stayUpdated: 'Restez inform\u00e9', stayUpdatedDesc: 'Nous ajoutons de nouvelles \u00e9tudes quotidiennement', readBlog: 'Lisez aussi notre blog', latest: 'R\u00e9cents', today: 'Aujourd\'hui', week: 'Cette semaine', month: 'Ce mois', popular: 'Plus lus', impactful: 'Plus impactants', preliminary: 'Pr\u00e9liminaire', reads: 'lectures' },
  es: { title: 'Centro de Investigaci\u00f3n Cient\u00edfica', subtitle: '\u00daltimos estudios cient\u00edficos simplificados de las mejores universidades', aiPowered: 'Res\u00famenes con IA', studies: 'estudios', updatedDaily: 'Actualizado diariamente', verifiedSources: 'Fuentes verificadas', disclaimer: 'Aviso:', disclaimerText: 'Este contenido es educativo, no consejo m\u00e9dico. Los estudios preliminares no son prueba en humanos.', noStudies: 'No hay estudios a\u00fan', addedSoon: 'Se a\u00f1adir\u00e1n nuevos estudios pronto', noToday: 'No hay estudios nuevos hoy', checkLatest: 'Consulte las pesta\u00f1as Recientes o Esta semana', noWeek: 'No hay estudios esta semana', noMonth: 'No hay estudios este mes', noData: 'Sin datos a\u00fan', topicsCovered: 'Temas cubiertos', sources: 'Nuestras fuentes cient\u00edficas', stayUpdated: 'Mant\u00e9ngase actualizado', stayUpdatedDesc: 'A\u00f1adimos nuevos estudios diariamente', readBlog: 'Lea tambi\u00e9n nuestro blog', latest: 'Recientes', today: 'Hoy', week: 'Esta semana', month: 'Este mes', popular: 'M\u00e1s le\u00eddos', impactful: 'M\u00e1s impactantes', preliminary: 'Preliminar', reads: 'lecturas' },
  de: { title: 'Wissenschaftliches Forschungszentrum', subtitle: 'Neueste wissenschaftliche Studien vereinfacht aus den besten Universit\u00e4ten', aiPowered: 'KI-gest\u00fctzte Zusammenfassungen', studies: 'Studien', updatedDaily: 'T\u00e4glich aktualisiert', verifiedSources: 'Verifizierte Quellen', disclaimer: 'Hinweis:', disclaimerText: 'Dieser Inhalt ist p\u00e4dagogisch, keine medizinische Beratung. Vorl\u00e4ufige Studien sind kein Beweis beim Menschen.', noStudies: 'Noch keine Studien', addedSoon: 'Neue Studien werden bald hinzugef\u00fcgt', noToday: 'Keine neuen Studien heute', checkLatest: 'Pr\u00fcfen Sie die Tabs Neueste oder Diese Woche', noWeek: 'Keine Studien diese Woche', noMonth: 'Keine Studien diesen Monat', noData: 'Noch keine Daten', topicsCovered: 'Abgedeckte Themen', sources: 'Unsere wissenschaftlichen Quellen', stayUpdated: 'Bleiben Sie auf dem Laufenden', stayUpdatedDesc: 'Wir f\u00fcgen t\u00e4glich neue Studien hinzu', readBlog: 'Lesen Sie auch unseren Blog', latest: 'Neueste', today: 'Heute', week: 'Diese Woche', month: 'Diesen Monat', popular: 'Meistgelesen', impactful: 'Wirkungsvollste', preliminary: 'Vorl\u00e4ufig', reads: 'Aufrufe' },
  tr: { title: 'Bilimsel Ara\u015ft\u0131rma Merkezi', subtitle: 'En iyi \u00fcniversitelerden basitle\u015ftirilmi\u015f bilimsel \u00e7al\u0131\u015fmalar', aiPowered: 'Yapay Zeka Destekli \u00d6zetler', studies: '\u00e7al\u0131\u015fma', updatedDaily: 'G\u00fcnl\u00fck g\u00fcncelleme', verifiedSources: 'Do\u011frulanm\u0131\u015f kaynaklar', disclaimer: 'Uyar\u0131:', disclaimerText: 'Bu i\u00e7erik e\u011fitim ama\u00e7l\u0131d\u0131r, t\u0131bbi tavsiye de\u011fildir. \u00d6n \u00e7al\u0131\u015fmalar insanlarda kan\u0131t de\u011fildir.', noStudies: 'Hen\u00fcz \u00e7al\u0131\u015fma yok', addedSoon: 'Yak\u0131nda yeni \u00e7al\u0131\u015fmalar eklenecek', noToday: 'Bug\u00fcn yeni \u00e7al\u0131\u015fma yok', checkLatest: 'Son veya Bu Hafta sekmelerini kontrol edin', noWeek: 'Bu hafta \u00e7al\u0131\u015fma yok', noMonth: 'Bu ay \u00e7al\u0131\u015fma yok', noData: 'Hen\u00fcz veri yok', topicsCovered: 'Kapsanan konular', sources: 'Bilimsel kaynaklar\u0131m\u0131z', stayUpdated: 'G\u00fcncel kal\u0131n', stayUpdatedDesc: 'Her g\u00fcn yeni \u00e7al\u0131\u015fmalar ekliyoruz', readBlog: 'Blogumuzu da okuyun', latest: 'Son', today: 'Bug\u00fcn', week: 'Bu Hafta', month: 'Bu Ay', popular: 'En \u00c7ok Okunan', impactful: 'En Etkili', preliminary: '\u00d6n \u00c7al\u0131\u015fma', reads: 'okuma' },
};

function StudyCard({ study, isAr, lang }: { study: any; isAr: boolean; lang: string }) {
  const rt = RESEARCH_UI[lang] || RESEARCH_UI.en;
  const title = getResearchField(study, 'title', lang);
  const summary = getResearchField(study, 'summary30s', lang);
  const evidenceLabel = EVIDENCE_LABELS[study.evidenceLevel] || { ar: study.evidenceLevel, en: study.evidenceLevel };
  const evidenceColor = EVIDENCE_COLORS[study.evidenceLevel] || "bg-gray-100 text-gray-800";

  return (
    <Link href={`/research/${study.slug}`}>
      <article className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {study.heroImageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={study.heroImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={evidenceColor}>
              {isAr ? evidenceLabel.ar : evidenceLabel.en}
            </Badge>
            {study.isPreliminary && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200">
                ⚠️ {rt.preliminary}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {study.studyType}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {summary}
          </p>

          {/* Footer metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 truncate max-w-[70%]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold text-[10px] border border-blue-200 dark:border-blue-800/40">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                {study.journal}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {study.impactScore && study.impactScore > 7 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium">
                  ⭐ {study.impactScore}/10
                </span>
              )}
              <span>{new Date(study.publishDate).toLocaleDateString({ ar: 'ar-SA', en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', tr: 'tr-TR' }[lang] || 'en-US', { year: "numeric", month: "short" })}</span>
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-1 mt-2">
            {(study.topics as string[])?.slice(0, 3).map((topic: string) => (
              <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {topic}
              </span>
            ))}
          </div>

          {/* View count if available */}
          {study.viewCount > 0 && (
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {study.viewCount.toLocaleString()} {rt.reads}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function StudyCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export default function ResearchHub() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const rt = RESEARCH_UI[lang] || RESEARCH_UI.en;
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    document.title = isAr
      ? "مركز الأبحاث العلمية | Health Science Hub"
      : "Health Science Hub | Latest Research & Discoveries";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", isAr
      ? "أحدث الدراسات والأبحاث العلمية في مجال الصحة المستدامة، مبسطة ومترجمة من أفضل المجلات العلمية العالمية."
      : "Latest health research simplified. Scientific studies from PubMed, Nature, JAMA and more - made accessible for everyone.");
  }, [isAr]);

  const { data: latestData, isLoading: latestLoading } = trpc.research.list.useQuery(
    selectedTopic === "all" ? { limit: 20 } : { limit: 20, topic: selectedTopic }
  );
  const { data: todayData } = trpc.research.today.useQuery();
  const { data: weekData } = trpc.research.thisWeek.useQuery();
  const { data: monthData } = trpc.research.thisMonth.useQuery();
  const { data: topicsData } = trpc.research.topics.useQuery();
  const { data: mostReadData } = trpc.research.mostRead.useQuery({ limit: 10 });
  const { data: mostImpactfulData } = trpc.research.mostImpactful.useQuery({ limit: 10 });

  const studies = latestData?.studies ?? [];
  const totalStudies = latestData?.total ?? 0;

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-[#0a1628] via-[#132240] to-[#1a3a5c] py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-6 border border-white/10">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>{rt.aiPowered}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {rt.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            {rt.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {totalStudies} {rt.studies}
            </span>
            <span>•</span>
            <span>{rt.updatedDaily}</span>
            <span>•</span>
            <span>{rt.verifiedSources}</span>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/30">
        <div className="container py-3 text-center text-sm text-amber-800 dark:text-amber-200">
          <span className="font-medium">⚠️ {rt.disclaimer}</span>{" "}
          {rt.disclaimerText}
        </div>
      </div>

      <main className="container py-10">
        {/* Topic Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTopic === topic.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isAr ? topic.labelAr : topic.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="latest">{rt.latest}</TabsTrigger>
            <TabsTrigger value="today">{rt.today}</TabsTrigger>
            <TabsTrigger value="week">{rt.week}</TabsTrigger>
            <TabsTrigger value="month">{rt.month}</TabsTrigger>
            <TabsTrigger value="popular">{rt.popular}</TabsTrigger>
            <TabsTrigger value="impactful">{rt.impactful}</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="mt-6">
            {latestLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <StudyCardSkeleton key={i} />)}
              </div>
            ) : studies.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {rt.noStudies}
                </h3>
                <p className="text-muted-foreground">
                  {rt.addedSoon}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studies.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="mt-6">
            {todayData && todayData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todayData.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {rt.noToday}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {rt.checkLatest}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="week" className="mt-6">
            {weekData && weekData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weekData.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{rt.noWeek}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="month" className="mt-6">
            {monthData && monthData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monthData.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{rt.noMonth}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            {mostReadData && mostReadData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostReadData.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{rt.noData}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="impactful" className="mt-6">
            {mostImpactfulData && mostImpactfulData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostImpactfulData.map((study: any) => (
                  <StudyCard key={study.id} study={study} isAr={isAr} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">{rt.noData}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Sidebar: Topics Distribution */}
        {topicsData && topicsData.length > 0 && (
          <section className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {rt.topicsCovered}
            </h2>
            <div className="flex flex-wrap gap-3">
              {topicsData.map((t: any) => (
                <button
                  key={t.topic}
                  onClick={() => setSelectedTopic(t.topic)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <span className="text-sm font-medium">{t.topic}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t.count}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Trust Section */}
        <section className="mt-12 text-center">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {rt.sources}
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground opacity-70">
            {["PubMed", "NIH", "Nature", "The Lancet", "JAMA", "BMJ", "Harvard", "Stanford", "Mayo Clinic", "WHO"].map((source) => (
              <span key={source} className="font-medium">{source}</span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 py-12 border-t">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {rt.stayUpdated}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {rt.stayUpdatedDesc}
          </p>
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
              {rt.readBlog}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? "M19 12H5m0 0l7-7m-7 7l7 7" : "M5 12h14m0 0l-7-7m7 7l-7 7"} />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
