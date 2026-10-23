import React from "react";
import { Locale, IService, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Layout, Sliders, Zap, Server, Shield, Sparkles } from "lucide-react";

interface ServicesSectionProps {
  locale: Locale;
  services: IService[];
  section: ISection | null;
}

export function ServicesSection({ locale, services, section }: ServicesSectionProps) {
  if (services.length === 0) return null;

  const sectionTitle = getBilingualText(section?.title, locale) || (locale === "ar" ? "خدماتي" : "Services");
  const icons = [Layout, Sliders, Zap, Server, Shield, Sparkles];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "حلول متكاملة" : "What I Deliver"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={srv._id || i}
                className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:bg-[var(--surface-hover)]/40 transition-all duration-300 shadow-sm flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">
                    {getBilingualText(srv.title, locale)}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {getBilingualText(srv.description, locale)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
