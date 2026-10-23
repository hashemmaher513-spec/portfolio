"use client";

import React, { useState, useEffect } from "react";
import { Settings, Check, Loader2, Plus, Trash2, Globe, MessageCircle, Mail } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("فشل الحفظ: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const addSocial = () => {
    setSettings({
      ...settings,
      socials: [
        ...(settings.socials || []),
        { platform: "github", url: "https://", icon: "Github", visible: true },
      ],
    });
  };

  const removeSocial = (index: number) => {
    setSettings({
      ...settings,
      socials: settings.socials.filter((_: any, i: number) => i !== index),
    });
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
        <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            الإعدادات العامة والسيو (SEO & General Settings)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            إعدادات اسم الموقع، وسائل التواصل، رقم الواتساب، والكلمات المفتاحية لمحركات البحث
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Brand Name */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3">
            اسم الموقع والهوية
          </h3>

          <BilingualInput
            label="اسم الموقع (يظهر في الهيدر والفوتر)"
            required
            value={settings.siteName}
            onChange={(siteName) => setSettings({ ...settings, siteName })}
            placeholder={{ ar: "هاشم ماهر | مطور برمجيات متكامل", en: "Hashem Maher | Full-Stack Engineer" }}
          />
        </div>

        {/* Contact Info */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[var(--primary)]" />
            <span>بيانات التواصل السريع</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                رقم الواتساب (مع كود الدولة وبدون أصفار أو +)
              </label>
              <input
                type="text"
                dir="ltr"
                value={settings.contact?.whatsapp || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, whatsapp: e.target.value.replace(/[^0-9]/g, "") },
                  })
                }
                placeholder="201000000000"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                البريد الإلكتروني المخصص للتواصل
              </label>
              <input
                type="email"
                dir="ltr"
                value={settings.contact?.email || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
                placeholder="hashemmaher2009@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--primary)]" />
              <span>حسابات التواصل الاجتماعي (Social Media)</span>
            </h3>
            <button
              type="button"
              onClick={addSocial}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة رابط</span>
            </button>
          </div>

          <div className="space-y-3">
            {settings.socials?.map((social: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40"
              >
                <select
                  value={social.platform}
                  onChange={(e) => {
                    const newSocials = [...settings.socials];
                    newSocials[idx].platform = e.target.value;
                    setSettings({ ...settings, socials: newSocials });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text)]"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                </select>

                <input
                  type="text"
                  dir="ltr"
                  value={social.url}
                  onChange={(e) => {
                    const newSocials = [...settings.socials];
                    newSocials[idx].url = e.target.value;
                    setSettings({ ...settings, socials: newSocials });
                  }}
                  placeholder="https://..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] font-mono"
                />

                <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={social.visible}
                    onChange={(e) => {
                      const newSocials = [...settings.socials];
                      newSocials[idx].visible = e.target.checked;
                      setSettings({ ...settings, socials: newSocials });
                    }}
                    className="w-3.5 h-3.5 rounded text-[var(--primary)] accent-[var(--primary)]"
                  />
                  <span>ظاهر</span>
                </label>

                <button
                  type="button"
                  onClick={() => removeSocial(idx)}
                  className="p-1 text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Configuration */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3">
            تحسين محركات البحث (SEO & OpenGraph)
          </h3>

          <BilingualInput
            label="عنوان الموقع في نتائج البحث (Meta Title)"
            required
            value={settings.seo?.title || { ar: "", en: "" }}
            onChange={(title) =>
              setSettings({
                ...settings,
                seo: { ...settings.seo, title },
              })
            }
          />

          <BilingualTextarea
            label="وصف الموقع لمحركات البحث ومواقع التواصل (Meta Description)"
            required
            rows={2}
            value={settings.seo?.description || { ar: "", en: "" }}
            onChange={(description) =>
              setSettings({
                ...settings,
                seo: { ...settings.seo, description },
              })
            }
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ الحفظ...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>حفظ جميع الإعدادات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
