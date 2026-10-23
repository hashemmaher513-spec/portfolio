# 🌟 Hashem Maher — Dynamic Full-Stack Software Engineer Portfolio
### بورتفوليو مهندس البرمجيات هاشم ماهر — نظام إدارة محتوى ديناميكي بالكامل (Zero-Code Post-Delivery)

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-orange?style=flat&logo=cloudinary)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-cyan?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

---

## 📖 نظرة عامة (Overview)
بورتفوليو هندسي عالي الأداء مبني وفق أعلى معايير الويب لعام 2026. تم بناؤه لتسليط الضوء على خبرات ومشاريع مهندس البرمجيات **هاشم ماهر (Hashem Maher)**.

المشروع يرتكز على مبدأ **"Zero-Code Post-Delivery"**، حيث تم ربط كل عنصر يراه الزائر (نصوص، صور، ألوان، خطوط، ترتيب الأقسام، فيديوهات، روابط، دراسات حالة) بقاعدة بيانات سحابية متقدمة (**MongoDB Atlas**) مع لوحة تحكم إدارية خاصة بالمالك (`/admin`).

---

## ✨ المميزات الرئيسية (Key Highlights)

1. **🌍 ثنائي اللغة بالتصميم (Arabic RTL & English LTR):**
   - اللغة العربية كلغة أولى مدعومة بتخطيط RTL متقن.
   - إمكانية التبديل الفوري للغة الإنجليزية (LTR) مع الحفاظ على موضع الصفحة دون إعادة توجيه للرئيسية.
   - منطق ذكي للتعامل مع النصوص الإنجليزية الناقصة عبر Fallback فوري للغة العربية.

2. **🌓 نظام ثيم ديناميكي بدون وميض (Zero-Flash Dark/Light Mode):**
   - حقن متغيرات CSS في السيرفر قبل أول رسم في المتصفح لمنع وميض الشاشة.
   - تحكم كامل من لوحة الإدارة في درجات الألوان (الخلفية، البطاقات، نصوص، حدود، اللون الأساسي).
   - إمكانية استعادة الإعدادات الافتراضية بنقرة واحدة.

3. **💼 دراسات حالة للمشاريع (In-Depth Case Studies):**
   - صفحات مخصصة لكل مشروع عبر الرابط الدائم (`/projects/[slug]`).
   - هيكلية متكاملة لدراسة الحالة: المشكلة (Problem)، الحل الهندسي (Solution)، والنتيجة والأثر (Result).
   - تضمين فيديوهات توضيحية خفيفة بدون تشغيل تلقائي مزعج.
   - شارات للتقنيات المستخدمة وروابط العرض المباشر (Live Demo) ومستودع الكود (GitHub).

4. **🏷️ مهارات بدون نسب مئوية (Modern Engineering Badges):**
   - تم استبدال أشرطة النسب المئوية بشارات تقنية عصرية مقسمة في مجموعات قابلة للترتيب.

5. **🛡️ أمان متقدم ومكافحة السبام:**
   - لوحة تحكم محمية بـ JWT HttpOnly Cookies وتشفير كلمات المرور بـ Bcrypt.
   - حماية نموذج التواصل بحقل خفي (Honeypot) ونظام تقييد معدل الإرسال (Rate Limiting).

6. **⚡ سيو وأداء فائق (SEO & Structured Data):**
   - دعم كامل لبيانات Schema.org المنظمة (JSON-LD) لـ `Person` و `SoftwareApplication`.
   - توليد ديناميكي لملف خريطة الموقع `sitemap.xml` وملف الروبوتات `robots.txt`.
   - وسوم OpenGraph و Twitter Cards مخصصة لكل صفحة ومشروع.

---

## 🏗️ البنية التقنية (Architecture)

```
c:/Prjocet/
├── docs/                      # التوثيق الشامل ومستندات المراحل
│   ├── BRD.md                 # وثيقة متطلبات العمل والمراحل (Business Requirements Document)
│   ├── prd.md                 # وثيقة متطلبات المنتج التفصيلية (Product Requirements Document)
│   ├── ADMIN_GUIDE.md         # دليل المالك لإدارة لوحة التحكم
│   └── DEPLOYMENT.md          # دليل النشر على Vercel
├── my-next-app/               # تطبيق Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/      # مسارات الموقع العام (ar / en)
│   │   │   │   ├── page.tsx   # الصفحة الرئيسية الديناميكية
│   │   │   │   └── projects/[slug]/ # صفحات دراسات الحالة
│   │   │   ├── admin/         # لوحة التحكم الخاصة بالمالك
│   │   │   │   ├── projects/  # إدارة المشاريع ودراسات الحالة
│   │   │   │   ├── skills/    # إدارة المهارات بالشارات
│   │   │   │   ├── theme/     # إدارة الثيم والألوان
│   │   │   │   ├── sections/  # ترتيب وإخفاء الأقسام
│   │   │   │   ├── messages/  # صندوق رسائل التواصل
│   │   │   │   └── ...
│   │   │   ├── api/           # واجهات برمجية آمنة (CRUD & Auth)
│   │   │   ├── sitemap.ts     # توليد خريطة الموقع تلقائياً
│   │   │   └── robots.ts      # إعدادات محركات البحث
│   │   ├── components/        # مكونات الواجهة العامة ولوحة الإدارة
│   │   ├── lib/               # الاتصال بقاعدة البيانات، Cloudinary، الأمان، والتوطين
│   │   └── models/            # نماذج بيانات Mongoose الثنائية اللغة
└── README.md                  # الدليل الرئيسي للمشروع
```

---

## 🚀 البدء السريع محلياً (Local Development)

### 1. المتطلبات:
- Node.js 20.9 أو أحدث
- اتصال بالإنترنت للربط مع سحابة MongoDB Atlas و Cloudinary

### 2. تثبيت الحزم:
```bash
cd my-next-app
npm install
```

### 3. إعداد متغيرات البيئة:
تأكد من وجود ملف `.env` في مجلد `my-next-app` يحتوي على بيانات الاتصال:
```env
MONGODB_URI=mongodb+srv://...
MEDIA_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
AUTH_SECRET=...
```

### 4. التشغيل في بيئة التطوير:
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

### 5. البناء للإنتاج:
```bash
npm run build
npm start
```

---

## 🔑 بيانات لوحة التحكم الافتراضية
- **الرابط:** `http://localhost:3000/admin/login`
- **البريد الإلكتروني:** `hashemmaher2009@gmail.com`
- **كلمة المرور الافتراضية:** `hashem123456789`

---

## 📚 التوثيق الإضافي
- للمزيد حول كيفية إدارة المحتوى والأقسام والثيم: راجع [دليل المالك للوحة التحكم](docs/ADMIN_GUIDE.md).
- للخطوات المفصلة لنشر المشروع على Vercel وربط الدومين: راجع [دليل النشر السحابي](docs/DEPLOYMENT.md).
- للإطلاع على كراسة الشروط والمواصفات الكاملة: راجع [BRD.md](docs/BRD.md) و [prd.md](docs/prd.md).
