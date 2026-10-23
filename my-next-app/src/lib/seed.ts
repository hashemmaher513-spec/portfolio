import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import {
  Admin,
  SiteSettings,
  Theme,
  Section,
  Profile,
  SkillGroup,
  Experience,
  Project,
  Service,
  Testimonial,
} from "../models";

export async function seedDatabase() {
  await connectToDatabase();

  const adminEmail =
    process.env.ADMIN_SEED_EMAIL ||
    process.env.ADMIN_INITIAL_EMAIL ||
    "hashemmaher2009@gmail.com";
  const adminPassword =
    process.env.ADMIN_SEED_PASSWORD ||
    process.env.ADMIN_INITIAL_PASSWORD ||
    "hashem123456789";

  console.log(`[Seed] Checking Admin account for: ${adminEmail}`);
  const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await Admin.create({
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: "Hashem Maher",
    });
    console.log("[Seed] Admin user created successfully.");
  } else {
    console.log("[Seed] Admin user already exists.");
  }

  // 1. Site Settings
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      siteName: {
        ar: "هاشم ماهر | مطور برمجيات متكامل",
        en: "Hashem Maher | Full-Stack Engineer",
      },
      defaultLocale: "ar",
      defaultTheme: "dark",
      logo: {
        light: "",
        dark: "",
      },
      favicon: "",
      resumeUrl: {
        ar: "#",
        en: "#",
      },
      contact: {
        email: "hashemmaher2009@gmail.com",
        whatsapp: "201000000000",
        phone: "+201000000000",
        address: {
          ar: "مصر",
          en: "Egypt",
        },
      },
      socials: [
        { platform: "github", url: "https://github.com", icon: "Github", visible: true },
        { platform: "linkedin", url: "https://linkedin.com", icon: "Linkedin", visible: true },
        { platform: "twitter", url: "https://twitter.com", icon: "Twitter", visible: true },
      ],
      seo: {
        title: {
          ar: "هاشم ماهر — بورتفوليو مطور برمجيات Full-Stack",
          en: "Hashem Maher — Full-Stack Software Engineer Portfolio",
        },
        description: {
          ar: "بورتفوليو احترافي يعرض دراسات حالة لمشاريع متكاملة، مهارات هندسية، وخدمات تطوير وتصميم التطبيقات الحديثة.",
          en: "Professional portfolio featuring in-depth case studies, engineering skills, and modern web application development services.",
        },
        ogImage: "",
        keywords: [
          "Full-Stack Developer",
          "Next.js",
          "React",
          "Node.js",
          "MongoDB",
          "TypeScript",
          "مطور ويب",
        ],
      },
    });
    console.log("[Seed] SiteSettings created.");
  }

  // 2. Theme
  const existingTheme = await Theme.findOne();
  if (!existingTheme) {
    await Theme.create({
      colors: {
        light: {
          background: "#f8fafc",
          surface: "#ffffff",
          surfaceHover: "#f1f5f9",
          primary: "#2563eb",
          primaryHover: "#1d4ed8",
          secondary: "#0f766e",
          text: "#0f172a",
          textMuted: "#64748b",
          border: "#e2e8f0",
        },
        dark: {
          background: "#080b11",
          surface: "#0f172a",
          surfaceHover: "#1e293b",
          primary: "#38bdf8",
          primaryHover: "#0ea5e9",
          secondary: "#2dd4bf",
          text: "#f8fafc",
          textMuted: "#94a3b8",
          border: "#1e293b",
        },
      },
      fonts: {
        ar: "Cairo",
        en: "Inter",
      },
      radius: "lg",
    });
    console.log("[Seed] Theme created.");
  }

  // 3. Sections
  const sectionsCount = await Section.countDocuments();
  if (sectionsCount === 0) {
    const defaultSections = [
      { key: "hero", title: { ar: "الرئيسية", en: "Home" }, order: 0, visible: true },
      { key: "about", title: { ar: "نبذة عني", en: "About Me" }, order: 1, visible: true },
      { key: "skills", title: { ar: "المهارات والتقنيات", en: "Skills & Tech" }, order: 2, visible: true },
      { key: "experience", title: { ar: "مسيرتي المهنية", en: "Experience" }, order: 3, visible: true },
      { key: "projects", title: { ar: "أبرز المشاريع", en: "Featured Work" }, order: 4, visible: true },
      { key: "services", title: { ar: "خدماتي", en: "Services" }, order: 5, visible: true },
      { key: "testimonials", title: { ar: "آراء العملاء", en: "Testimonials" }, order: 6, visible: true },
      { key: "contact", title: { ar: "تواصل معي", en: "Contact" }, order: 7, visible: true },
    ];
    await Section.insertMany(defaultSections);
    console.log("[Seed] Default sections created.");
  }

  // 4. Profile
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      name: {
        ar: "هاشم ماهر",
        en: "Hashem Maher",
      },
      title: {
        ar: "مهندس برمجيات متكامل (Full-Stack Engineer)",
        en: "Senior Full-Stack Software Engineer",
      },
      tagline: {
        ar: "أبني حلولاً رقمية وتطبيقات ويب فائقة السرعة، تجمع بين الهندسة المعمارية الصلبة والتجربة البصرية المتقنة.",
        en: "Crafting scalable, high-performance web applications that merge robust architecture with exceptional user experiences.",
      },
      bio: {
        ar: "مطور شغوف ببناء المنتجات الرقمية الحديثة بمقاييس عالمية. أركز على تطوير أنظمة سحابية قابلة للتوسع وتصميم واجهات مستخدم مذهلة وسلسة تحول زوارك إلى عملاء فعليين.",
        en: "Passionate engineer dedicated to building modern digital products. Focused on scalable architectures, resilient backends, and visually stunning web interfaces.",
      },
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      ctaButtons: [
        {
          text: { ar: "تواصل معي الآن", en: "Get In Touch" },
          link: "#contact",
          variant: "primary",
        },
        {
          text: { ar: "استكشف أعمالي", en: "Explore Projects" },
          link: "#projects",
          variant: "outline",
        },
      ],
      stats: [
        { label: { ar: "سنوات خبرة", en: "Years Experience" }, value: "4+", order: 0 },
        { label: { ar: "مشروع منجز", en: "Completed Projects" }, value: "25+", order: 1 },
        { label: { ar: "رضا العملاء", en: "Client Satisfaction" }, value: "99%", order: 2 },
      ],
    });
    console.log("[Seed] Profile created.");
  }

  // 5. Skill Groups
  const skillCount = await SkillGroup.countDocuments();
  if (skillCount === 0) {
    await SkillGroup.insertMany([
      {
        title: { ar: "الواجهات الأمامية (Frontend)", en: "Frontend Development" },
        order: 0,
        visible: true,
        skills: [
          { name: "React 19 / Next.js 16", level: 95 },
          { name: "TypeScript", level: 90 },
          { name: "Tailwind CSS & CSS Architecture", level: 95 },
          { name: "Framer Motion & Micro-interactions", level: 85 },
        ],
      },
      {
        title: { ar: "الواجهات الخلفية والقواعد (Backend & Database)", en: "Backend & Systems" },
        order: 1,
        visible: true,
        skills: [
          { name: "Node.js & Express", level: 92 },
          { name: "MongoDB & Mongoose", level: 90 },
          { name: "REST & GraphQL APIs", level: 90 },
          { name: "Authentication & Security (JWT, OAuth)", level: 88 },
        ],
      },
      {
        title: { ar: "السحابة والأدوات (DevOps & Tools)", en: "DevOps & Tooling" },
        order: 2,
        visible: true,
        skills: [
          { name: "Docker & CI/CD", level: 80 },
          { name: "Cloudinary & S3 Storage", level: 90 },
          { name: "Git & Clean Architecture", level: 92 },
          { name: "SEO & Web Vitals Optimization", level: 95 },
        ],
      },
    ]);
    console.log("[Seed] Skill groups created.");
  }

  // 6. Experience
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company: "Tech Innovators Studio",
        role: { ar: "مهندس واجهات وبرمجيات رئيسي", en: "Lead Full-Stack Engineer" },
        startDate: "2024",
        current: true,
        description: {
          ar: "قيادة تطوير منصات سحابية تعتمد على Next.js و Node.js، وتحسين سرعة الأداء بنسبة 40% ومعايير الـ SEO.",
          en: "Leading the development of modern cloud platforms with Next.js and Node.js, boosting performance by 40%.",
        },
        technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
        order: 0,
        visible: true,
      },
      {
        company: "Digital Solutions Co.",
        role: { ar: "مطور برمجيات Full-Stack", en: "Full-Stack Software Engineer" },
        startDate: "2022",
        endDate: "2024",
        current: false,
        description: {
          ar: "تطوير بوابات تفاعلية ولوحات تحكم ديناميكية مع معمارية API قوية وتكامل مع بوابات الدفع والخدمات السحابية.",
          en: "Architected dynamic admin portals, robust RESTful APIs, and integrated cloud storage and payment gateways.",
        },
        technologies: ["React", "Express", "MongoDB", "Docker"],
        order: 1,
        visible: true,
      },
    ]);
    console.log("[Seed] Experience entries created.");
  }

  // 7. Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        slug: "nextjs-saas-platform",
        title: {
          ar: "منصة سحابية متقدمة لإدارة الأعمال (SaaS)",
          en: "Enterprise SaaS Business Platform",
        },
        summary: {
          ar: "منصة ويب متكاملة تتيح للشركات إدارة العمليات والتقارير المالية والتحليلات الحية بواجهات فائقة السلاسة.",
          en: "An all-in-one cloud platform empowering businesses to manage operations, reporting, and real-time analytics.",
        },
        role: { ar: "مهندس النظام والمطور الأساسي", en: "Lead Full-Stack Architect" },
        period: "2025",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        problem: {
          ar: "كان العميل يعاني من بطء في استخراج البيانات وتشتت فرق العمل بين عدة أدوات غير متزامنة.",
          en: "The client suffered from severe latency in report generation and fragmented team workflows.",
        },
        solution: {
          ar: "تم بناء منصة موحدة تعتمد على Next.js App Router و Redis مع كاش ذكي خفّض زمن الاستجابة إلى أقل من 150ms.",
          en: "Engineered a unified architecture utilizing Next.js App Router and intelligent caching, dropping latency below 150ms.",
        },
        result: {
          ar: "زيادة إنتاجية الفريق بنسبة 65%، وتحقيق نتيجة 98/100 في اختبارات أداء Google Lighthouse.",
          en: "65% boost in team productivity and achieved a 98/100 Google Lighthouse performance score.",
        },
        technologies: ["Next.js 16", "React 19", "MongoDB", "Tailwind CSS", "TypeScript"],
        featured: true,
        order: 0,
        visible: true,
        links: [
          { label: { ar: "معاينة حية", en: "Live Demo" }, url: "https://example.com", type: "live" },
          { label: { ar: "كود المشروع", en: "Source Code" }, url: "https://github.com", type: "github" },
        ],
      },
      {
        slug: "ecommerce-headless-store",
        title: {
          ar: "متجر إلكتروني ذكي فائق السرعة",
          en: "High-Performance Headless E-Commerce",
        },
        summary: {
          ar: "متجر تجارة إلكترونية بتجربة تسوق حديثة، فلترة فورية، ودعم كامل للغات والمود الفاتح والداكن.",
          en: "A blazing-fast headless store with instant filtering, multi-currency support, and dark/light modes.",
        },
        role: { ar: "مطور Full-Stack", en: "Full-Stack Developer" },
        period: "2024",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        problem: {
          ar: "انخفاض معدل التحويل بسبب بطء تحميل عربة التسوق وصعوبة التصفح على أجهزة الموبايل.",
          en: "Low conversion rates caused by slow cart checkout and clunky mobile experience.",
        },
        solution: {
          ar: "إعادة بناء الواجهة بتقنيات Server Components وحركات Micro-interactions تفاعلية وسلسة للغاية.",
          en: "Re-architected the frontend with Server Components and fluid micro-interactions.",
        },
        result: {
          ar: "ارتفاع معدل التحويل بمقدار 38%، وزيادة سرعة التصفح بأكثر من 3 أضعاف.",
          en: "38% conversion increase and 3x faster page transitions.",
        },
        technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Cloudinary"],
        featured: true,
        order: 1,
        visible: true,
        links: [
          { label: { ar: "معاينة حية", en: "Live Preview" }, url: "https://example.com", type: "live" },
        ],
      },
    ]);
    console.log("[Seed] Projects created.");
  }

  // 8. Services
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    await Service.insertMany([
      {
        title: { ar: "تطوير تطبيقات الويب المتكاملة", en: "Full-Stack Web Development" },
        description: {
          ar: "بناء تطبيقات حديثة من الصفر حتى النشر، بأحدث معايير الأمان والتجاوب مع جميع الشاشات.",
          en: "End-to-end web applications built from scratch with bulletproof security and responsive design.",
        },
        icon: "Layout",
        order: 0,
        visible: true,
      },
      {
        title: { ar: "بناء لوحات التحكم والأنظمة الديناميكية", en: "Dynamic Admin Systems" },
        description: {
          ar: "لوحات تحكم احترافية وسهلة تمكنك من إدارة كل نصوص وصور وألوان موقعك بدون الحاجة لكتابة كود.",
          en: "Empowering custom dashboards allowing you to manage all site content, assets, and styles with zero code.",
        },
        icon: "Sliders",
        order: 1,
        visible: true,
      },
      {
        title: { ar: "تحسين الأداء وسرعة التحميل (SEO & Speed)", en: "Performance & SEO Optimization" },
        description: {
          ar: "تسريع المواقع لتخطي 95+ في معايير Google Core Web Vitals وتصدر نتائج محركات البحث.",
          en: "Optimizing web platforms to achieve 95+ Lighthouse scores and rank at the top of search engines.",
        },
        icon: "Zap",
        order: 2,
        visible: true,
      },
    ]);
    console.log("[Seed] Services created.");
  }

  // 9. Testimonials
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    await Testimonial.insertMany([
      {
        name: "م. أحمد الشناوي",
        position: { ar: "الرئيس التنفيذي للتقنية", en: "CTO" },
        company: "NextGen Tech",
        text: {
          ar: "هاشم مهندس استثنائي؛ دقته في الكود وسرعة إنجازه وفهمه العميق لمتطلبات البيزنس جعلت المشروع قصة نجاح حقيقية.",
          en: "Hashem is an exceptional engineer. His code quality, delivery speed, and business acumen made our product launch a huge success.",
        },
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        order: 0,
        visible: true,
      },
      {
        name: "سارة المنصوري",
        position: { ar: "مديرة منتج", en: "Product Director" },
        company: "Digital Growth Hub",
        text: {
          ar: "أكثر ما يميز هاشم هو قدرته على بناء واجهات مستخدم مذهلة بصرياً مع الحفاظ على سرعة فائقة في الأداء وتجربة RTL متقنة.",
          en: "What stands out most about Hashem is his ability to build stunning UIs while maintaining blazing-fast performance and flawless RTL support.",
        },
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        order: 1,
        visible: true,
      },
    ]);
    console.log("[Seed] Testimonials created.");
  }

  return { success: true };
}
