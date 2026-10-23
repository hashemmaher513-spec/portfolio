import React from "react";
import { Locale, IProject } from "@/models/types";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, SiteSettings, Section } from "@/models";
import { getBilingualText } from "@/lib/data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === "en" ? "en" : "ar";

  let project: IProject | null = null;
  try {
    await connectToDatabase();
    project = await Project.findOne({ slug: slug.toLowerCase() }).lean<IProject>();
  } catch (e) {
    console.error("Project metadata load error:", e);
  }

  if (!project) return { title: "Project Not Found" };

  const title = `${getBilingualText(project.title, currentLocale)} — Case Study`;
  const description = getBilingualText(project.summary, currentLocale);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === "en" ? "en" : "ar";

  let project: IProject | null = null;
  try {
    await connectToDatabase();
    project = await Project.findOneAndUpdate(
      { slug: slug.toLowerCase(), visible: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean<IProject>();
  } catch (e) {
    console.error("Project load error:", e);
  }

  if (!project) {
    notFound();
  }

  // Find previous and next projects for navigation
  const [prevProject, nextProject, settings, sections] = await Promise.all([
    Project.findOne({ visible: true, order: { $lt: project.order } })
      .sort({ order: -1 })
      .select("slug title")
      .lean<IProject>(),
    Project.findOne({ visible: true, order: { $gt: project.order } })
      .sort({ order: 1 })
      .select("slug title")
      .lean<IProject>(),
    SiteSettings.findOne().lean(),
    Section.find().sort({ order: 1 }).lean(),
  ]);

  const title = getBilingualText(project.title, currentLocale);
  const summary = getBilingualText(project.summary, currentLocale);
  const role = getBilingualText(project.role, currentLocale);
  const problem = getBilingualText(project.problem, currentLocale);
  const solution = getBilingualText(project.solution, currentLocale);
  const result = getBilingualText(project.result, currentLocale);

  const liveLink = project.links?.find((l) => l.type === "live");
  const githubLink = project.links?.find((l) => l.type === "github");

  // Helper for YouTube embeds
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedUrl(project.video?.url);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: summary,
    applicationCategory: "WebApplication",
    url: `${siteUrl}/${currentLocale}/projects/${project.slug}`,
    image: project.coverImage || undefined,
    author: {
      "@type": "Person",
      name: "Hashem Maher",
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <Navbar locale={currentLocale} settings={settings as any} sections={sections as any} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Back to Home Link */}
          <div>
            <a
              href={`/${currentLocale}#projects`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{currentLocale === "ar" ? "العودة إلى جميع المشاريع" : "Back to all projects"}</span>
            </a>
          </div>

          {/* Header Info */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentLocale === "ar" ? "مشروع مميز" : "Featured Case Study"}</span>
                </span>
              )}

              {project.period && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.period}</span>
                </span>
              )}

              {role && (
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border)]">
                  <User className="w-3.5 h-3.5" />
                  <span>{role}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[var(--text)] tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-base sm:text-xl text-[var(--text-muted)] leading-relaxed">
              {summary}
            </p>

            {/* Action Buttons: Live Demo & GitHub */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {liveLink && liveLink.url && (
                <a
                  href={liveLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 transition-all hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{currentLocale === "ar" ? "زيارة الموقع الحي (Live Demo)" : "Visit Live Platform"}</span>
                </a>
              )}

              {githubLink && githubLink.url && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] text-xs font-bold shadow-sm transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>{currentLocale === "ar" ? "مستودع الكود (GitHub)" : "View Code Repository"}</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Hero Banner / Video */}
          <div className="rounded-3xl border border-[var(--border)] overflow-hidden shadow-2xl bg-[var(--surface)]">
            {embedUrl ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <img
                src={project.coverImage || "/placeholder.png"}
                alt={title}
                className="w-full max-h-[500px] object-cover"
              />
            )}
          </div>

          {/* Tech Stack Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2 font-mono">
                <Layers className="w-4 h-4 text-[var(--primary)]" />
                <span>{currentLocale === "ar" ? "التقنيات المستخدمة في البناء" : "Technologies & Architecture"}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* The Problem / Solution / Result Deep Dive */}
          <div className="space-y-8">
            {/* 1. Problem */}
            {problem && (
              <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                <div className="inline-flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center text-xs">
                    01
                  </span>
                  <span>{currentLocale === "ar" ? "المشكلة والتحدي (The Problem)" : "The Challenge"}</span>
                </div>
                <p className="text-base text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {problem}
                </p>
              </div>
            )}

            {/* 2. Solution */}
            {solution && (
              <div className="p-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs">
                    02
                  </span>
                  <span>{currentLocale === "ar" ? "الحل والنهج الهندسي (The Solution)" : "The Engineering Solution"}</span>
                </div>
                <p className="text-base text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {solution}
                </p>
              </div>
            )}

            {/* 3. Results */}
            {result && (
              <div className="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs">
                    03
                  </span>
                  <span>{currentLocale === "ar" ? "النتائج والأثر الملموس (The Outcomes)" : "Measurable Results"}</span>
                </div>
                <p className="text-base text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {result}
                </p>
              </div>
            )}
          </div>

          {/* Navigation to Previous / Next Project */}
          <div className="pt-12 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevProject ? (
              <a
                href={`/${currentLocale}/projects/${prevProject.slug}`}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all flex items-center gap-3 group"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--primary)] group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                <div className="min-w-0">
                  <span className="block text-[11px] text-[var(--text-muted)]">
                    {currentLocale === "ar" ? "المشروع السابق" : "Previous Project"}
                  </span>
                  <span className="block text-sm font-bold text-[var(--text)] truncate">
                    {getBilingualText(prevProject.title, currentLocale)}
                  </span>
                </div>
              </a>
            ) : (
              <div />
            )}

            {nextProject ? (
              <a
                href={`/${currentLocale}/projects/${nextProject.slug}`}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] transition-all flex items-center justify-end text-end gap-3 group sm:ms-auto"
              >
                <div className="min-w-0">
                  <span className="block text-[11px] text-[var(--text-muted)]">
                    {currentLocale === "ar" ? "المشروع التالي" : "Next Project"}
                  </span>
                  <span className="block text-sm font-bold text-[var(--text)] truncate">
                    {getBilingualText(nextProject.title, currentLocale)}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--primary)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </a>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      <Footer locale={currentLocale} settings={settings as any} />
    </div>
  );
}
