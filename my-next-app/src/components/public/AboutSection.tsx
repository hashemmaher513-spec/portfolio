import React from "react";
import { Locale, IProfile, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Award, CheckCircle2, TrendingUp, Users } from "lucide-react";

interface AboutSectionProps {
  locale: Locale;
  profile: IProfile | null;
  section: ISection | null;
}

export function AboutSection({ locale, profile, section }: AboutSectionProps) {
  const sectionTitle = getBilingualText(section?.title, locale) || (locale === "ar" ? "نبذة عني" : "About Me");
  const bio = getBilingualText(profile?.bio, locale) || (locale === "ar" ? "مطور شغوف ببناء المنتجات الرقمية الحديثة بمقاييس عالمية." : "Passionate engineer dedicated to building modern digital products.");
  const stats = profile?.stats || [];

  const icons = [TrendingUp, Award, Users, CheckCircle2];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "من أنا وماذا أقدم" : "Who I Am"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Content Card with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Bio Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-4 leading-relaxed text-[var(--text)] text-base sm:text-lg">
              <p className="whitespace-pre-wrap text-[var(--text-muted)]">
                {bio}
              </p>

              <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-[var(--text)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  <span>{locale === "ar" ? "تركيز على النتائج وقيمة البيزنس" : "Business Value & ROI Driven"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--secondary)]" />
                  <span>{locale === "ar" ? "توافق تام مع معايير السيو (SEO)" : "100% SEO & Performance Standards"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] shadow-sm flex flex-col justify-between hover:border-[var(--primary)] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-3xl sm:text-4xl font-black text-[var(--text)] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="block text-xs font-semibold text-[var(--text-muted)] mt-1">
                      {getBilingualText(stat.label, locale)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
