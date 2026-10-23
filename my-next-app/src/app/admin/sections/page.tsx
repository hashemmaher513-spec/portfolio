"use client";

import React, { useState, useEffect } from "react";
import { Sliders, ArrowUp, ArrowDown, Eye, EyeOff, Check, Loader2, GripVertical } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        if (data.success && data.sections) {
          setSections(data.sections);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    setSections(newSections);
  };

  const toggleVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index].visible = !newSections[index].visible;
    setSections(newSections);
  };

  const updateTitle = (index: number, title: any) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
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

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
        <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ تحميل أقسام الصفحة...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            هيكل وترتيب الأقسام (Section Hierarchy)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            تحكم في الأقسام المعروضة في الصفحة الرئيسية وأعد ترتيبها أو إخفائها بضغطة زر
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>تم تحديث الموقع بنجاح!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ الحفظ...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>حفظ الترتيب والظهور</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div
              key={sec._id || sec.key}
              className={`p-4 rounded-2xl border transition-all ${
                sec.visible
                  ? "border-[var(--border)] bg-[var(--surface-hover)]/40"
                  : "border-rose-500/20 bg-rose-500/5 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--text-muted)]">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-sm text-[var(--text)]">
                        {sec.title?.ar || sec.key}
                      </h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                        #{sec.key}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Move Up/Down buttons */}
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === sections.length - 1}
                    className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      sec.visible
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {sec.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>ظاهر في الموقع</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>مخفي</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Title Editor */}
              <div className="mt-3 pt-3 border-t border-[var(--border)]/50">
                <BilingualInput
                  label="عنوان القسم"
                  required
                  value={sec.title || { ar: "", en: "" }}
                  onChange={(title) => updateTitle(index, title)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
