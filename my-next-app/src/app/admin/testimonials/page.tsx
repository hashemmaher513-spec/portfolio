"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, Upload, Loader2, X } from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openNew = () => {
    setEditingItem({
      name: "",
      position: { ar: "", en: "" },
      company: "",
      text: { ar: "", en: "" },
      avatar: "",
      order: testimonials.length,
      visible: true,
    });
  };

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
        setEditingItem({ ...editingItem, avatar: data.url });
      } else {
        alert("فشل رفع الصورة: " + data.error);
      }
    } catch (err: any) {
      alert("خطأ: " + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.name || !editingItem.text.ar) {
      alert("يرجى كتابة اسم العميل ونص التقييم بالعربية");
      return;
    }

    setSaving(true);
    try {
      const method = editingItem._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        loadTestimonials();
      } else {
        alert("فشل الحفظ: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف رأي "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadTestimonials();
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
            آراء وتقييمات العملاء (Client Testimonials)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            أضف شهادات العملاء والشركاء لبناء الثقة والمصداقية (Social Proof)
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة رأي جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب التقييمات...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <Star className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text)]">لا توجد تقييمات مضافة بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm hover:border-[var(--primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-[var(--border)]"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text)]">{t.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {t.position?.ar} {t.company ? `(${t.company})` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingItem(t)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id, t.name)}
                      className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[var(--text)] italic leading-relaxed">
                  "{t.text.ar}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-bold text-base text-[var(--text)]">
                {editingItem._id ? "تعديل رأي العميل" : "إضافة رأي جديد"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  اسم العميل أو المدير <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="مثلاً: م. أحمد الشناوي"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BilingualInput
                  label="المنصب"
                  value={editingItem.position}
                  onChange={(position) => setEditingItem({ ...editingItem, position })}
                  placeholder={{ ar: "الرئيس التنفيذي", en: "CTO" }}
                />

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    اسم الشركة
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="NextGen Studio"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  صورة العميل (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  {editingItem.avatar && (
                    <img
                      src={editingItem.avatar}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-[var(--border)]"
                    />
                  )}
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--text)] cursor-pointer">
                    {uploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                    ) : (
                      <Upload className="w-4 h-4 text-[var(--primary)]" />
                    )}
                    <span>رفع صورة</span>
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
                    value={editingItem.avatar || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                    placeholder="أو رابط الصورة..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                  />
                </div>
              </div>

              <BilingualTextarea
                label="نص الرأي أو التقييم"
                required
                rows={3}
                value={editingItem.text}
                onChange={(text) => setEditingItem({ ...editingItem, text })}
                placeholder={{ ar: "ماذا قال العميل عن تجربته معك وسرعة إنجازك...", en: "What did the client say about working with you..." }}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold cursor-pointer"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ التقييم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
