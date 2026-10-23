"use client";

import React, { useState, useEffect } from "react";
import { Palette, RotateCcw, Check, Loader2, Sparkles, Sun, Moon } from "lucide-react";

const defaultTheme = {
  colors: {
    light: {
      background: "#f8fafc",
      surface: "#ffffff",
      surfaceHover: "#f1f5f9",
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      secondary: "#0f766e",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
    dark: {
      background: "#080b11",
      surface: "#0f172a",
      surfaceHover: "#1e293b",
      primary: "#38bdf8",
      primaryHover: "#0ea5e9",
      secondary: "#2dd4bf",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      border: "#1e293b",
    },
  },
  fonts: {
    ar: "Cairo",
    en: "Inter",
  },
  radius: "lg",
};

export default function AdminThemePage() {
  const [theme, setTheme] = useState<any>(defaultTheme);
  const [activeMode, setActiveMode] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/theme");
        const data = await res.json();
        if (data.success && data.theme) {
          setTheme(data.theme);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleColorChange = (key: string, value: string) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [activeMode]: {
          ...theme.colors[activeMode],
          [key]: value,
        },
      },
    });
  };

  const handleReset = () => {
    if (confirm("هل تريد استعادة ألوان وإعدادات الثيم الافتراضية؟")) {
      setTheme(defaultTheme);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
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

  const currentColors = theme.colors?.[activeMode] || defaultTheme.colors[activeMode];

  const colorFields = [
    { key: "background", label: "لون الخلفية الأساسية (Background)" },
    { key: "surface", label: "سطح البطاقات والحاويات (Surface)" },
    { key: "surfaceHover", label: "سطح التمرير (Surface Hover)" },
    { key: "primary", label: "اللون الأساسي (Primary Accent)" },
    { key: "primaryHover", label: "اللون الأساسي عند التمرير (Primary Hover)" },
    { key: "secondary", label: "اللون الثانوي (Secondary Accent)" },
    { key: "text", label: "لون النصوص الرئيسية (Text)" },
    { key: "textMuted", label: "لون النصوص الفرعية (Muted Text)" },
    { key: "border", label: "لون الحدود والفواصل (Border)" },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
        <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ تحميل إعدادات المظهر...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            المظهر والهوية البصرية (Theme & Aesthetics)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            تحكم كامل في ألوان اللايت والدارك والخطوط واستدارة الحواف بدون أي كود
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>تم الحفظ!</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-3 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] max-w-md">
        <button
          type="button"
          onClick={() => setActiveMode("dark")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "dark"
              ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>ألوان الوضع الداكن (Dark Mode)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("light")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "light"
              ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>ألوان الوضع الفاتح (Light Mode)</span>
        </button>
      </div>

      {/* Two Column Grid: Color Pickers + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colors Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              <span>تعديل درجات ألوان {activeMode === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorFields.map((field) => {
                const colorVal = currentColors[field.key] || "#000000";
                return (
                  <div
                    key={field.key}
                    className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/30 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-semibold text-[var(--text)] truncate">
                        {field.label}
                      </label>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                        {colorVal}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="color"
                        value={colorVal}
                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                        className="w-9 h-9 rounded-xl border border-[var(--border)] cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography and Radius */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[var(--text)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span>الخطوط واستدارة الحواف</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  الخط العربي
                </label>
                <select
                  value={theme.fonts?.ar || "Cairo"}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      fonts: { ...theme.fonts, ar: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-semibold"
                >
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Tajawal">Tajawal (تجوال)</option>
                  <option value="Almarai">Almarai (المراعي)</option>
                  <option value="Alexandria">Alexandria (الإسكندرية)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  الخط الإنجليزي
                </label>
                <select
                  value={theme.fonts?.en || "Inter"}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      fonts: { ...theme.fonts, en: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-semibold"
                >
                  <option value="Inter">Inter</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Fira Code">Fira Code (Developer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  استدارة الحواف (Border Radius)
                </label>
                <select
                  value={theme.radius || "lg"}
                  onChange={(e) => setTheme({ ...theme, radius: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-semibold"
                >
                  <option value="none">بدون استدارة (0px)</option>
                  <option value="sm">خفيفة (4px)</option>
                  <option value="md">متوسطة (8px)</option>
                  <option value="lg">عصرية ناعمة (16px)</option>
                  <option value="full">دائرية بالكامل (Pill)</option>
                </select>
              </div>
            </div>
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
                  <span>جارٍ تطبيق وحفظ الثيم...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>حفظ وتطبيق الثيم على الموقع فوراً</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <div className="sticky top-20">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
              معاينة حية فورية للثيم ({activeMode === "dark" ? "الداكن" : "الفاتح"})
            </h3>

            <div
              style={{
                backgroundColor: currentColors.background,
                color: currentColors.text,
                borderColor: currentColors.border,
              }}
              className="p-6 rounded-3xl border shadow-2xl space-y-4 transition-colors duration-200"
            >
              {/* Fake card inside preview */}
              <div
                style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.border,
                }}
                className="p-4 rounded-2xl border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      backgroundColor: `${currentColors.primary}20`,
                      color: currentColors.primary,
                      borderColor: `${currentColors.primary}40`,
                    }}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  >
                    بطاقة تجريبية
                  </span>
                  <span
                    style={{ color: currentColors.textMuted }}
                    className="text-[11px]"
                  >
                    2026
                  </span>
                </div>

                <h4
                  style={{ color: currentColors.text }}
                  className="font-bold text-sm"
                >
                  هاشم ماهر | مهندس برمجيات
                </h4>

                <p
                  style={{ color: currentColors.textMuted }}
                  className="text-xs leading-relaxed"
                >
                  هكذا ستظهر البطاقات والألوان في موقعك للزائر بالدرجات التي تختارها تماماً وبدون وميض.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    style={{
                      backgroundColor: currentColors.primary,
                      color: "#ffffff",
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                  >
                    زر رئيسي (Primary)
                  </button>

                  <button
                    type="button"
                    style={{
                      backgroundColor: currentColors.surfaceHover,
                      color: currentColors.text,
                      borderColor: currentColors.border,
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  >
                    زر ثانوي
                  </button>
                </div>
              </div>

              <div
                style={{ color: currentColors.textMuted }}
                className="text-[11px] text-center"
              >
                الخط العربي: {theme.fonts?.ar} | الخط الإنجليزي: {theme.fonts?.en}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
