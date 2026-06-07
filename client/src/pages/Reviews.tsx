import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Star, ArrowLeft, Send, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 ${(hover || value) >= star ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    rating: 5,
    title: "",
    content: "",
    category: "general",
  });

  const { data: reviews, isLoading } = trpc.reviews.published.useQuery();
  const { data: stats } = trpc.reviews.stats.useQuery();
  const submitMutation = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "شكراً! تم إرسال مراجعتك للموافقة." : "Thank you! Your review has been submitted for approval.");
      setShowForm(false);
      setFormData({ name: "", country: "", rating: 5, title: "", content: "", category: "general" });
    },
    onError: () => {
      toast.error(isAr ? "فشل إرسال المراجعة. يرجى المحاولة مرة أخرى." : "Failed to submit review. Please try again.");
    },
  });

  useEffect(() => {
    document.title = isAr ? "مراجعات العملاء | قصص نجاح Feel Great" : "Customer Reviews | Feel Great Success Stories";
  }, [isAr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.country || !formData.title || !formData.content) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">Feel Great</Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> {isAr ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{isAr ? "مراجعات العملاء" : "Customer Reviews"}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {isAr ? "تجارب حقيقية من أشخاص حقيقيين في رحلة تحولهم الصحي" : "Real experiences from real people on their health transformation journey"}
          </p>
          {stats && (
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.avgRating || "5.0"}</div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating || 5) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{isAr ? "متوسط التقييم" : "Average Rating"}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.published || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">{isAr ? "المراجعات المنشورة" : "Published Reviews"}</div>
              </div>
            </div>
          )}
          <Button onClick={() => setShowForm(!showForm)} className="gradient-blue text-white border-0">
            <Send className="w-4 h-4 mr-2" />
            {isAr ? "شارك تجربتك" : "Share Your Experience"}
          </Button>
        </div>
      </section>

      {/* Submit Form */}
      {showForm && (
        <section className="container max-w-lg mx-auto pb-12">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6">{isAr ? "شارك مراجعتك" : "Share Your Review"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "اسمك *" : "Your Name *"}</label>
                  <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder={isAr ? "مثال: سارة م." : "e.g. Sarah M."} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "الدولة *" : "Country *"}</label>
                  <Input value={formData.country} onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))} placeholder={isAr ? "مثال: السعودية" : "e.g. United States"} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "التقييم *" : "Rating *"}</label>
                  <StarRating value={formData.rating} onChange={(v) => setFormData((p) => ({ ...p, rating: v }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "الفئة" : "Category"}</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="energy">Energy & Vitality</SelectItem>
                      <SelectItem value="metabolic">Metabolic Health</SelectItem>
                      <SelectItem value="gut-health">Gut Health</SelectItem>
                      <SelectItem value="aging">Healthy Aging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "عنوان المراجعة *" : "Review Title *"}</label>
                  <Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder={isAr ? "مثال: نتائج غيّرت حياتي في 3 أشهر" : "e.g. Life-changing results in 3 months"} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{isAr ? "تجربتك *" : "Your Experience *"}</label>
                  <Textarea value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} placeholder={isAr ? "أخبرنا عن رحلتك مع Feel Great..." : "Tell us about your journey with Feel Great..."} rows={4} required />
                </div>
                <Button type="submit" className="w-full gradient-blue text-white border-0" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال المراجعة" : "Submit Review")}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {isAr ? "المراجعات تخضع للمراجعة وستظهر بعد الموافقة." : "Reviews are moderated and will appear after approval."}
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Published Reviews */}
      <section className="container max-w-4xl mx-auto pb-20 px-4">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium capitalize">
                      {review.category.replace("-", " ")}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-2">{review.title}</h3>
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed italic">{review.content}</p>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.country}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{isAr ? "لا توجد مراجعات بعد. كن أول من يشارك تجربته!" : "No reviews yet. Be the first to share your experience!"}</p>
            <Button onClick={() => setShowForm(true)} variant="outline">{isAr ? "اكتب مراجعة" : "Write a Review"}</Button>
          </div>
        )}
      </section>
    </div>
  );
}
