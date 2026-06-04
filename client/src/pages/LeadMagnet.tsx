import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle, Download, Activity, Brain, Flame, AlertTriangle, Heart, Shield } from "lucide-react";
import { toast } from "sonner";

type MagnetType = "insulin-assessment" | "health-score" | "metabolic-quiz" | "guide";
type Step = "select" | "quiz" | "capture" | "result";

interface QuizQuestion {
  question: string;
  options: { label: string; score: number }[];
}

const insulinQuestions: QuizQuestion[] = [
  { question: "Do you often feel tired or sluggish after meals?", options: [{ label: "Rarely", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Often", score: 2 }, { label: "Almost always", score: 3 }] },
  { question: "Do you carry excess weight around your midsection?", options: [{ label: "No", score: 0 }, { label: "Slightly", score: 1 }, { label: "Moderately", score: 2 }, { label: "Significantly", score: 3 }] },
  { question: "Do you experience sugar or carb cravings?", options: [{ label: "Rarely", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Often", score: 2 }, { label: "Constantly", score: 3 }] },
  { question: "Do you feel hungry again within 2 hours of eating?", options: [{ label: "Rarely", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Often", score: 2 }, { label: "Almost always", score: 3 }] },
  { question: "Do you experience brain fog or difficulty concentrating?", options: [{ label: "Rarely", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Often", score: 2 }, { label: "Daily", score: 3 }] },
  { question: "Have you been told your blood sugar is borderline high?", options: [{ label: "No", score: 0 }, { label: "Once", score: 1 }, { label: "Multiple times", score: 2 }, { label: "Yes, diagnosed prediabetic", score: 3 }] },
  { question: "Do you have dark patches on your skin (neck, armpits)?", options: [{ label: "No", score: 0 }, { label: "Very slight", score: 1 }, { label: "Noticeable", score: 2 }, { label: "Very visible", score: 3 }] },
];

const healthScoreQuestions: QuizQuestion[] = [
  { question: "How many servings of vegetables do you eat daily?", options: [{ label: "5+", score: 0 }, { label: "3-4", score: 1 }, { label: "1-2", score: 2 }, { label: "Less than 1", score: 3 }] },
  { question: "How many hours of quality sleep do you get?", options: [{ label: "7-9 hours", score: 0 }, { label: "6-7 hours", score: 1 }, { label: "5-6 hours", score: 2 }, { label: "Less than 5", score: 3 }] },
  { question: "How often do you exercise per week?", options: [{ label: "5+ times", score: 0 }, { label: "3-4 times", score: 1 }, { label: "1-2 times", score: 2 }, { label: "Rarely", score: 3 }] },
  { question: "How would you rate your stress levels?", options: [{ label: "Low", score: 0 }, { label: "Moderate", score: 1 }, { label: "High", score: 2 }, { label: "Very high", score: 3 }] },
  { question: "How much water do you drink daily?", options: [{ label: "8+ glasses", score: 0 }, { label: "5-7 glasses", score: 1 }, { label: "3-4 glasses", score: 2 }, { label: "Less than 3", score: 3 }] },
  { question: "Do you practice any form of fasting?", options: [{ label: "Regular 16:8 or similar", score: 0 }, { label: "Occasionally", score: 1 }, { label: "Tried but stopped", score: 2 }, { label: "Never", score: 3 }] },
];

const metabolicQuestions: QuizQuestion[] = [
  { question: "What is your waist circumference?", options: [{ label: "Under 80cm (women) / 94cm (men)", score: 0 }, { label: "80-88cm / 94-102cm", score: 1 }, { label: "88-100cm / 102-110cm", score: 2 }, { label: "Over 100cm / 110cm", score: 3 }] },
  { question: "Do you have high blood pressure?", options: [{ label: "Normal (<120/80)", score: 0 }, { label: "Slightly elevated", score: 1 }, { label: "On medication", score: 2 }, { label: "Uncontrolled", score: 3 }] },
  { question: "What are your triglyceride levels?", options: [{ label: "Normal (<150)", score: 0 }, { label: "Borderline (150-199)", score: 1 }, { label: "High (200-499)", score: 2 }, { label: "Very high or unknown", score: 3 }] },
  { question: "How is your HDL (good) cholesterol?", options: [{ label: "Optimal (>60)", score: 0 }, { label: "Good (40-60)", score: 1 }, { label: "Low (<40)", score: 2 }, { label: "Unknown", score: 3 }] },
  { question: "What is your fasting blood sugar?", options: [{ label: "Normal (<100)", score: 0 }, { label: "Slightly elevated (100-110)", score: 1 }, { label: "Prediabetic (110-125)", score: 2 }, { label: "High (>125) or unknown", score: 3 }] },
];

export default function LeadMagnet() {
  const [magnetType, setMagnetType] = useState<MagnetType | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const registerLead = trpc.leads.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Your results are ready!");
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  useEffect(() => {
    document.title = "Free Health Assessments | Feel Great";
  }, []);

  const getQuestions = (): QuizQuestion[] => {
    if (magnetType === "insulin-assessment") return insulinQuestions;
    if (magnetType === "health-score") return healthScoreQuestions;
    if (magnetType === "metabolic-quiz") return metabolicQuestions;
    return [];
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    const questions = getQuestions();
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("capture");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const source = magnetType === "guide" ? "guide-download" : `${magnetType}-score-${totalScore}`;
    registerLead.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: "Unknown",
      source,
    });
  };

  const getResultContent = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = getQuestions().length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let level: string, color: string, message: string, recommendation: string;
    if (percentage <= 25) {
      level = "Low Risk"; color = "text-green-400"; message = "Your results look good!"; recommendation = "Maintain your healthy habits and consider the Feel Great system for optimization.";
    } else if (percentage <= 50) {
      level = "Moderate Risk"; color = "text-amber-400"; message = "There are areas for improvement."; recommendation = "The Feel Great system could significantly help. A consultation with Feras would provide personalized guidance.";
    } else if (percentage <= 75) {
      level = "Elevated Risk"; color = "text-orange-400"; message = "Several indicators suggest action is needed."; recommendation = "We strongly recommend a free consultation with Feras to discuss a personalized health strategy.";
    } else {
      level = "High Risk"; color = "text-red-400"; message = "Multiple risk factors detected."; recommendation = "Please book a consultation with Feras immediately. Early intervention can make a significant difference.";
    }

    return { totalScore, maxScore, percentage, level, color, message, recommendation };
  };

  const renderSelect = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-6 inline-block">Feel Great</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Health Assessments</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover your health status with our evidence-based assessments. Get personalized recommendations in under 3 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Insulin Assessment */}
          <button onClick={() => { setMagnetType("insulin-assessment"); setStep("quiz"); }} className="text-left bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-red-400/10 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Insulin Resistance Assessment</h3>
            <p className="text-slate-400 text-sm mb-4">7 questions to evaluate your insulin resistance risk. Over 40% of adults have it without knowing.</p>
            <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">Take Assessment <ArrowRight className="w-4 h-4" /></span>
          </button>

          {/* Health Score */}
          <button onClick={() => { setMagnetType("health-score"); setStep("quiz"); }} className="text-left bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-green-400/10 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainable Health Score</h3>
            <p className="text-slate-400 text-sm mb-4">6 questions to measure your overall health sustainability. Get your personalized score.</p>
            <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">Get Your Score <ArrowRight className="w-4 h-4" /></span>
          </button>

          {/* Metabolic Quiz */}
          <button onClick={() => { setMagnetType("metabolic-quiz"); setStep("quiz"); }} className="text-left bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Metabolic Health Quiz</h3>
            <p className="text-slate-400 text-sm mb-4">5 key metabolic markers that determine your metabolic syndrome risk. Know your numbers.</p>
            <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">Take Quiz <ArrowRight className="w-4 h-4" /></span>
          </button>

          {/* Free Guide */}
          <button onClick={() => { setMagnetType("guide"); setStep("capture"); }} className="text-left bg-gradient-to-br from-amber-400/10 to-amber-500/5 border border-amber-400/30 rounded-2xl p-8 hover:border-amber-400/50 transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-4">
              <Download className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Free Guide: 7 Hidden Signs</h3>
            <p className="text-slate-400 text-sm mb-4">"7 Hidden Signs Of Insulin Resistance" — Learn the warning signs most people miss.</p>
            <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">Download Free <ArrowRight className="w-4 h-4" /></span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const questions = getQuestions();
    const q = questions[currentQ];
    const titles: Record<string, string> = {
      "insulin-assessment": "Insulin Resistance Assessment",
      "health-score": "Sustainable Health Score",
      "metabolic-quiz": "Metabolic Health Quiz",
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-4 inline-block">Feel Great</Link>
            <h1 className="text-2xl font-bold mb-2">{titles[magnetType!]}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <span>Question {currentQ + 1} of {questions.length}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left p-4 bg-slate-700/30 border border-slate-600 rounded-xl hover:border-amber-400/50 hover:bg-slate-700/50 transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCapture = () => {
    if (submitted) return renderResult();

    const titles: Record<string, string> = {
      "insulin-assessment": "Get Your Insulin Resistance Results",
      "health-score": "Get Your Health Score",
      "metabolic-quiz": "Get Your Metabolic Health Results",
      "guide": "Download: 7 Hidden Signs Of Insulin Resistance",
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-4 inline-block">Feel Great</Link>
            {magnetType !== "guide" && (
              <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2">{titles[magnetType!]}</h1>
            <p className="text-slate-400">
              {magnetType === "guide"
                ? "Enter your details below to receive the free guide instantly."
                : "Enter your details to unlock your personalized results and recommendations."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <button
              type="submit"
              disabled={registerLead.isPending}
              className="w-full px-6 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {registerLead.isPending ? "Processing..." : magnetType === "guide" ? "Download Free Guide" : "Get My Results"}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Your information is secure and will never be shared. By submitting, you agree to receive health tips from Feras Alayed.
            </p>
          </form>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (magnetType === "guide") {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-6 inline-block">Feel Great</Link>
            <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Guide Is Ready!</h1>
            <p className="text-slate-300 mb-8">Check your email for "7 Hidden Signs Of Insulin Resistance" by Feras Alayed.</p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-left mb-8">
              <h3 className="font-bold text-lg mb-4">In this guide, you'll discover:</h3>
              <ul className="space-y-3">
                {[
                  "The #1 hidden sign that 40% of adults miss",
                  "Why fatigue after meals is more than just tiredness",
                  "The skin change that signals insulin resistance",
                  "How cravings reveal your metabolic health",
                  "The belly fat connection most doctors don't explain",
                  "Simple lifestyle changes that reverse insulin resistance",
                  "The 4-4-12 method that transforms metabolic health",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Link href="/health-assessment" className="block w-full px-6 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors">
                Take the Full Health Assessment
              </Link>
              <a href="https://wa.me/96877020770?text=I%20downloaded%20the%20insulin%20resistance%20guide%20and%20would%20like%20to%20learn%20more" target="_blank" rel="noopener noreferrer" className="block w-full px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
                Chat with Feras on WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
    }

    const result = getResultContent();
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-6 inline-block">Feel Great</Link>
            <h1 className="text-3xl font-bold mb-2">Your Results</h1>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8">
            {/* Score */}
            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-700" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className={result.color} strokeDasharray={`${result.percentage * 3.14} 314`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{result.totalScore}/{result.maxScore}</span>
                </div>
              </div>
              <p className={`text-xl font-bold ${result.color}`}>{result.level}</p>
              <p className="text-slate-400 mt-2">{result.message}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-700/30 rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-400" /> Personalized Recommendation
              </h3>
              <p className="text-slate-300">{result.recommendation}</p>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/96877020770?text=I%20took%20the%20${magnetType}%20(score%3A%20${result.totalScore}/${result.maxScore})%20and%20would%20like%20a%20free%20consultation`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors text-center"
              >
                Book Free Consultation via WhatsApp
              </a>
              <Link href="/topics/insulin-resistance" className="block w-full px-6 py-4 border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 transition-colors text-center">
                Learn More About Insulin Resistance
              </Link>
              <button
                onClick={() => { setStep("select"); setMagnetType(null); setCurrentQ(0); setAnswers([]); setSubmitted(false); }}
                className="block w-full text-center text-slate-400 hover:text-white text-sm transition-colors"
              >
                Take Another Assessment
              </button>
            </div>
          </div>

          <p className="text-center text-slate-500 text-xs">
            *This assessment is for educational purposes only and does not constitute medical advice. Please consult your healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    );
  };

  if (step === "select") return renderSelect();
  if (step === "quiz") return renderQuiz();
  if (step === "capture" || step === "result") return renderCapture();
  return renderSelect();
}
