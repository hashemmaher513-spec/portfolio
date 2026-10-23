import React from "react";
import { Locale } from "@/models/types";
import { getPortfolioData } from "@/lib/data";
import { seedDatabase } from "@/lib/seed";
import { isDatabaseConfigured } from "@/lib/mongodb";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = locale === "en" ? "en" : "ar";

  let data = await getPortfolioData();

  // If database was empty / not yet seeded, seed it automatically so the site is vibrant!
  if (!data.profile && isDatabaseConfigured) {
    try {
      await seedDatabase();
      data = await getPortfolioData();
    } catch (e) {
      console.error("Auto-seed failed:", e);
    }
  }

  const {
    settings,
    sections,
    profile,
    skillGroups,
    experiences,
    projects,
    services,
    testimonials,
  } = data;

  // Render a specific section based on key
  const renderSection = (key: string, sectionObj: any) => {
    switch (key) {
      case "hero":
        return (
          <HeroSection
            key="hero"
            locale={currentLocale}
            profile={profile}
            settings={settings}
          />
        );
      case "about":
        return (
          <AboutSection
            key="about"
            locale={currentLocale}
            profile={profile}
            section={sectionObj}
          />
        );
      case "skills":
        return (
          <SkillsSection
            key="skills"
            locale={currentLocale}
            skillGroups={skillGroups}
            section={sectionObj}
          />
        );
      case "experience":
        return (
          <ExperienceSection
            key="experience"
            locale={currentLocale}
            experiences={experiences}
            section={sectionObj}
          />
        );
      case "projects":
        return (
          <ProjectsSection
            key="projects"
            locale={currentLocale}
            projects={projects}
            section={sectionObj}
          />
        );
      case "services":
        return (
          <ServicesSection
            key="services"
            locale={currentLocale}
            services={services}
            section={sectionObj}
          />
        );
      case "testimonials":
        return (
          <TestimonialsSection
            key="testimonials"
            locale={currentLocale}
            testimonials={testimonials}
            section={sectionObj}
          />
        );
      case "contact":
        return (
          <ContactSection
            key="contact"
            locale={currentLocale}
            settings={settings}
            section={sectionObj}
          />
        );
      default:
        return null;
    }
  };

  // Sort visible sections according to order
  const orderedSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name ? (currentLocale === "ar" ? profile.name.ar : profile.name.en || profile.name.ar) : "Hashem Maher",
    jobTitle: profile?.title ? (currentLocale === "ar" ? profile.title.ar : profile.title.en || profile.title.ar) : "Full-Stack Software Engineer",
    description: profile?.bio ? (currentLocale === "ar" ? profile.bio.ar : profile.bio.en || profile.bio.ar) : undefined,
    url: `${siteUrl}/${currentLocale}`,
    image: profile?.avatar || undefined,
    sameAs: settings?.socials?.map((s) => s.url).filter(Boolean) || [],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Top Navbar */}
      <Navbar
        locale={currentLocale}
        settings={settings}
        sections={sections}
      />

      {/* Main Dynamic Content Area */}
      <main className="flex-1">
        {orderedSections.length > 0 ? (
          orderedSections.map((sec) => renderSection(sec.key, sec))
        ) : (
          // Default fallback order if no sections in DB yet
          <>
            <HeroSection locale={currentLocale} profile={profile} settings={settings} />
            <AboutSection locale={currentLocale} profile={profile} section={null} />
            <SkillsSection locale={currentLocale} skillGroups={skillGroups} section={null} />
            <ExperienceSection locale={currentLocale} experiences={experiences} section={null} />
            <ProjectsSection locale={currentLocale} projects={projects} section={null} />
            <ServicesSection locale={currentLocale} services={services} section={null} />
            <TestimonialsSection locale={currentLocale} testimonials={testimonials} section={null} />
            <ContactSection locale={currentLocale} settings={settings} section={null} />
          </>
        )}
      </main>

      {/* Bottom Footer */}
      <Footer locale={currentLocale} settings={settings} />
    </div>
  );
}
