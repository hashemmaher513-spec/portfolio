# 🚀 دليل النشر السحابي (Deployment Guide)
### نشر بورتفوليو هاشم ماهر على منصة Vercel مع MongoDB Atlas و Cloudinary

---

## 📋 المتطلبات السحابية (Cloud Requirements)
1. **حساب GitHub:** لرفع كود المشروع إليه.
2. **حساب Vercel (مجاني):** لاستضافة تطبيق Next.js 16.
3. **قاعدة بيانات MongoDB Atlas:** قاعدة بيانات سحابية (مُجهزة ومُتصلة بالفعل).
4. **حساب Cloudinary:** لتخزين صور وفيديوهات المشاريع (مُجهز ومُتصل بالفعل).

---

## 🛠️ خطوات النشر خطوة بخطوة

### 1. رفع المشروع إلى GitHub
قم بإنشاء مستودع جديد خاص أو عام على حسابك في GitHub، ثم نفذ الأوامر التالية من المجلد الرئيسي للمشروع:
```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

---

### 2. الربط مع Vercel
1. سجّل الدخول إلى [Vercel](https://vercel.com).
2. اضغط على **"Add New..."** ثم اختر **"Project"**.
3. استورد مستودع GitHub الخاص بالمشروع (`portfolio`).
4. في خانة **Root Directory**، اختر مجلد: `my-next-app` (أو اتركه إذا كان المستودع يبدأ من داخله).
5. في خانة **Framework Preset**، تأكد من اختيار **Next.js**.

---

### 3. إعداد متغيرات البيئة (Environment Variables) في Vercel
في صفحة الإعداد قبل الضغط على Deploy، افتح قسم **"Environment Variables"** وأضف المتغيرات التالية (المأخوذة من ملف `.env` المحلي):

| اسم المتغير (Key) | القيمة (Value) | ملاحظة |
|-------------------|----------------|--------|
| `NODE_ENV` | `production` | بيئة التشغيل |
| `NEXT_PUBLIC_APP_URL` | `https://your-portfolio.vercel.app` | رابط موقعك على Vercel أو الدومين المخصص |
| `MONGODB_URI` | `mongodb+srv://...` | رابط الاتصال بـ MongoDB Atlas |
| `MONGODB_DB` | `portfolio` | اسم قاعدة البيانات |
| `AUTH_SECRET` | قيمة عشوائية سرية قوية | لحماية جلسات JWT |
| `MEDIA_STORAGE_PROVIDER` | `cloudinary` | مزود رفع الملفات |
| `CLOUDINARY_CLOUD_NAME` | اسم الحساب في Cloudinary | |
| `CLOUDINARY_API_KEY` | مفتاح الـ API | |
| `CLOUDINARY_API_SECRET` | السر الخاص بـ Cloudinary | |
| `ENABLE_ANALYTICS` | `true` | لتفعيل نظام إحصائيات المشاهدات |
| `RESEND_API_KEY` | (اختياري) | لإرسال إشعارات الإيميل الحية فور وصول رسالة |
| `ADMIN_NOTIFICATION_EMAIL` | `hashemmaher2009@gmail.com` | إيميل المالك لاستقبال الرسائل |

---

### 4. النشر والتشغيل (Deploy)
1. اضغط على زر **"Deploy"**.
2. سيقوم Vercel ببناء المشروع خلال ثوانٍ قليلة مع تنفيذ التحقق الكامل بـ TypeScript وحزم التطبيق للإنتاج.
3. فور الانتهاء، سيصبح موقعك متاحاً على الإنترنت برابط فائق السرعة يدعم شهادة الأمان SSL مجاناً تلقائياً.

---

### 5. ربط دومين مخصص (Custom Domain) — اختياري
1. من لوحة تحكم مشروعك في Vercel، ادخل إلى: **Settings** ← **Domains**.
2. أضف الدومين الخاص بك (مثلاً: `hashemmaher.dev`).
3. اضبط سجلات الـ DNS (سجل `CNAME` أو `A Record`) كما يوضح لك Vercel في مزود الدومين الخاص بك.
4. سيتم تفعيل الدومين وشهادة الأمان SSL تلقائياً خلال دقائق.

---

## 🛡️ الصيانة والنسخ الاحتياطي (Backups & Maintenance)
- **قاعدة البيانات:** MongoDB Atlas تقدم نسخ احتياطي تلقائي مجاني، ويمكنك تحميل نسخة احتياطية من خلال أداة `mongodump` في أي وقت:
  ```bash
  mongodump --uri="your_mongodb_atlas_uri" --out=./backup
  ```
- **تحديثات المحتوى:** تتم جميع التحديثات عبر لوحة التحكم (`/admin`) وتنعكس فوراً على الموقع الحي للزوار بفضل معمارية Server-Side وOn-demand data fetching دون الحاجة لإعادة نشر الكود.
