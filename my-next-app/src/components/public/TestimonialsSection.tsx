import React from "react";
import { Locale, ITestimonial, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Quote, Star } from "lucide-react";

interface TestimonialsSectionProps {
  locale: Locale;
  testimonials: ITestimonial[];
  section: ISection | null;
}

export function TestimonialsSection({
  locale,
  testimonials,
  section,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  const sectionTitle =
    getBilingualText(section?.title, locale) ||
    (locale === "ar" ? "آراء العملاء" : "Client Testimonials");

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[var(--surface-hover)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "شهادات ثقة" : "Social Proof"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={t._id || idx}
              className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm flex flex-col justify-between space-y-6 hover:border-[var(--primary)] transition-all"
            >
              <div className="space-y-4">
                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-base text-[var(--text)] leading-relaxed italic">
                  "{getBilingualText(t.text, locale)}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]/60">
                <img
                  src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={t.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[var(--border)] shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)]">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {getBilingualText(t.position, locale)} {t.company ? `— ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
