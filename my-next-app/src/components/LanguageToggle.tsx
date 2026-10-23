"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/models/types";

interface LanguageToggleProps {
  currentLocale: Locale;
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Save preference to cookie
    document.cookie = `portfolio_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Swap path /ar -> /en or /en -> /ar while preserving path
    let newPath = pathname;
    if (pathname.startsWith("/ar")) {
      newPath = pathname.replace(/^\/ar/, `/${newLocale}`);
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-medium shadow-sm"
    >
      <button
        type="button"
        id="lang-btn-ar"
        onClick={() => switchLanguage("ar")}
        className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
          currentLocale === "ar"
            ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
        }`}
        aria-pressed={currentLocale === "ar"}
      >
        عربي
      </button>
      <button
        type="button"
        id="lang-btn-en"
        onClick={() => switchLanguage("en")}
        className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
          currentLocale === "en"
            ? "bg-[var(--primary)] text-white shadow-sm font-semibold"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
        }`}
        aria-pressed={currentLocale === "en"}
      >
        English
      </button>
    </div>
  );
}

export default LanguageToggle;
