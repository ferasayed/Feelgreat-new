# Manus - GEO Implementation Prompt

## المهمة

تم رفع تحديثات GEO (Generative Engine Optimization) على GitHub. المطلوب منك هو:

1. **تطبيق هذه التحديثات على الموقع**
2. **إضافة زر "مقالات عالمية" في القائمة**
3. **إضافة صفحات المقارنة في القائمة**

---

## الملفات الجديدة على GitHub

### 1. صفحة AI Information (`/ai`)
- **الملف**: `client/src/pages/AIPage.tsx`
- **الراوت**: `/ai` و `/ai-info`
- **الغرض**: صفحة خاصة محسّنة للذكاء الاصطناعي (ChatGPT, Gemini, Claude)
- **المحتوى**:
  - معلومات الشركة
  - تفاصيل المنتجات (Unimate, Balance)
  - FAQ Schema (للظهور في AI)
  - إحصائيات صحية
  - روابط للمقارنة

### 2. صفحات المقارنة (`/compare`)
- **الملف**: `client/src/pages/ComparisonPages.tsx`
- **الراوت**: `/compare` و `/compare/:slug`
- **المحتوى**:
  - `unimate-vs-coffee` - Unimate vs Coffee
  - `balance-vs-fiber` - Balance vs Other Fiber
  - `feel-great-vs-diets` - Feel Great vs Diets
  - `insulin-resistance-supplements` - Best Supplements

### 3. robots.txt محدث
- **الملف**: `client/public/robots.txt`
- **التحديثات**:
  - تم إضافة دعم لـ GPTBot, ClaudeBot, PerplexityBot, Google-Extended
  - تم إضافة Allow للصفحات الجديدة

### 4. sitemap.xml محدث
- **الملف**: `client/public/sitemap.xml`
- **تم إضافة**:
  - `/ai` و `/ai-info`
  - `/compare` وجميع صفحات المقارنة

---

## المطلوب من Manus

### 1. تطبيق الملفات من GitHub
```bash
git pull origin main
```

### 2. إضافة زر "مقالات عالمية" في القائمة
أضف زر جديد في Navbar مع هذه الروابط:
- `/global-articles` - القائمة الرئيسية
- `/global-articles/canadian` - كندي
- `/global-articles/american` - أمريكي
- `/global-articles/german` - ألماني
- `/global-articles/european` - أوروبي

### 3. إضافة رابط "مقارنة" في القائمة
أضف رابط في القائمة:
- `/compare` - صفحة المقارنات

### 4. تحديث Navbar
أضف هذا الكود في القائمة (النافيجيشن):

```tsx
// أضف في القائمة الرئيسية
<a href="/global-articles" className="...">
  {lang === "ar" ? "مقالات عالمية" : "Global Articles"}
</a>

<a href="/compare" className="...">
  {lang === "ar" ? "مقارنة" : "Compare"}
</a>
```

### 5. إضافة Global Articles Page
صفحة جديدة تعرض 4 أقسام:
- 🇨🇦 Canadian (كندي) - 5 مقالات
- 🇺🇸 American (أمريكي) - 10 مقالات
- 🇩🇪 German (ألماني) - 5 مقالات
- 🇪🇺 European (أوروبي) - 10 مقالات

رابط المقالات: `MANUS-COMPLETE-ARTICLES-PROMPT.md`

### 6. تحديث sitemap.xml
تأكد من إضافة جميع الصفحات الجديدة

---

## ملخص التغييرات

```
GitHub Commit: 7dafcdb

Files to pull:
├── client/src/pages/AIPage.tsx          (NEW)
├── client/src/pages/ComparisonPages.tsx (NEW)
├── client/src/App.tsx                   (UPDATED - routes added)
├── client/public/robots.txt             (UPDATED - AI crawlers)
└── client/public/sitemap.xml           (UPDATED - new pages)
```

---

## الأفعال المطلوبة

1. ✅ git pull من GitHub
2. ✅ إضافة Routes جديدة في App.tsx (إذا لم تكن موجودة)
3. ✅ إضافة زر "مقالات عالمية" في Navbar
4. ✅ إضافة رابط "مقارنة" في Navbar
5. ✅ إنشاء صفحة Global Articles
6. ✅ التأكد من عمل جميع الصفحات الجديدة
7. ✅ git push بعد التعديلات

---

## ملاحظة مهمة

التحديثات جاهزة على GitHub. المطلوب منك فقط:
1. سحب التحديثات
2. إضافة الأزرار في القائمة
3. رفع التغييرات

---

## GitHub URL

https://github.com/ferasayed/Feelgreat-new
