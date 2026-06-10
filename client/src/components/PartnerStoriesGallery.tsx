import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PARTNER_STORIES, PARTNER_STORY_CATEGORIES, type PartnerStory } from "@/data/partnerStories";
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";

// ===== VIDEO MODAL =====
function VideoModal({ story, isOpen, onClose }: { story: PartnerStory | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !story || !story.videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="w-full max-w-3xl max-h-[85vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={story.videoUrl}
          poster={story.thumbnailUrl}
          controls
          autoPlay
          className="w-full max-h-[80vh] rounded-xl shadow-2xl bg-black"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

// ===== IMAGE LIGHTBOX =====
function ImageLightbox({
  stories,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  stories: PartnerStory[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { lang } = useLanguage();

  if (!isOpen || stories.length === 0) return null;

  const current = stories[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="absolute top-4 left-4 text-white/70 text-sm font-medium">
        {currentIndex + 1} / {stories.length}
      </div>

      {stories.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="flex flex-col items-center max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.thumbnailUrl}
          alt={lang === "ar" ? current.altAr : current.altEn}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {stories.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// ===== MAIN GALLERY COMPONENT =====
export default function PartnerStoriesGallery() {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";

  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoStory, setActiveVideoStory] = useState<PartnerStory | null>(null);

  const filteredStories = useMemo(() => {
    if (activeCategory === "all") return PARTNER_STORIES;
    return PARTNER_STORIES.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  // Only image stories for lightbox navigation
  const imageStories = useMemo(() => filteredStories.filter(s => s.type === "before-after"), [filteredStories]);

  const handleStoryClick = useCallback((story: PartnerStory, indexInFiltered: number) => {
    if (story.type === "video") {
      setActiveVideoStory(story);
      setVideoModalOpen(true);
    } else {
      // Find index in imageStories array
      const imgIdx = imageStories.findIndex(s => s.id === story.id);
      setLightboxIndex(imgIdx >= 0 ? imgIdx : 0);
      setLightboxOpen(true);
    }
  }, [imageStories]);

  const handleLightboxNext = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % imageStories.length);
  }, [imageStories.length]);

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + imageStories.length) % imageStories.length);
  }, [imageStories.length]);

  // Keyboard handler for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxOpen) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") handleLightboxNext();
      if (e.key === "ArrowLeft") handleLightboxPrev();
    }
    if (videoModalOpen && e.key === "Escape") {
      setVideoModalOpen(false);
    }
  }, [lightboxOpen, videoModalOpen, handleLightboxNext, handleLightboxPrev]);

  // Register keyboard listener
  useState(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  });

  const content = {
    ar: {
      sectionTitle: "142 نتيجة موثقة — قبل وبعد",
      sectionSubtitle: "صور وفيديوهات حقيقية من مشتركين في برنامج الصحة المستدامة. جميع الأسماء والأرقام محجوبة لحماية الخصوصية.",
      beforeAfter: "قبل وبعد",
      video: "فيديو",
      viewMore: "شاهد المزيد على موقع الشريك",
    },
    en: {
      sectionTitle: "142 Documented Results — Before & After",
      sectionSubtitle: "Real photos and videos from Sustainable Health Program participants. All names and numbers are redacted to protect privacy.",
      beforeAfter: "Before / After",
      video: "Video",
      viewMore: "View more on partner site",
    },
  };

  const c = isRtl ? content.ar : content.en;

  return (
    <section className="container max-w-6xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{c.sectionTitle}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">{c.sectionSubtitle}</p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {PARTNER_STORY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {isRtl ? cat.nameAr : cat.nameEn}
            <span className={`ml-1.5 text-xs ${activeCategory === cat.id ? "text-white/80" : "text-slate-500"}`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredStories.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story, idx)}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <img
              src={story.thumbnailUrl}
              alt={isRtl ? story.altAr : story.altEn}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm ${
                story.type === "video"
                  ? "bg-red-500/80 text-white"
                  : "bg-emerald-500/80 text-white"
              }`}>
                {story.type === "video" ? <Play className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                {story.type === "video" ? c.video : c.beforeAfter}
              </span>
            </div>

            {/* Play button overlay for videos */}
            {story.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* View More Link */}
      <div className="text-center mt-8">
        <a
          href="https://feelgreatap-h8jahypk.manus.space/success-stories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
        >
          {c.viewMore}
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        stories={imageStories}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />

      {/* Video Modal */}
      <VideoModal
        story={activeVideoStory}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </section>
  );
}
