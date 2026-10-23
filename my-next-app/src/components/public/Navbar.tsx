"use client";

import React, { useState, useEffect } from "react";
import { Locale, ISiteSettings, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Menu, X, Code2, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  locale: Locale;
  settings: ISiteSettings | null;
  sections: ISection[];
}

export function Navbar({ locale, settings, sections }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleSections = sections.filter((s) => s.visible && s.key !== "hero");

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href={`/${locale}`}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/25 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[var(--text)] block leading-tight">
              {getBilingualText(settings?.siteName, locale) || (locale === "ar" ? "هاشم ماهر" : "Hashem Maher")}
            </span>
            <span className="text-[10px] text-[var(--primary)] font-semibold tracking-wider uppercase block">
              Full-Stack Developer
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-md shadow-sm">
          {visibleSections.map((sec) => (
            <a
              key={sec.key}
              href={`#${sec.key}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all"
            >
              {getBilingualText(sec.title, locale)}
            </a>
          ))}
        </nav>

        {/* Actions: Language & Theme Toggles & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageToggle currentLocale={locale} />
          <ThemeToggle />
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>{locale === "ar" ? "تواصل معي" : "Hire Me"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-2xl shadow-2xl mt-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2 mb-4">
            {visibleSections.map((sec) => (
              <a
                key={sec.key}
                href={`#${sec.key}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                {getBilingualText(sec.title, locale)}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <LanguageToggle currentLocale={locale} />
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md"
            >
              {locale === "ar" ? "تواصل معي" : "Hire Me"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
