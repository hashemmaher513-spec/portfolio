import React from "react";
import { Locale } from "@/models/types";
import { connectToDatabase } from "@/lib/mongodb";
import { Theme, SiteSettings } from "@/models";
import { ThemeInjector } from "@/components/ThemeInjector";
import { getBilingualText } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === "en" ? "en" : "ar";

  let settings: any = null;
  try {
    await connectToDatabase();
    settings = await SiteSettings.findOne().lean();
  } catch (e) {
    console.error("Metadata settings load error:", e);
  }

  const title =
    getBilingualText(settings?.seo?.title, currentLocale) ||
    (currentLocale === "ar"
      ? "هاشم ماهر — مهندس برمجيات متكامل | Portfolio"
      : "Hashem Maher — Senior Full-Stack Engineer | Portfolio");

  const description =
    getBilingualText(settings?.seo?.description, currentLocale) ||
    (currentLocale === "ar"
      ? "بورتفوليو هندسي يعرض دراسات حالة لمشاريع رقمية حديثة، مهارات الـ Full-Stack، وأفضل معايير الأداء والـ SEO."
      : "High-performance software engineering portfolio featuring in-depth case studies, scalable architectures, and modern web applications.");

  return {
    title,
    description,
    keywords: settings?.seo?.keywords || [
      "Full-Stack Developer",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "MongoDB",
      "Software Engineer",
    ],
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: currentLocale === "ar" ? "ar_AR" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "en" ? "en" : "ar";
  const dir = currentLocale === "ar" ? "rtl" : "ltr";

  let theme = null;
  try {
    await connectToDatabase();
    theme = await Theme.findOne().lean();
  } catch (e) {
    console.error("Theme load error:", e);
  }

  return (
    <div lang={currentLocale} dir={dir} className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <ThemeInjector theme={theme as any} />
      {children}
    </div>
  );
}
