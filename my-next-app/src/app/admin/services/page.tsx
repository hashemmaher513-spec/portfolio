"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Layout, Sliders, Zap, Server, Shield, Sparkles, Loader2, X } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNew = () => {
    setEditingService({
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      icon: "Layout",
      order: services.length,
      visible: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title.ar) {
      alert("يرجى كتابة عنوان الخدمة بالعربية");
      return;
    }

    setSaving(true);
    try {
      const method = editingService._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (data.success) {
        setEditingService(null);
        loadServices();
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
    if (!confirm(`هل أنت متأكد من حذف خدمة "${title}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadServices();
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
            الخدمات والحلول (Services & Offerings)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            حدد الخدمات التقنية التي تقدمها لعملائك
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب الخدمات...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <Layout className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text)]">لا توجد خدمات مضافة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv._id}
              className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingService(srv)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv._id, srv.title.ar)}
                      className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[var(--text)]">
                  {srv.title.ar}
                </h3>
                {srv.title.en && (
                  <p className="text-xs text-[var(--text-muted)]" dir="ltr">
                    {srv.title.en}
                  </p>
                )}

                <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                  {srv.description.ar}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-base text-[var(--text)]">
                {editingService._id ? "تعديل الخدمة" : "خدمة جديدة"}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <BilingualInput
                label="عنوان الخدمة"
                required
                value={editingService.title}
                onChange={(title) => setEditingService({ ...editingService, title })}
                placeholder={{ ar: "مثلاً: تطوير تطبيقات الويب الشاملة", en: "e.g. Full-Stack Web Development" }}
              />

              <BilingualTextarea
                label="وصف الخدمة"
                required
                rows={3}
                value={editingService.description}
                onChange={(description) => setEditingService({ ...editingService, description })}
                placeholder={{ ar: "اشرح باختصار ما تقدمه هذه الخدمة...", en: "Brief explanation of what this service offers..." }}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold cursor-pointer"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ الخدمة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
