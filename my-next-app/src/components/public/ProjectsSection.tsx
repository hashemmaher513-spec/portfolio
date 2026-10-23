import React from "react";
import { Locale, IProject, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { ArrowUpRight, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

interface ProjectsSectionProps {
  locale: Locale;
  projects: IProject[];
  section: ISection | null;
}

export function ProjectsSection({ locale, projects, section }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  const sectionTitle = getBilingualText(section?.title, locale) || (locale === "ar" ? "أبرز المشاريع" : "Featured Projects");

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[var(--surface-hover)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "معرض الأعمال ودراسات الحالة" : "Case Studies & Work"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const title = getBilingualText(project.title, locale);
            const summary = getBilingualText(project.summary, locale);
            const liveLink = project.links?.find((l) => l.type === "live");
            const githubLink = project.links?.find((l) => l.type === "github");

            return (
              <div
                key={project._id || project.slug}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:border-[var(--primary)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image Container */}
                  <div className="relative h-64 sm:h-72 bg-[var(--surface-hover)] overflow-hidden">
                    <img
                      src={project.coverImage || "/placeholder.png"}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" />

                    {/* Featured Ribbon */}
                    {project.featured && (
                      <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{locale === "ar" ? "دراسة حالة مميزة" : "Featured Case Study"}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
                      <a href={`/${locale}/projects/${project.slug}`}>
                        {title}
                      </a>
                    </h3>

                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {summary}
                    </p>

                    {/* Tech Badges */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.technologies.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-medium text-[var(--text)] font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex items-center justify-between gap-4 border-t border-[var(--border)]/50 mt-4 pt-4">
                  <a
                    href={`/${locale}/projects/${project.slug}`}
                    className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{locale === "ar" ? "قراءة دراسة الحالة كاملة" : "Read Full Case Study"}</span>
                    <ArrowUpRight className="w-4 h-4 rtl:rotate-90" />
                  </a>

                  <div className="flex items-center gap-2">
                    {githubLink && githubLink.url && (
                      <a
                        href={githubLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] hover:text-[var(--primary)] text-[var(--text)] transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {liveLink && liveLink.url && (
                      <a
                        href={liveLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] hover:text-[var(--primary)] text-[var(--text)] transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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

export default ProjectsSection;
