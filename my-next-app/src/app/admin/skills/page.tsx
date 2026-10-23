"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Check, Layers, X } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function AdminSkillsPage() {
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(90);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.success) {
        setSkillGroups(data.skillGroups);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openNewGroup = () => {
    setEditingGroup({
      title: { ar: "", en: "" },
      order: skillGroups.length,
      visible: true,
      skills: [],
    });
  };

  const addSkillToGroup = () => {
    if (!newSkillName.trim()) return;
    setEditingGroup({
      ...editingGroup,
      skills: [
        ...(editingGroup.skills || []),
        { name: newSkillName.trim(), level: Number(newSkillLevel) || 90 },
      ],
    });
    setNewSkillName("");
  };

  const removeSkillFromGroup = (index: number) => {
    setEditingGroup({
      ...editingGroup,
      skills: editingGroup.skills.filter((_: any, i: number) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup.title.ar) {
      alert("يرجى كتابة عنوان المجموعة بالعربية");
      return;
    }

    setSaving(true);
    try {
      const method = editingGroup._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGroup),
      });
      const data = await res.json();
      if (data.success) {
        setEditingGroup(null);
        loadSkills();
      } else {
        alert("فشل الحفظ: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف مجموعة "${title}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadSkills();
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
            المهارات والتقنيات (Skills & Technologies)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            قسّم مهاراتك إلى مجموعات (Frontend, Backend, DevOps, Tools...) مع تحديد مستواها
          </p>
        </div>

        <button
          onClick={openNewGroup}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مجموعة مهارات جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب المهارات...</p>
        </div>
      ) : skillGroups.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <Layers className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text)]">لا توجد مهارات مضافة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => (
            <div
              key={group._id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm flex flex-col justify-between hover:border-[var(--primary)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text)]">
                      {group.title.ar}
                    </h3>
                    {group.title.en && (
                      <p className="text-xs text-[var(--text-muted)]" dir="ltr">
                        {group.title.en}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingGroup(group)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(group._id, group.title.ar)}
                      className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {group.skills?.map((skill: any, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-base text-[var(--text)]">
                {editingGroup._id ? "تعديل مجموعة المهارات" : "مجموعة مهارات جديدة"}
              </h3>
              <button
                onClick={() => setEditingGroup(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <BilingualInput
                label="اسم المجموعة"
                required
                value={editingGroup.title}
                onChange={(title) => setEditingGroup({ ...editingGroup, title })}
                placeholder={{ ar: "مثلاً: الواجهات الأمامية (Frontend)", en: "e.g. Frontend Development" }}
              />

              {/* Skills list inside group */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--text)]">
                  المهارات داخل هذه المجموعة
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkillToGroup();
                      }
                    }}
                    placeholder="اسم المهارة أو الأداة (مثلاً: React 19, Docker)..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                  />
                  <button
                    type="button"
                    onClick={addSkillToGroup}
                    className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pt-2">
                  {editingGroup.skills?.map((skill: any, i: number) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkillFromGroup(i)}
                        className="text-rose-500 hover:text-rose-600 font-bold ms-1"
                        title="حذف"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold cursor-pointer"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ المجموعة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
