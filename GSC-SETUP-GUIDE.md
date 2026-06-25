# دليل تسجيل موقعك في Google Search Console

## ما هو Google Search Console؟

Google Search Console هو أداة مجانية من Google تتيح لك مراقبة أداء موقعك في نتائج البحث، ومعرفة أي مشاكل فنية، وتسريع فهرسة صفحاتك الجديدة.

---

## الخطوة 1: إنشاء حساب Google Search Console

### 1.1 الذهاب إلى Google Search Console

افتح المتصفح وانتقل إلى:
```
https://search.google.com/search-console
```

ستحتاج لتسجيل الدخول بحساب Google. إذا لم يكن لديك حساب، أنشئ واحداً جديداً على:
```
https://accounts.google.com
```

### 1.2 إضافة موقعك

سترى صفحة بها خياران:

**الخيار الأول (موصى به):** Domain
- اكتب: `feelgreat.us.com`
- هذا الخيار يضيف جميع النطاقات الفرعية

**الخيار الثاني:** URL Prefix
- اكتب: `https://feelgreat.us.com`
- هذا الخيار يضيف فقط هذا الرابط المحدد

**التوصية:** اختر الخيار الثاني (URL Prefix) لأنه أكثر أماناً وأسهل في التحقق.

---

## الخطوة 2: التحقق منownership الموقع

Google يحتاج للتأكد bahwa أنت pemilik الموقع. هناك 4 طرق للتحقق:

### الطريقة 1: ملف HTML (الأسهل)

1. سينبثق لك مربع به ملف HTML للتحقق
2. حمّل الملف الذي يبدأ بـ `google-site-verification.html`
3. ارفعه إلى مجلد `public` في مشروعك
4. تأكد من رفعه إلى GitHub وانتظر البناء التلقائي
5. اضغط على "Verify"

### الطريقة 2: تسجيل DNS (للمتقدمين)

إذا كان لديك حق الوصول لإعدادات DNS:

1. اختر طريقة "HTML tag"
2. انسخ كود Meta الذي يظهر لك
3. أضفه إلى وسم `<head>` في ملف `index.html` الرئيسي
4. هذه الطريقة دائمة ولا تحتاج تجديد

### الطريقة 3: Google Analytics

إذا كان موقعك يستخدم Google Analytics:
```
أضف كود التحقق في إعدادات GA
```

### الطريقة 4: Google Tag Manager

إذا كنت تستخدم GTM:
```
أضف كود التحقق في حاوية GTM
```

---

## الخطوة 3: إرسال Sitemap

### 3.1 بعد التحقق الناجح

ستنتقل إلى لوحة تحكم الموقع.

### 3.2 الذهاب إلى قسم Sitemaps

في القائمة الجانبية اليسرى، اضغط على:
```
Crawl (أو الزحف) ← Sitemaps (خرائط المواقع)
```

### 3.3 إضافة Sitemap

في حقل "Add a sitemap":
```
sitemap.xml
```

اضغط Enter أو اضغط على "Submit"

### 3.4 انتظر الفحص

- Google سيقوم بفحص الـ sitemap
- قد يستغرق ذلك من بضع دقائق إلى 48 ساعة
- سترى حالة "Success" عندما يتم قبوله

---

## الخطوة 4: ربط Google Analytics (اختياري)

لربط البيانات بين Search Console و Analytics:

1. افتح Google Analytics
2. اذهب إلى: Admin ← Property Settings
3. فعّل "Search Console Sync"
4. اختر موقعك من القائمة

---

## الخطوة 5: مراقبة الأداء

### 5.1 لوحة Performance

في القائمة الجانبية، اضغط على "Performance" لمشاهدة:

- **الانطباعات (Impressions):** عدد مرات ظهور صفحاتك في النتائج
- **النقرات (Clicks):** عدد النقرات على موقعك
- **معدل النقر (CTR):** نسبة الذين ضغطوا من الذين رأوا
- **الموضع (Position):** متوسط ترتيبك لكلمة مفتاحية

### 5.2 تقرير Index Coverage

يظهر لك:
- الصفحات المفهرسة ✓
- الصفحات المرفوضة
- الصفحات الجديدة
- أي أخطاء تحتاج إصلاح

### 5.3 تقرير URL Inspection

للتأكد من فهرسة صفحة معينة:
1. اذهب إلى "URL Inspection"
2. الصق رابط الصفحة
3. اضغط "Test Live URL"

---

## نصائح مهمة بعد التسجيل

### 1. انتظر البناء التلقائي

تأكد أن GitHub Actions أكمل بناء الموقع الجديد:
1. اذهب إلى: `https://github.com/ferasayed/Feelgreat-new/actions`
2. تأكد من أن آخر Build انتهى بنجاح (علامة ✓ خضراء)

### 2. اختبار Sitemap

بعد البناء، اختبر الرابط:
```
https://feelgreat.us.com/sitemap.xml
```

يجب أن ترى ملف XML يحتوي على جميع صفحاتك.

### 3. اختبار Robots.txt

اختبر الرابط:
```
https://feelgreat.us.com/robots.txt
```

### 4. طلب الفهرسة اليدوية

بعد إرسال Sitemap، يمكنك طلب فهرسة سريعة:

1. اذهب إلى "URL Inspection"
2. الصق: `https://feelgreat.us.com/`
3. اضغط "Request Indexing"

---

## الأسئلة الشائعة

### كم يستغرق الوقت؟

- **Sitemap:** من بضع دقائق إلى 48 ساعة
- **فهرسة الصفحات الجديدة:** من أيام إلى أسابيع
- **للمسار السريع:** استخدم "Request Indexing" بعد إرسال Sitemap

### ماذا لو فشل التحقق؟

1. تأكد من رفع الملف بشكل صحيح
2. تأكد من أن الرابط يعمل: `https://feelgreat.us.com/google-site-verification.html`
3. انتظر بضع دقائق ثم حاول مرة أخرى
4. إذا استمرت المشكلة، جرب طريقة أخرى (Meta tag)

### هل أحتاج لتحديث Sitemap؟

**نعم!** في كل مرة تضيف مقال جديد:
1. أضف الصفحة يدوياً في `sitemap.xml`
2. ارفع التعديلات إلى GitHub
3. عد لـ Search Console وأرسل Sitemap مرة أخرى

### هل يمكنني تتبع موقع www و non-www؟

**نعم، وهذه التوصية:**
1. أضف الإصدارين: `https://feelgreat.us.com` و `https://www.feelgreat.us.com`
2. اختر أحدهم كـ "Preferred Domain" في الإعدادات
3. Google سيعالج التحويل تلقائياً

---

## الروابط المهمة

- Google Search Console: https://search.google.com/search-console
- مركز مساعدة Google: https://support.google.com/webmasters/
- أداة فحص URL: https://search.google.com/search-console/inspect

---

## ملخص الخطوات السريعة

```
✓ سجل في Google Search Console
✓ اختر URL Prefix وأضف: https://feelgreat.us.com
✓ تحقق من Ownership (أسهل طريقة: ملف HTML)
✓ اذهب إلى Sitemaps وأرسل: sitemap.xml
✓ انتظر الفحص (24-48 ساعة)
✓ راقب الأداء في لوحة Performance
✓ اطلب فهرسة يدوية للصفحة الرئيسية
```
