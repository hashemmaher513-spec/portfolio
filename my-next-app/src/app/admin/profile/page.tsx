"use client";

import React, { useState, useEffect } from "react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";
import { Upload, Loader2, Check, Plus, Trash2 } from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/profile");
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
        } else {
          setProfile({
            name: { ar: "هاشم ماهر", en: "Hashem Maher" },
            title: { ar: "مهندس برمجيات متكامل", en: "Full-Stack Software Engineer" },
            tagline: { ar: "أبني حلولاً رقمية وتطبيقات ويب فائقة السرعة.", en: "Crafting scalable, high-performance web applications." },
            bio: { ar: "مطور شغوف ببناء المنتجات الرقمية الحديثة بمقاييس عالمية.", en: "Passionate engineer dedicated to building modern digital products." },
            avatar: "",
            stats: [
              { label: { ar: "سنوات خبرة", en: "Years Experience" }, value: "4+" },
              { label: { ar: "مشروع منجز", en: "Completed Projects" }, value: "25+" },
              { label: { ar: "رضا العملاء", en: "Client Satisfaction" }, value: "99%" },
            ],
            ctaButtons: [
              { text: { ar: "تواصل معي الآن", en: "Get In Touch" }, link: "#contact", variant: "primary" },
              { text: { ar: "استكشف أعمالي", en: "Explore Projects" }, link: "#projects", variant: "outline" },
            ],
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfile({ ...profile, avatar: data.url });
      } else {
        alert("فشل رفع الصورة: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ أثناء الرفع: " + e.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
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

  const addStat = () => {
    setProfile({
      ...profile,
      stats: [
        ...(profile.stats || []),
        { label: { ar: "إنجاز جديد", en: "New Achievement" }, value: "10+", order: profile.stats?.length || 0 },
      ],
    });
  };

  const removeStat = (index: number) => {
    setProfile({
      ...profile,
      stats: profile.stats.filter((_: any, i: number) => i !== index),
    });
  };

  if (loading || !profile) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
        <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ تحميل بيانات الملف الشخصي...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            الملف الشخصي والـ Hero
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            عدّل معلوماتك الشخصية، الصورة، المسمى، الجملة الترحيبية، وأرقام الخبرة
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>تم حفظ التعديلات بنجاح!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Upload Card */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--primary)] shadow-md"
            />
          </div>

          <div className="space-y-2 text-center sm:text-right flex-1">
            <h3 className="font-bold text-sm text-[var(--text)]">
              الصورة الشخصية (تُرفع إلى Cloudinary)
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              يفضل استخدام صورة مربعة واضحة تبرز هويتك كمطور محترف.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 justify-center sm:justify-start">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                {uploadingAvatar ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ الرفع...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>تغيير الصورة</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>

              <input
                type="text"
                dir="ltr"
                value={profile.avatar || ""}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                placeholder="أو الصق رابط الصورة المباشر..."
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
              />
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3">
            الاسم والمسمى الوظيفي
          </h3>

          <BilingualInput
            label="الاسم الكامل"
            required
            value={profile.name}
            onChange={(name) => setProfile({ ...profile, name })}
          />

          <BilingualInput
            label="المسمى الوظيفي"
            required
            value={profile.title}
            onChange={(title) => setProfile({ ...profile, title })}
            placeholder={{ ar: "مثلاً: مهندس برمجيات Full-Stack", en: "e.g. Senior Full-Stack Engineer" }}
          />

          <BilingualTextarea
            label="الجملة التعريفية السريعة (Tagline في الهيرو)"
            required
            rows={2}
            value={profile.tagline}
            onChange={(tagline) => setProfile({ ...profile, tagline })}
            placeholder={{ ar: "الجملة المؤثرة التي يراها الزائر أول ما يفتح الموقع...", en: "Impactful tagline visitors see upon landing..." }}
          />

          <BilingualTextarea
            label="النبذة التفصيلية (قسم عني - About)"
            required
            rows={4}
            value={profile.bio}
            onChange={(bio) => setProfile({ ...profile, bio })}
            placeholder={{ ar: "نبذة عن خلفيتك، شغفك، وما تقدمه للعملاء والشركات...", en: "Details on your background, expertise, and what you deliver..." }}
          />
        </div>

        {/* Stats Numbers */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[var(--text)]">
                أرقام وإحصائيات سريعة (Stats)
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                تظهر في قسم "نبذة عني" كأرقام إنجاز بارزة
              </p>
            </div>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--text)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>إضافة رقم</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.stats?.map((stat: any, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40"
              >
                <div className="w-full sm:w-28">
                  <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                    القيمة
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...profile.stats];
                      newStats[index].value = e.target.value;
                      setProfile({ ...profile, stats: newStats });
                    }}
                    placeholder="4+ أو 99%"
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] font-bold text-center"
                  />
                </div>

                <div className="flex-1 w-full">
                  <BilingualInput
                    label="التسمية"
                    required
                    value={stat.label}
                    onChange={(label) => {
                      const newStats = [...profile.stats];
                      newStats[index].label = label;
                      setProfile({ ...profile, stats: newStats });
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer sm:mt-5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ الحفظ والتحديث...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات في قاعدة البيانات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
