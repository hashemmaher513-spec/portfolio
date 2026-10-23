"use client";

import React, { useState } from "react";
import { Locale, ISiteSettings, ISection } from "@/models/types";
import { getBilingualText } from "@/lib/bilingual";
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ContactSectionProps {
  locale: Locale;
  settings: ISiteSettings | null;
  section: ISection | null;
}

export function ContactSection({ locale, settings, section }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sectionTitle =
    getBilingualText(section?.title, locale) ||
    (locale === "ar" ? "تواصل معي" : "Get In Touch");

  const whatsappNumber = settings?.contact?.whatsapp || "201000000000";
  const contactEmail = settings?.contact?.email || "hashemmaher2009@gmail.com";
  const whatsappText = encodeURIComponent(
    locale === "ar"
      ? "مرحباً هاشم، تصفحت البورتفوليو الخاص بك وأريد مناقشة مشروع معك."
      : "Hello Hashem, I visited your portfolio and would like to discuss a project with you."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _hp_website_confirm: honeypot,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || (locale === "ar" ? "فشل إرسال الرسالة" : "Failed to send message"));
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setErrorMsg(
        locale === "ar"
          ? "تعذر الاتصال بالسيرفر. يرجى المحاولة مرة أخرى."
          : "Failed to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider font-mono">
            {locale === "ar" ? "لنبدأ العمل سوياً" : "Let's Connect"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct channels left column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[var(--text)]">
                {locale === "ar"
                  ? "هل لديك فكرة مشروع أو استفسار؟"
                  : "Have a project or opportunity?"}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {locale === "ar"
                  ? "أنا متاح دائماً لمناقشة المشاريع الجديدة والفرص التقنية. يمكنك إرسال رسالة مباشرة عبر النموذج أو التواصل السريع عبر واتساب."
                  : "I'm always open to discussing modern digital products, freelance projects, or full-time opportunities. Reach out directly below."}
              </p>

              <div className="space-y-3 pt-2">
                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-[var(--text-muted)]">
                      {locale === "ar" ? "محادثة فورية" : "Instant Chat"}
                    </span>
                    <span className="block text-sm font-bold text-emerald-400">
                      WhatsApp
                    </span>
                  </div>
                </a>

                {/* Direct Email card */}
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--primary)] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-[var(--text-muted)]">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email Directly"}
                    </span>
                    <span className="block text-xs font-bold text-[var(--text)] truncate" dir="ltr">
                      {contactEmail}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form right column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl relative overflow-hidden">
              {/* Feedback messages */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden from real users to catch spambots) */}
                <input
                  type="text"
                  name="_hp_website_confirm"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                      {locale === "ar" ? "اسمك الكريم" : "Your Name"}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={locale === "ar" ? "أحمد محمد" : "John Doe"}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                      {locale === "ar" ? "بريدك الإلكتروني" : "Your Email"}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                    {locale === "ar" ? "الموضوع (اختياري)" : "Subject (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={locale === "ar" ? "استفسار بخصوص مشروع جديد" : "Regarding a new project"}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                    {locale === "ar" ? "تفاصيل الرسالة" : "Your Message"}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      locale === "ar"
                        ? "اكتب تفاصيل مشروعك أو فكرتك هنا..."
                        : "Write your project details or questions here..."
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-sm text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold shadow-xl shadow-[var(--primary)]/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{locale === "ar" ? "جارٍ الإرسال..." : "Sending Message..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 rtl:rotate-180" />
                      <span>{locale === "ar" ? "إرسال الرسالة الآن" : "Send Message"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
