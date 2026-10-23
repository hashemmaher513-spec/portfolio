"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, Sparkles, Loader2, X } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (data.success) {
        setExperiences(data.experiences);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const openNew = () => {
    setEditingExp({
      company: "",
      role: { ar: "", en: "" },
      startDate: "2024",
      endDate: "",
      current: false,
      description: { ar: "", en: "" },
      technologies: ["React", "TypeScript", "Node.js"],
      order: experiences.length,
      visible: true,
    });
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    if (!editingExp.technologies.includes(techInput.trim())) {
      setEditingExp({
        ...editingExp,
        technologies: [...editingExp.technologies, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    setEditingExp({
      ...editingExp,
      technologies: editingExp.technologies.filter((t: string) => t !== tech),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp.company || !editingExp.role.ar) {
      alert("يرجى كتابة اسم الشركة والمسمى الوظيفي بالعربية");
      return;
    }

    setSaving(true);
    try {
      const method = editingExp._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      });
      const data = await res.json();
      if (data.success) {
        setEditingExp(null);
        loadExperiences();
      } else {
        alert("فشل الحفظ: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`هل أنت متأكد من حذف خبرة "${company}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadExperiences();
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            المسيرة والخبرات المهنية (Career Timeline)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            أضف الشركات والمناصب والمسؤوليات البرمجية التي عملت عليها
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خبرة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب الخبرات...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <Sparkles className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text)]">لا توجد خبرات مضافة بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-[var(--text)]">
                    {exp.company}
                  </h3>
                  <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-0.5 rounded-full border border-[var(--primary)]/20">
                    {exp.role.ar}
                  </span>
                  {exp.current && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      حتى الآن
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {exp.startDate} — {exp.current ? "حتى الآن" : exp.endDate}
                  </span>
                </p>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 max-w-2xl">
                  {exp.description.ar}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setEditingExp(exp)}
                  className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp._id, exp.company)}
                  className="p-2 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-base text-[var(--text)]">
                {editingExp._id ? "تعديل الخبرة المهنية" : "إضافة خبرة جديدة"}
              </h3>
              <button
                onClick={() => setEditingExp(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  اسم الشركة أو الجهة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="مثلاً: Tech Solutions Studio"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                />
              </div>

              <BilingualInput
                label="المسمى الوظيفي (Role)"
                required
                value={editingExp.role}
                onChange={(role) => setEditingExp({ ...editingExp, role })}
                placeholder={{ ar: "مثلاً: مطور برمجيات رئيسي", en: "e.g. Lead Software Engineer" }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    سنة أو تاريخ البداية
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.startDate}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    تاريخ النهاية
                  </label>
                  <input
                    type="text"
                    disabled={editingExp.current}
                    value={editingExp.endDate || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    placeholder={editingExp.current ? "حتى الآن (مستمر)" : "2024"}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)] font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingExp.current}
                  onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--primary)] accent-[var(--primary)]"
                />
                <span className="text-xs font-semibold text-[var(--text)]">
                  أعمل هنا حالياً (حتى الآن / Present)
                </span>
              </label>

              <BilingualTextarea
                label="الوصف والإنجازات (Description)"
                required
                rows={3}
                value={editingExp.description}
                onChange={(description) => setEditingExp({ ...editingExp, description })}
                placeholder={{ ar: "صف دورك ومسؤولياتك والتقنيات التي طورتها...", en: "Describe your responsibilities and achievements..." }}
              />

              {/* Tech Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--text)]">
                  التقنيات المستخدمة
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="اكتب تقنية واضغط Enter..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editingExp.technologies?.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text)]"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="text-rose-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold cursor-pointer"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ الخبرة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
