import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, MessageCircle, Phone, Sparkles, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

const pageContent: Record<string, {
  title: string;
  subtitle: string;
  placeholder: string;
  sendBtn: string;
  suggestedQuestions: string[];
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  disclaimer: string;
}> = {
  ar: {
    title: "اسأل الخبير فراس العايد",
    subtitle: "احصل على إجابات مبنية على علم التغذية السلوكية والخبرة العملية — مجاناً",
    placeholder: "اكتب سؤالك هنا... مثال: هل برنامج Feel Great مناسب لمرضى السكري؟",
    sendBtn: "أرسل",
    suggestedQuestions: [
      "هل عندي مقاومة إنسولين؟",
      "كيف يعمل برنامج Feel Great؟",
      "هل المنتج آمن مع أدوية السكري؟",
      "كم المدة للحصول على نتائج؟",
      "ما الفرق بين يوني ميت وبالانس؟",
      "كيف أبدأ كشريك مع يونيسيتي؟",
      "هل في ضمان استرداد؟",
      "ما هو منهج فراس العايد؟",
    ],
    ctaTitle: "تبي تتكلم مع فراس شخصياً؟",
    ctaDesc: "احجز مكالمة تعريفية مجانية أو أرسل رسالة واتساب مباشرة.",
    ctaBtn: "تواصل عبر واتساب",
    disclaimer: "الإجابات مبنية على المعلومات العلمية المتاحة وخبرة فراس العايد. لا تُعد بديلاً عن الاستشارة الطبية.",
  },
  en: {
    title: "Ask Expert Feras Alayed",
    subtitle: "Get answers based on behavioral nutrition science and practical expertise — free",
    placeholder: "Type your question here... e.g., Is the Feel Great program suitable for diabetics?",
    sendBtn: "Send",
    suggestedQuestions: [
      "Do I have insulin resistance?",
      "How does the Feel Great program work?",
      "Is it safe with diabetes medications?",
      "How long until I see results?",
      "What's the difference between Unimate and Balance?",
      "How do I become a Unicity partner?",
      "Is there a money-back guarantee?",
      "What is the Feras Alayed Method?",
    ],
    ctaTitle: "Want to talk to Feras personally?",
    ctaDesc: "Book a free discovery call or send a WhatsApp message directly.",
    ctaBtn: "Connect via WhatsApp",
    disclaimer: "Answers are based on available scientific information and Feras Alayed's expertise. Not a substitute for medical advice.",
  },
  fr: {
    title: "Demandez à l'Expert Feras Alayed",
    subtitle: "Obtenez des réponses basées sur la science de la nutrition comportementale — gratuitement",
    placeholder: "Tapez votre question ici...",
    sendBtn: "Envoyer",
    suggestedQuestions: [
      "Ai-je une résistance à l'insuline?",
      "Comment fonctionne Feel Great?",
      "Est-ce sûr avec les médicaments?",
      "Combien de temps pour voir des résultats?",
    ],
    ctaTitle: "Vous voulez parler à Feras?",
    ctaDesc: "Réservez un appel gratuit ou envoyez un message WhatsApp.",
    ctaBtn: "Contacter via WhatsApp",
    disclaimer: "Les réponses sont basées sur les informations scientifiques disponibles. Pas un substitut à un avis médical.",
  },
  es: {
    title: "Pregunta al Experto Feras Alayed",
    subtitle: "Obtén respuestas basadas en la ciencia de la nutrición conductual — gratis",
    placeholder: "Escribe tu pregunta aquí...",
    sendBtn: "Enviar",
    suggestedQuestions: [
      "¿Tengo resistencia a la insulina?",
      "¿Cómo funciona Feel Great?",
      "¿Es seguro con medicamentos?",
      "¿Cuánto tiempo para ver resultados?",
    ],
    ctaTitle: "¿Quieres hablar con Feras?",
    ctaDesc: "Reserva una llamada gratuita o envía un mensaje de WhatsApp.",
    ctaBtn: "Contactar por WhatsApp",
    disclaimer: "Las respuestas se basan en la información científica disponible. No sustituyen el consejo médico.",
  },
  de: {
    title: "Frag den Experten Feras Alayed",
    subtitle: "Erhalte Antworten basierend auf Verhaltensernährungswissenschaft — kostenlos",
    placeholder: "Schreibe deine Frage hier...",
    sendBtn: "Senden",
    suggestedQuestions: [
      "Habe ich Insulinresistenz?",
      "Wie funktioniert Feel Great?",
      "Ist es sicher mit Medikamenten?",
      "Wie lange bis ich Ergebnisse sehe?",
    ],
    ctaTitle: "Möchtest du mit Feras sprechen?",
    ctaDesc: "Buche ein kostenloses Gespräch oder sende eine WhatsApp-Nachricht.",
    ctaBtn: "Über WhatsApp kontaktieren",
    disclaimer: "Antworten basieren auf verfügbaren wissenschaftlichen Informationen. Kein Ersatz für ärztliche Beratung.",
  },
  tr: {
    title: "Uzman Feras Alayed'e Sorun",
    subtitle: "Davranışsal beslenme bilimine dayalı yanıtlar alın — ücretsiz",
    placeholder: "Sorunuzu buraya yazın...",
    sendBtn: "Gönder",
    suggestedQuestions: [
      "İnsülin direncim var mı?",
      "Feel Great nasıl çalışır?",
      "İlaçlarla güvenli mi?",
      "Sonuçları ne zaman görürüm?",
    ],
    ctaTitle: "Feras ile kişisel olarak konuşmak ister misiniz?",
    ctaDesc: "Ücretsiz görüşme ayırtın veya WhatsApp mesajı gönderin.",
    ctaBtn: "WhatsApp ile iletişime geç",
    disclaimer: "Yanıtlar mevcut bilimsel bilgilere dayanmaktadır. Tıbbi tavsiye yerine geçmez.",
  },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AskExpert() {
  const { lang } = useLanguage();
  const c = pageContent[lang] || pageContent.en;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.chat.send.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatMutation.mutateAsync({
        visitorId: `expert-${Date.now()}`,
        message: text.trim(),
        history: messages.slice(-20),
        language: lang,
      });
      setMessages(prev => [...prev, { role: "assistant", content: result.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: lang === "ar" ? "عذراً، حدث خطأ. حاول مرة أخرى." : "Sorry, an error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Feras Alayed Method™</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
            {c.title}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">{c.subtitle}</p>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 text-sm">{c.placeholder}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-blue-600/30 text-white" : "bg-white/10 text-white/90"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  </div>
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={c.placeholder}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="gradient-gold text-foreground font-bold shrink-0 px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Suggested Questions */}
      <section className="pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {c.suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{c.ctaTitle}</h2>
          <p className="text-white/60 mb-8">{c.ctaDesc}</p>
          <a href="https://wa.me/96877020770?text=أرغب بالتحدث مع فراس العايد شخصياً" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gradient-gold text-foreground font-bold px-8 py-6 text-lg">
              <Phone className="w-5 h-5 me-2" />
              {c.ctaBtn}
            </Button>
          </a>
          <p className="text-white/30 text-xs mt-6 italic">{c.disclaimer}</p>
        </div>
      </section>
    </div>
  );
}
