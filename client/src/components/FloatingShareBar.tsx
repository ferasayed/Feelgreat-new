import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface FloatingShareBarProps {
  url: string;
  title: string;
  description?: string;
  lang?: string;
  showAfter?: number;
  contentType?: "article" | "research";
  contentSlug?: string;
}

const SHARE_UI: Record<string, { share: string; copyLink: string; copied: string; shareVia: string; shares: string }> = {
  ar: { share: "شارك", copyLink: "نسخ الرابط", copied: "تم نسخ الرابط!", shareVia: "شارك عبر", shares: "مشاركة" },
  en: { share: "Share", copyLink: "Copy Link", copied: "Link copied!", shareVia: "Share via", shares: "shares" },
  fr: { share: "Partager", copyLink: "Copier le lien", copied: "Lien copié !", shareVia: "Partager via", shares: "partages" },
  es: { share: "Compartir", copyLink: "Copiar enlace", copied: "¡Enlace copiado!", shareVia: "Compartir vía", shares: "compartidos" },
  de: { share: "Teilen", copyLink: "Link kopieren", copied: "Link kopiert!", shareVia: "Teilen über", shares: "geteilt" },
  tr: { share: "Paylaş", copyLink: "Bağlantıyı kopyala", copied: "Bağlantı kopyalandı!", shareVia: "Şununla paylaş", shares: "paylaşım" },
};

export default function FloatingShareBar({ url, title, description, lang = "en", showAfter = 400, contentType, contentSlug }: FloatingShareBarProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = SHARE_UI[lang] || SHARE_UI.en;

  const fullUrl = url.startsWith("http") ? url : `https://feelgreat.us.com${url}`;
  const shareText = description ? `${title}\n${description}` : title;

  // Share count query
  const shareCountQuery = trpc.share.getCount.useQuery(
    { contentType: contentType!, contentSlug: contentSlug! },
    { enabled: !!contentType && !!contentSlug }
  );
  const totalShares = shareCountQuery.data?.total || 0;

  // Share increment mutation
  const incrementMutation = trpc.share.increment.useMutation();

  const trackShare = (platform: "copy" | "whatsapp" | "telegram" | "twitter" | "facebook") => {
    if (contentType && contentSlug) {
      incrementMutation.mutate({ contentType, contentSlug, platform });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > showAfter);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success(t.copied);
      trackShare("copy");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success(t.copied);
      trackShare("copy");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareClick = (platform: "whatsapp" | "telegram" | "twitter" | "facebook") => {
    trackShare(platform);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${fullUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-full px-4 py-2.5 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      {/* Share count badge */}
      {totalShares > 0 && (
        <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5 hidden sm:inline">
          {totalShares} {t.shares}
        </span>
      )}

      <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{t.share}:</span>
      
      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          copied 
            ? "bg-green-500 text-white scale-110" 
            : "bg-muted hover:bg-muted/80 text-foreground hover:scale-105"
        }`}
        title={t.copyLink}
        aria-label={t.copyLink}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShareClick("whatsapp")}
        className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 hover:scale-105 transition-all duration-200"
        title={`${t.shareVia} WhatsApp`}
        aria-label={`${t.shareVia} WhatsApp`}
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Telegram */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShareClick("telegram")}
        className="w-9 h-9 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center hover:bg-[#0088cc]/20 hover:scale-105 transition-all duration-200"
        title={`${t.shareVia} Telegram`}
        aria-label={`${t.shareVia} Telegram`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>

      {/* Twitter/X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShareClick("twitter")}
        className="w-9 h-9 rounded-full bg-foreground/5 text-foreground flex items-center justify-center hover:bg-foreground/10 hover:scale-105 transition-all duration-200"
        title={`${t.shareVia} X`}
        aria-label={`${t.shareVia} X`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleShareClick("facebook")}
        className="w-9 h-9 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/20 hover:scale-105 transition-all duration-200"
        title={`${t.shareVia} Facebook`}
        aria-label={`${t.shareVia} Facebook`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
    </div>
  );
}
