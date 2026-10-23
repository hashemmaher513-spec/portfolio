import React from "react";
import { Locale, ISkillGroup, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Code, Database, Cpu } from "lucide-react";

interface SkillsSectionProps {
  locale: Locale;
  skillGroups: ISkillGroup[];
  section: ISection | null;
}

export function SkillsSection({ locale, skillGroups, section }: SkillsSectionProps) {
  if (skillGroups.length === 0) return null;

  const sectionTitle = getBilingualText(section?.title, locale) || (locale === "ar" ? "المهارات والتقنيات" : "Skills & Technologies");
  const icons = [Code, Database, Cpu];

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[var(--surface-hover)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "القدرات الهندسية" : "Technical Stack"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={group._id || index}
                className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-[var(--border)] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[var(--text)]">
                        {getBilingualText(group.title, locale)}
                      </h3>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {group.skills.length} {locale === "ar" ? "تقنيات وأدوات" : "Technologies"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface-hover)]/70 hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--text)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm group/skill cursor-default"
                      >
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] group-hover/skill:scale-125 transition-transform" />
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
