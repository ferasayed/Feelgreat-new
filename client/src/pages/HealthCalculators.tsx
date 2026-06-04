import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Heart, Activity, Brain, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Phone } from "lucide-react";
import { Link } from "wouter";

function BMICalculator() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmi = w / (h * h);
    let category = '';
    let color = '';
    if (bmi < 18.5) { category = isAr ? 'نقص الوزن' : 'Underweight'; color = 'text-blue-400'; }
    else if (bmi < 25) { category = isAr ? 'وزن طبيعي' : 'Normal Weight'; color = 'text-green-400'; }
    else if (bmi < 30) { category = isAr ? 'زيادة في الوزن' : 'Overweight'; color = 'text-amber-400'; }
    else if (bmi < 35) { category = isAr ? 'سمنة درجة أولى' : 'Obesity Class I'; color = 'text-orange-400'; }
    else if (bmi < 40) { category = isAr ? 'سمنة درجة ثانية' : 'Obesity Class II'; color = 'text-red-400'; }
    else { category = isAr ? 'سمنة مفرطة' : 'Obesity Class III'; color = 'text-red-600'; }
    setResult({ bmi, category, color });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-400" />
          </div>
          {isAr ? 'حاسبة مؤشر كتلة الجسم (BMI)' : 'Body Mass Index (BMI) Calculator'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/70 text-sm">
          {isAr ? 'مؤشر كتلة الجسم هو مقياس بسيط يستخدم الطول والوزن لتقييم ما إذا كان وزنك صحياً.' : 'BMI is a simple measure using height and weight to assess whether your weight is healthy.'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
            <Input
              type="number"
              placeholder={isAr ? '75' : '75'}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'الطول (سم)' : 'Height (cm)'}</label>
            <Input
              type="number"
              placeholder={isAr ? '170' : '170'}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </div>
        <Button onClick={calculate} className="w-full gradient-gold text-foreground font-bold">
          {isAr ? 'احسب' : 'Calculate'}
        </Button>
        {result && (
          <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-center">
            <div className="text-3xl font-bold text-white mb-1">{result.bmi.toFixed(1)}</div>
            <div className={`text-lg font-semibold ${result.color}`}>{result.category}</div>
            <div className="mt-3 text-white/60 text-sm">
              {result.bmi >= 25 && (isAr
                ? 'نوصي بإجراء تقييم صحي شامل لتحديد أفضل خطة لك.'
                : 'We recommend a comprehensive health assessment to determine the best plan for you.'
              )}
              {result.bmi < 25 && result.bmi >= 18.5 && (isAr
                ? 'وزنك في النطاق الصحي. حافظ على نمط حياتك المتوازن!'
                : 'Your weight is in the healthy range. Keep up your balanced lifestyle!'
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InsulinResistanceCalculator() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const questions = isAr ? [
    { id: 'waist', q: 'هل محيط خصرك أكبر من 88 سم (نساء) أو 102 سم (رجال)؟', options: ['نعم', 'لا'] },
    { id: 'fatigue', q: 'هل تشعر بالتعب بعد الوجبات؟', options: ['دائماً', 'أحياناً', 'نادراً'] },
    { id: 'cravings', q: 'هل تشتهي السكريات أو الكربوهيدرات بشكل متكرر؟', options: ['نعم بشدة', 'أحياناً', 'لا'] },
    { id: 'skin', q: 'هل لديك بقع داكنة على الرقبة أو الإبطين (Acanthosis Nigricans)؟', options: ['نعم', 'لا'] },
    { id: 'weight', q: 'هل تجد صعوبة في فقدان الوزن رغم الحمية والرياضة؟', options: ['نعم', 'إلى حد ما', 'لا'] },
    { id: 'family', q: 'هل لديك تاريخ عائلي مع السكري أو مقاومة الأنسولين؟', options: ['نعم', 'لا أعرف', 'لا'] },
    { id: 'sleep', q: 'هل تعاني من اضطرابات النوم أو الشخير؟', options: ['نعم', 'أحياناً', 'لا'] },
    { id: 'thirst', q: 'هل تشعر بالعطش المتكرر أو كثرة التبول؟', options: ['نعم', 'أحياناً', 'لا'] },
  ] : [
    { id: 'waist', q: 'Is your waist circumference greater than 35 inches (women) or 40 inches (men)?', options: ['Yes', 'No'] },
    { id: 'fatigue', q: 'Do you feel tired after meals?', options: ['Always', 'Sometimes', 'Rarely'] },
    { id: 'cravings', q: 'Do you frequently crave sugar or carbohydrates?', options: ['Yes, strongly', 'Sometimes', 'No'] },
    { id: 'skin', q: 'Do you have dark patches on your neck or armpits (Acanthosis Nigricans)?', options: ['Yes', 'No'] },
    { id: 'weight', q: 'Do you find it difficult to lose weight despite diet and exercise?', options: ['Yes', 'Somewhat', 'No'] },
    { id: 'family', q: 'Do you have a family history of diabetes or insulin resistance?', options: ['Yes', 'Not sure', 'No'] },
    { id: 'sleep', q: 'Do you suffer from sleep disturbances or snoring?', options: ['Yes', 'Sometimes', 'No'] },
    { id: 'thirst', q: 'Do you experience frequent thirst or urination?', options: ['Yes', 'Sometimes', 'No'] },
  ];

  const calculateScore = () => {
    let s = 0;
    Object.entries(answers).forEach(([id, val]) => {
      const q = questions.find(q => q.id === id);
      if (!q) return;
      const idx = q.options.indexOf(val);
      if (q.options.length === 2) {
        s += idx === 0 ? 3 : 0;
      } else {
        s += idx === 0 ? 3 : idx === 1 ? 1.5 : 0;
      }
    });
    setScore(s);
  };

  const getRiskLevel = () => {
    if (score === null) return null;
    if (score <= 6) return { level: isAr ? 'خطر منخفض' : 'Low Risk', color: 'text-green-400', icon: CheckCircle, desc: isAr ? 'مؤشراتك جيدة. استمر في نمط حياتك الصحي.' : 'Your indicators are good. Keep up your healthy lifestyle.' };
    if (score <= 14) return { level: isAr ? 'خطر متوسط' : 'Moderate Risk', color: 'text-amber-400', icon: AlertTriangle, desc: isAr ? 'هناك بعض المؤشرات التي تستحق الانتباه. ننصح بإجراء فحوصات.' : 'There are some indicators worth paying attention to. We recommend getting tested.' };
    return { level: isAr ? 'خطر مرتفع' : 'High Risk', color: 'text-red-400', icon: AlertTriangle, desc: isAr ? 'مؤشراتك تدل على احتمالية عالية لمقاومة الأنسولين. ننصح بشدة بالتواصل مع متخصص.' : 'Your indicators suggest a high probability of insulin resistance. We strongly recommend consulting a specialist.' };
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          {isAr ? 'تقييم مقاومة الأنسولين' : 'Insulin Resistance Risk Assessment'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/70 text-sm">
          {isAr ? 'أجب على الأسئلة التالية لتقييم مستوى خطر مقاومة الأنسولين لديك. هذا ليس تشخيصاً طبياً.' : 'Answer the following questions to assess your insulin resistance risk level. This is not a medical diagnosis.'}
        </p>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-white/90 text-sm mb-2">{i + 1}. {q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all ${answers[q.id] === opt ? 'bg-amber-500/30 border-amber-400/50 text-amber-300' : 'bg-slate-600/30 border-slate-500/30 text-white/70 hover:bg-slate-600/50'} border`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={calculateScore}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full gradient-gold text-foreground font-bold"
        >
          {isAr ? 'احسب مستوى الخطر' : 'Calculate Risk Level'}
        </Button>
        {score !== null && (() => {
          const risk = getRiskLevel();
          if (!risk) return null;
          const Icon = risk.icon;
          return (
            <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-center space-y-3">
              <Icon className={`w-10 h-10 mx-auto ${risk.color}`} />
              <div className={`text-xl font-bold ${risk.color}`}>{risk.level}</div>
              <div className="text-2xl font-bold text-white">{score.toFixed(0)} / 24</div>
              <p className="text-white/70 text-sm">{risk.desc}</p>
              {score > 6 && (
                <Link href="/health-assessment">
                  <Button className="mt-2 gradient-gold text-foreground font-bold">
                    {isAr ? 'احجز استشارة مجانية' : 'Book a Free Consultation'}
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              )}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}

function MetabolicAgeCalculator() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [age, setAge] = useState('');
  const [exercise, setExercise] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');
  const [diet, setDiet] = useState('');
  const [smoking, setSmoking] = useState('');
  const [result, setResult] = useState<{ metabolicAge: number; diff: number } | null>(null);

  const calculate = () => {
    const realAge = parseInt(age);
    if (!realAge) return;

    let modifier = 0;
    // Exercise impact
    if (exercise === 'none') modifier += 5;
    else if (exercise === 'light') modifier += 2;
    else if (exercise === 'moderate') modifier -= 2;
    else if (exercise === 'heavy') modifier -= 4;

    // Sleep impact
    if (sleep === 'poor') modifier += 4;
    else if (sleep === 'fair') modifier += 1;
    else if (sleep === 'good') modifier -= 2;

    // Stress impact
    if (stress === 'high') modifier += 4;
    else if (stress === 'moderate') modifier += 1;
    else if (stress === 'low') modifier -= 2;

    // Diet impact
    if (diet === 'poor') modifier += 5;
    else if (diet === 'average') modifier += 1;
    else if (diet === 'good') modifier -= 3;

    // Smoking
    if (smoking === 'yes') modifier += 6;
    else if (smoking === 'former') modifier += 2;

    const metabolicAge = Math.max(18, Math.round(realAge + modifier));
    setResult({ metabolicAge, diff: metabolicAge - realAge });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          {isAr ? 'حاسبة العمر الأيضي' : 'Metabolic Age Calculator'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/70 text-sm">
          {isAr ? 'العمر الأيضي يعكس حالة جسمك الحقيقية بناءً على نمط حياتك. قد يكون أكبر أو أصغر من عمرك الفعلي.' : 'Metabolic age reflects your body\'s true condition based on your lifestyle. It may be older or younger than your actual age.'}
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'العمر الحقيقي' : 'Actual Age'}</label>
            <Input type="number" placeholder="40" value={age} onChange={(e) => setAge(e.target.value)} className="bg-slate-700/50 border-slate-600 text-white" />
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'مستوى النشاط البدني' : 'Physical Activity Level'}</label>
            <Select value={exercise} onValueChange={setExercise}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder={isAr ? 'اختر...' : 'Select...'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{isAr ? 'لا أمارس الرياضة' : 'No exercise'}</SelectItem>
                <SelectItem value="light">{isAr ? 'خفيف (1-2 مرات/أسبوع)' : 'Light (1-2 times/week)'}</SelectItem>
                <SelectItem value="moderate">{isAr ? 'معتدل (3-4 مرات/أسبوع)' : 'Moderate (3-4 times/week)'}</SelectItem>
                <SelectItem value="heavy">{isAr ? 'مكثف (5+ مرات/أسبوع)' : 'Intense (5+ times/week)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'جودة النوم' : 'Sleep Quality'}</label>
            <Select value={sleep} onValueChange={setSleep}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder={isAr ? 'اختر...' : 'Select...'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">{isAr ? 'سيئة (أقل من 5 ساعات)' : 'Poor (less than 5 hours)'}</SelectItem>
                <SelectItem value="fair">{isAr ? 'متوسطة (5-6 ساعات)' : 'Fair (5-6 hours)'}</SelectItem>
                <SelectItem value="good">{isAr ? 'جيدة (7-8 ساعات)' : 'Good (7-8 hours)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'مستوى التوتر' : 'Stress Level'}</label>
            <Select value={stress} onValueChange={setStress}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder={isAr ? 'اختر...' : 'Select...'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">{isAr ? 'مرتفع' : 'High'}</SelectItem>
                <SelectItem value="moderate">{isAr ? 'معتدل' : 'Moderate'}</SelectItem>
                <SelectItem value="low">{isAr ? 'منخفض' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'جودة التغذية' : 'Diet Quality'}</label>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder={isAr ? 'اختر...' : 'Select...'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">{isAr ? 'سيئة (وجبات سريعة، سكريات)' : 'Poor (fast food, sugars)'}</SelectItem>
                <SelectItem value="average">{isAr ? 'متوسطة' : 'Average'}</SelectItem>
                <SelectItem value="good">{isAr ? 'جيدة (متوازنة، خضروات، بروتين)' : 'Good (balanced, vegetables, protein)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">{isAr ? 'التدخين' : 'Smoking'}</label>
            <Select value={smoking} onValueChange={setSmoking}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder={isAr ? 'اختر...' : 'Select...'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">{isAr ? 'نعم، أدخن' : 'Yes, I smoke'}</SelectItem>
                <SelectItem value="former">{isAr ? 'مدخن سابق' : 'Former smoker'}</SelectItem>
                <SelectItem value="no">{isAr ? 'لا أدخن' : 'Non-smoker'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={calculate} disabled={!age || !exercise || !sleep || !stress || !diet || !smoking} className="w-full gradient-gold text-foreground font-bold">
          {isAr ? 'احسب عمري الأيضي' : 'Calculate My Metabolic Age'}
        </Button>
        {result && (
          <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-center space-y-2">
            <div className="text-sm text-white/60">{isAr ? 'عمرك الأيضي التقديري' : 'Your Estimated Metabolic Age'}</div>
            <div className={`text-4xl font-bold ${result.diff > 3 ? 'text-red-400' : result.diff < -2 ? 'text-green-400' : 'text-amber-400'}`}>
              {result.metabolicAge} {isAr ? 'سنة' : 'years'}
            </div>
            <div className="text-white/70 text-sm">
              {result.diff > 3 && (isAr
                ? `عمرك الأيضي أكبر من عمرك الحقيقي بـ ${result.diff} سنوات. هذا يعني أن جسمك يتقدم في العمر أسرع مما ينبغي.`
                : `Your metabolic age is ${result.diff} years older than your actual age. This means your body is aging faster than it should.`
              )}
              {result.diff <= 3 && result.diff >= -2 && (isAr
                ? 'عمرك الأيضي قريب من عمرك الحقيقي. يمكنك تحسينه بتغييرات بسيطة.'
                : 'Your metabolic age is close to your actual age. You can improve it with simple changes.'
              )}
              {result.diff < -2 && (isAr
                ? `ممتاز! عمرك الأيضي أصغر من عمرك الحقيقي بـ ${Math.abs(result.diff)} سنوات. استمر!`
                : `Excellent! Your metabolic age is ${Math.abs(result.diff)} years younger than your actual age. Keep it up!`
              )}
            </div>
            {result.diff > 0 && (
              <Link href="/health-assessment">
                <Button className="mt-3 gradient-gold text-foreground font-bold">
                  {isAr ? 'احصل على خطة تحسين مخصصة' : 'Get a Personalized Improvement Plan'}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HealthCalculators() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">
            <Calculator className="w-4 h-4" />
            {isAr ? 'أدوات صحية مجانية' : 'Free Health Tools'}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {isAr ? 'حاسبات صحية مجانية' : 'Free Health Calculators'}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {isAr
              ? 'استخدم أدواتنا المجانية لتقييم صحتك. اكتشف مؤشر كتلة جسمك، مستوى خطر مقاومة الأنسولين، وعمرك الأيضي الحقيقي.'
              : 'Use our free tools to assess your health. Discover your BMI, insulin resistance risk level, and your true metabolic age.'
            }
          </p>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="pb-16 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <BMICalculator />
            <MetabolicAgeCalculator />
          </div>
          <div className="mt-6">
            <InsulinResistanceCalculator />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-4">
        <div className="container max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-amber-500/10 to-blue-500/10 border-amber-500/20">
            <CardContent className="p-8 text-center space-y-4">
              <Heart className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">
                {isAr ? 'هل تريد خطة صحية مخصصة لك؟' : 'Want a Personalized Health Plan?'}
              </h2>
              <p className="text-white/70">
                {isAr
                  ? 'الحاسبات تعطيك فكرة عامة. للحصول على تقييم دقيق وخطة مخصصة، احجز استشارة مجانية مع فراس.'
                  : 'Calculators give you a general idea. For an accurate assessment and personalized plan, book a free consultation with Feras.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/health-assessment">
                  <Button className="gradient-gold text-foreground font-bold px-6 py-5">
                    {isAr ? 'احجز استشارة مجانية' : 'Book a Free Consultation'}
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-green-400/50 text-green-300 hover:bg-green-500/10 px-6 py-5">
                    <Phone className="w-4 h-4 me-2" />
                    {isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEO Content */}
      <section className="pb-20 px-4">
        <div className="container max-w-3xl mx-auto prose prose-invert prose-sm">
          <h2 className="text-xl font-bold text-white mb-4">
            {isAr ? 'لماذا هذه الحاسبات مهمة؟' : 'Why Are These Calculators Important?'}
          </h2>
          {isAr ? (
            <div className="text-white/70 space-y-3">
              <p>مؤشر كتلة الجسم (BMI) هو أداة فحص بسيطة تساعدك على فهم ما إذا كان وزنك في النطاق الصحي. لكنه ليس المقياس الوحيد - فالعمر الأيضي ومقاومة الأنسولين يعطيان صورة أشمل عن صحتك الحقيقية.</p>
              <p>مقاومة الأنسولين هي حالة صامتة تؤثر على ملايين الأشخاص دون أن يعرفوا. يمكن أن تؤدي إلى السكري من النوع الثاني، أمراض القلب، وزيادة الوزن المستمرة. التقييم المبكر يمكن أن يغير مسار صحتك بالكامل.</p>
              <p>العمر الأيضي يعكس كيف يعمل جسمك فعلياً مقارنة بعمرك الزمني. نمط الحياة الصحي يمكن أن يجعل عمرك الأيضي أصغر بسنوات من عمرك الحقيقي.</p>
            </div>
          ) : (
            <div className="text-white/70 space-y-3">
              <p>Body Mass Index (BMI) is a simple screening tool that helps you understand whether your weight is in a healthy range. But it's not the only measure - metabolic age and insulin resistance give a more comprehensive picture of your true health.</p>
              <p>Insulin resistance is a silent condition affecting millions of people without their knowledge. It can lead to type 2 diabetes, heart disease, and persistent weight gain. Early assessment can completely change the course of your health.</p>
              <p>Metabolic age reflects how your body actually functions compared to your chronological age. A healthy lifestyle can make your metabolic age years younger than your actual age.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
