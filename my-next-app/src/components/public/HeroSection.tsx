import React from "react";
import { Locale, IProfile, ISiteSettings } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { ArrowRight, Code2, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  locale: Locale;
  profile: IProfile | null;
  settings: ISiteSettings | null;
}

export function HeroSection({ locale, profile, settings }: HeroSectionProps) {
  const name = getBilingualText(profile?.name, locale) || (locale === "ar" ? "هاشم ماهر" : "Hashem Maher");
  const title = getBilingualText(profile?.title, locale) || (locale === "ar" ? "مهندس برمجيات متكامل" : "Full-Stack Software Engineer");
  const tagline = getBilingualText(profile?.tagline, locale) || (locale === "ar" ? "أبني حلولاً رقمية وتطبيقات ويب فائقة السرعة، تجمع بين الهندسة المعمارية الصلبة والتجربة البصرية المتقنة." : "Crafting scalable, high-performance web applications that merge robust architecture with exceptional user experiences.");
  const avatar = profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[var(--secondary)] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-start space-y-6 max-w-2xl mx-auto lg:mx-0">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {locale === "ar" ? "متاح للعمل الحر والفرص الجديدة" : "Available for freelance & new roles"}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
                {locale === "ar" ? "مرحباً، أنا" : "Hello World, I'm"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text)] tracking-tight leading-[1.15]">
                {name}
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-muted)] tracking-tight">
                {title}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0">
              {tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold shadow-xl shadow-[var(--primary)]/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{locale === "ar" ? "تواصل معي الآن" : "Get In Touch"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>

              <a
                href="#projects"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[var(--primary)]" />
                <span>{locale === "ar" ? "استكشف أعمالي" : "Explore Work"}</span>
              </a>
            </div>

            {/* Quick Micro-facts */}
            <div className="pt-6 border-t border-[var(--border)]/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                <span>{locale === "ar" ? "معمارية برمجية صلبة" : "Clean Architecture"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                <span>{locale === "ar" ? "أداء فائق السرعة" : "High Performance"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                <span>{locale === "ar" ? "تحكم ديناميكي 100%" : "Zero-Code Management"}</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Column */}
          <div className="flex-1 flex items-center justify-center relative max-w-md w-full">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-3xl overflow-hidden p-2 border border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--surface-hover)] shadow-2xl group">
              {/* Inner Image with Rounded Corners */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge 1: Tech Stack */}
              <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-4 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--text-muted)] font-medium">Stack</span>
                  <span className="block text-xs font-bold text-[var(--text)] font-mono">Next.js 16 + Mongo</span>
                </div>
              </div>

              {/* Floating Badge 2: Experience */}
              <div className="absolute -top-2 -left-2 sm:top-4 sm:left-4 p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--text-muted)] font-medium">
                    {locale === "ar" ? "خبرة هندسية" : "Experience"}
                  </span>
                  <span className="block text-xs font-bold text-[var(--text)]">
                    4+ {locale === "ar" ? "سنوات" : "Years"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
