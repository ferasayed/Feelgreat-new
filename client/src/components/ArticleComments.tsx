import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type SupportedLang = "ar" | "en" | "fr" | "es" | "de" | "tr";

const UI_TEXT: Record<SupportedLang, {
  title: string; commentsCount: string; writeComment: string;
  name: string; email: string; emailOptional: string;
  comment: string; submit: string; reply: string;
  like: string; noComments: string; beFirst: string;
  submitting: string; success: string; error: string;
  namePlaceholder: string; commentPlaceholder: string;
  cancel: string; replyTo: string; timeAgo: string;
}> = {
  ar: {
    title: "التعليقات", commentsCount: "تعليق", writeComment: "اكتب تعليقاً",
    name: "الاسم", email: "البريد الإلكتروني", emailOptional: "(اختياري)",
    comment: "التعليق", submit: "إرسال", reply: "رد",
    like: "إعجاب", noComments: "لا توجد تعليقات بعد", beFirst: "كن أول من يعلق!",
    submitting: "جاري الإرسال...", success: "تم إرسال تعليقك بنجاح!",
    error: "حدث خطأ، حاول مرة أخرى", namePlaceholder: "اسمك",
    commentPlaceholder: "شاركنا رأيك أو تجربتك...", cancel: "إلغاء",
    replyTo: "رد على", timeAgo: "منذ",
  },
  en: {
    title: "Comments", commentsCount: "comment", writeComment: "Write a comment",
    name: "Name", email: "Email", emailOptional: "(optional)",
    comment: "Comment", submit: "Submit", reply: "Reply",
    like: "Like", noComments: "No comments yet", beFirst: "Be the first to comment!",
    submitting: "Submitting...", success: "Your comment was submitted successfully!",
    error: "An error occurred, please try again", namePlaceholder: "Your name",
    commentPlaceholder: "Share your thoughts or experience...", cancel: "Cancel",
    replyTo: "Reply to", timeAgo: "ago",
  },
  fr: {
    title: "Commentaires", commentsCount: "commentaire", writeComment: "Écrire un commentaire",
    name: "Nom", email: "E-mail", emailOptional: "(optionnel)",
    comment: "Commentaire", submit: "Envoyer", reply: "Répondre",
    like: "J'aime", noComments: "Pas encore de commentaires", beFirst: "Soyez le premier à commenter !",
    submitting: "Envoi en cours...", success: "Votre commentaire a été envoyé !",
    error: "Une erreur est survenue, réessayez", namePlaceholder: "Votre nom",
    commentPlaceholder: "Partagez votre avis ou expérience...", cancel: "Annuler",
    replyTo: "Répondre à", timeAgo: "il y a",
  },
  es: {
    title: "Comentarios", commentsCount: "comentario", writeComment: "Escribir un comentario",
    name: "Nombre", email: "Correo", emailOptional: "(opcional)",
    comment: "Comentario", submit: "Enviar", reply: "Responder",
    like: "Me gusta", noComments: "Aún no hay comentarios", beFirst: "¡Sé el primero en comentar!",
    submitting: "Enviando...", success: "¡Tu comentario fue enviado con éxito!",
    error: "Ocurrió un error, intenta de nuevo", namePlaceholder: "Tu nombre",
    commentPlaceholder: "Comparte tu opinión o experiencia...", cancel: "Cancelar",
    replyTo: "Responder a", timeAgo: "hace",
  },
  de: {
    title: "Kommentare", commentsCount: "Kommentar", writeComment: "Kommentar schreiben",
    name: "Name", email: "E-Mail", emailOptional: "(optional)",
    comment: "Kommentar", submit: "Absenden", reply: "Antworten",
    like: "Gefällt mir", noComments: "Noch keine Kommentare", beFirst: "Sei der Erste, der kommentiert!",
    submitting: "Wird gesendet...", success: "Dein Kommentar wurde erfolgreich gesendet!",
    error: "Ein Fehler ist aufgetreten, versuche es erneut", namePlaceholder: "Dein Name",
    commentPlaceholder: "Teile deine Meinung oder Erfahrung...", cancel: "Abbrechen",
    replyTo: "Antwort auf", timeAgo: "vor",
  },
  tr: {
    title: "Yorumlar", commentsCount: "yorum", writeComment: "Yorum yaz",
    name: "İsim", email: "E-posta", emailOptional: "(isteğe bağlı)",
    comment: "Yorum", submit: "Gönder", reply: "Yanıtla",
    like: "Beğen", noComments: "Henüz yorum yok", beFirst: "İlk yorumu siz yapın!",
    submitting: "Gönderiliyor...", success: "Yorumunuz başarıyla gönderildi!",
    error: "Bir hata oluştu, tekrar deneyin", namePlaceholder: "Adınız",
    commentPlaceholder: "Düşüncelerinizi veya deneyiminizi paylaşın...", cancel: "İptal",
    replyTo: "Yanıt:", timeAgo: "önce",
  },
};

function timeAgo(date: Date | string, lang: SupportedLang): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  const units: Record<SupportedLang, { min: string; hr: string; day: string; days: string }> = {
    ar: { min: "دقيقة", hr: "ساعة", day: "يوم", days: "أيام" },
    en: { min: "min", hr: "hr", day: "day", days: "days" },
    fr: { min: "min", hr: "h", day: "jour", days: "jours" },
    es: { min: "min", hr: "h", day: "día", days: "días" },
    de: { min: "Min", hr: "Std", day: "Tag", days: "Tage" },
    tr: { min: "dk", hr: "sa", day: "gün", days: "gün" },
  };
  const u = units[lang];

  if (diffMin < 1) return lang === "ar" ? "الآن" : lang === "fr" ? "maintenant" : lang === "es" ? "ahora" : lang === "de" ? "jetzt" : lang === "tr" ? "şimdi" : "now";
  if (diffMin < 60) return `${diffMin} ${u.min}`;
  if (diffHr < 24) return `${diffHr} ${u.hr}`;
  if (diffDay < 30) return `${diffDay} ${diffDay === 1 ? u.day : u.days}`;
  return d.toLocaleDateString();
}

interface ArticleCommentsProps {
  articleId: number;
}

export default function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { lang } = useLanguage();
  const l = UI_TEXT[(lang as SupportedLang) || "en"] || UI_TEXT.en;
  const isRtl = lang === "ar";

  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const { data, isLoading, refetch } = trpc.comments.list.useQuery({ articleId });
  const createMutation = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success(l.success);
      setContent("");
      setName("");
      setEmail("");
      setShowForm(false);
      setReplyTo(null);
      refetch();
    },
    onError: () => {
      toast.error(l.error);
    },
  });
  const likeMutation = trpc.comments.like.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    createMutation.mutate({
      articleId,
      parentId: replyTo?.id,
      authorName: name.trim(),
      authorEmail: email.trim() || undefined,
      content: content.trim(),
      language: lang,
    });
  };

  const topLevelComments = data?.comments?.filter((c: any) => !c.parentId) || [];
  const replies = data?.comments?.filter((c: any) => c.parentId) || [];
  const getReplies = (parentId: number) => replies.filter((r: any) => r.parentId === parentId);

  return (
    <section className="mt-12" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {l.title} {data?.count ? `(${data.count} ${l.commentsCount})` : ""}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setShowForm(!showForm); setReplyTo(null); }}
        >
          {l.writeComment}
        </Button>
      </div>

      {/* Comment Form */}
      {(showForm || replyTo) && (
        <Card className="mb-6">
          <CardContent className="p-4">
            {replyTo && (
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{l.replyTo} {replyTo.name}</Badge>
                <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                  {l.cancel}
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Input
                    placeholder={l.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={`${l.email} ${l.emailOptional}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Textarea
                placeholder={l.commentPlaceholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                minLength={3}
                rows={4}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? l.submitting : l.submit}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setReplyTo(null); }}>
                  {l.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : topLevelComments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-lg mb-2">{l.noComments}</p>
            <p className="text-sm text-muted-foreground">{l.beFirst}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment: any) => (
            <div key={comment.id}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{comment.authorName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(comment.createdAt, lang as SupportedLang)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => likeMutation.mutate({ commentId: comment.id })}
                    >
                      ♥ {comment.likes > 0 && comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => { setReplyTo({ id: comment.id, name: comment.authorName }); setShowForm(true); }}
                    >
                      {l.reply}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Replies */}
              {getReplies(comment.id).length > 0 && (
                <div className={`${isRtl ? "mr-8" : "ml-8"} mt-2 space-y-2`}>
                  {getReplies(comment.id).map((reply: any) => (
                    <Card key={reply.id} className="bg-muted/30">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold">
                              {reply.authorName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-xs">{reply.authorName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(reply.createdAt, lang as SupportedLang)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 mt-1"
                          onClick={() => likeMutation.mutate({ commentId: reply.id })}
                        >
                          ♥ {reply.likes > 0 && reply.likes}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
