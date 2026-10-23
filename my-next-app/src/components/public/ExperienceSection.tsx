import React from "react";
import { Locale, IExperience, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface ExperienceSectionProps {
  locale: Locale;
  experiences: IExperience[];
  section: ISection | null;
}

export function ExperienceSection({ locale, experiences, section }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  const sectionTitle = getBilingualText(section?.title, locale) || (locale === "ar" ? "مسيرتي المهنية" : "Experience");

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "الخبرات والمسيرة" : "Career Timeline"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Timeline Items */}
        <div className="relative border-s-2 border-[var(--border)] ps-6 sm:ps-8 ms-4 sm:ms-6 space-y-12">
          {experiences.map((exp, index) => {
            const period = exp.current
              ? `${exp.startDate} — ${locale === "ar" ? "حتى الآن" : "Present"}`
              : `${exp.startDate} — ${exp.endDate || ""}`;

            return (
              <div key={exp._id || index} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -start-[31px] sm:-start-[39px] top-1.5 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--bg)] shadow-md group-hover:scale-125 transition-transform" />

                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text)]">
                        {getBilingualText(exp.role, locale)}
                      </h3>
                      <p className="text-sm font-semibold text-[var(--primary)] mt-0.5">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] px-3 py-1 rounded-full border border-[var(--border)] self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>{period}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 whitespace-pre-wrap">
                    {getBilingualText(exp.description, locale)}
                  </p>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]/60">
                      {exp.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] text-[11px] font-medium text-[var(--text)] border border-[var(--border)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
