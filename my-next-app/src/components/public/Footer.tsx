"use client";

import React from "react";
import { Locale, ISiteSettings } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { ArrowUp, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";

interface FooterProps {
  locale: Locale;
  settings: ISiteSettings | null;
}

export function Footer({ locale, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName =
    getBilingualText(settings?.siteName, locale) ||
    (locale === "ar" ? "هاشم ماهر" : "Hashem Maher");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Rights */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white shadow-md">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text)]">
              {siteName} © {currentYear}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {locale === "ar"
                ? "جميع الحقوق محفوظة — مبني بتقنيات Next.js 16 و MongoDB"
                : "All Rights Reserved — Crafted with Next.js 16 & MongoDB"}
            </p>
          </div>
        </div>

        {/* Social Links & Back to Top */}
        <div className="flex items-center gap-3">
          {settings?.socials?.map((social, idx) => {
            if (!social.visible) return null;
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-sm"
                title={social.platform}
              >
                {social.platform.toLowerCase() === "github" && <GithubIcon className="w-4 h-4" />}
                {social.platform.toLowerCase() === "linkedin" && <LinkedinIcon className="w-4 h-4" />}
                {social.platform.toLowerCase() === "twitter" && <TwitterIcon className="w-4 h-4" />}
                {social.platform.toLowerCase() !== "github" &&
                  social.platform.toLowerCase() !== "linkedin" &&
                  social.platform.toLowerCase() !== "twitter" && (
                    <span className="text-xs font-bold">{social.platform[0].toUpperCase()}</span>
                  )}
              </a>
            );
          })}

          <a
            href="#hero"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all shadow-sm"
            title={locale === "ar" ? "الرجوع للأعلى" : "Back to top"}
          >
            <ArrowUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
