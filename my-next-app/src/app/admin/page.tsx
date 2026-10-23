import React from "react";
import { connectToDatabase } from "@/lib/mongodb";
import {
  Project,
  Message,
  SkillGroup,
  Experience,
  Profile,
  SiteSettings,
} from "@/models";
import {
  Briefcase,
  MessageSquare,
  Layers,
  Sparkles,
  ArrowUpRight,
  Plus,
  Palette,
  Sliders,
  User,
  Clock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [
    projectsCount,
    messagesCount,
    unreadMessagesCount,
    skillsCount,
    experiencesCount,
    recentMessages,
    recentProjects,
    profile,
  ] = await Promise.all([
    Project.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ read: false }),
    SkillGroup.countDocuments(),
    Experience.countDocuments(),
    Message.find().sort({ createdAt: -1 }).limit(5).lean(),
    Project.find().sort({ order: 1 }).limit(4).lean(),
    Profile.findOne().lean(),
  ]);

  const stats = [
    {
      title: "المشاريع المنشورة",
      value: projectsCount,
      icon: Briefcase,
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
      href: "/admin/projects",
    },
    {
      title: "رسائل التواصل",
      value: messagesCount,
      subValue: unreadMessagesCount > 0 ? `${unreadMessagesCount} جديدة` : "لا توجد رسائل جديدة",
      icon: MessageSquare,
      color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
      href: "/admin/messages",
    },
    {
      title: "مجموعات المهارات",
      value: skillsCount,
      icon: Layers,
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
      href: "/admin/skills",
    },
    {
      title: "المسيرة والخبرات",
      value: experiencesCount,
      icon: Sparkles,
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
      href: "/admin/experience",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة التحكم نشطة ومؤمنة بالكامل</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              أهلاً بك، {profile?.name?.ar || "هاشم ماهر"} 👋
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xl">
              من هنا يمكنك تعديل أي نص، صورة، لون، أو ترتيب في البورتفوليو. كل تغيير تقوم بحفظه ينعكس على الموقع العام فوراً وبدون لمس الكود.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/admin/projects"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مشروع جديد</span>
            </a>
            <a
              href="/admin/theme"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] text-xs font-semibold transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              <span>تخصيص الثيم</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <a
              key={i}
              href={stat.href}
              className={`p-5 rounded-2xl border bg-gradient-to-b ${stat.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-[var(--surface)]/60 backdrop-blur-sm">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-[var(--text)]">
                  {stat.value}
                </span>
                {stat.subValue && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {stat.subValue}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/admin/profile"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[var(--text)] flex items-center justify-between">
            <span>الملف الشخصي والـ Hero</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            تعديل الاسم، المسمى الوظيفي، النبذة التعريفية، الصورة الشخصية وأرقام الإنجازات.
          </p>
        </a>

        <a
          href="/admin/sections"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[var(--text)] flex items-center justify-between">
            <span>هيكل وترتيب الأقسام</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            إظهار أو إخفاء أي قسم في الصفحة الرئيسية وإعادة ترتيبها بالسحب والإفلات.
          </p>
        </a>

        <a
          href="/admin/theme"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[var(--text)] flex items-center justify-between">
            <span>تخصيص الهوية والألوان</span>
            <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
            التحكم في ألوان اللايت والدارك مود، الخطوط العربية والإنجليزية، واستدارة الحواف.
          </p>
        </a>
      </div>

      {/* Two Columns: Recent Projects & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base text-[var(--text)]">
                المشاريع الحالية
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                المشاريع المعروضة في البورتفوليو
              </p>
            </div>
            <a
              href="/admin/projects"
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-6 text-center">
                لا توجد مشاريع مضافة بعد.
              </p>
            ) : (
              recentProjects.map((p: any) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.coverImage || "/placeholder.png"}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-[var(--border)] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[var(--text)] truncate">
                        {p.title?.ar || p.title?.en}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5" dir="ltr">
                        /{p.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                        مميز
                      </span>
                    )}
                    <a
                      href={`/admin/projects`}
                      className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white text-xs transition-colors"
                    >
                      تعديل
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base text-[var(--text)]">
                آخر رسائل التواصل
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                رسائل الزوار الواردة من الموقع
              </p>
            </div>
            <a
              href="/admin/messages"
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>صندوق الوارد</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-6 text-center">
                لا توجد رسائل جديدة حتى الآن.
              </p>
            ) : (
              recentMessages.map((m: any) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text)] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                    {m.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
