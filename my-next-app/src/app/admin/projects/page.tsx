"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Upload,
  Loader2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { BilingualTextarea } from "@/components/admin/BilingualTextarea";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [techInput, setTechInput] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openNewForm = () => {
    setEditingProject({
      slug: "",
      title: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      role: { ar: "مهندس Full-Stack", en: "Full-Stack Engineer" },
      period: "2025",
      coverImage: "",
      video: { url: "", type: "youtube" },
      problem: { ar: "", en: "" },
      solution: { ar: "", en: "" },
      result: { ar: "", en: "" },
      technologies: ["Next.js", "React", "TypeScript", "MongoDB", "Tailwind CSS"],
      links: [
        { label: { ar: "معاينة حية", en: "Live Demo" }, url: "", type: "live" },
        { label: { ar: "كود المشروع", en: "Source Code" }, url: "", type: "github" },
      ],
      featured: true,
      visible: true,
      order: projects.length,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditingProject({ ...editingProject, coverImage: data.url });
      } else {
        alert("فشل رفع الصورة: " + (data.error || "خطأ غير معروف"));
      }
    } catch (err: any) {
      alert("خطأ أثناء الرفع: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.title.ar) {
      alert("يرجى إدخال عنوان المشروع بالعربية");
      return;
    }
    if (!editingProject.slug) {
      alert("يرجى إدخال الرابط الدائم (slug)");
      return;
    }
    if (!editingProject.coverImage) {
      alert("يرجى رفع صورة الغلاف أو إدخال رابطها");
      return;
    }

    setSaving(true);
    try {
      const method = editingProject._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProject(null);
        loadProjects();
      } else {
        alert("فشل الحفظ: " + (data.error || "خطأ غير معروف"));
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف مشروع "${title}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadProjects();
      } else {
        alert("فشل الحذف: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    }
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    if (!editingProject.technologies.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((t: string) => t !== tech),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            إدارة المشاريع ودراسات الحالة (Case Studies)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            أضف وعدّل مشاريعك مع التفاصيل الهندسية والفيديوهات والصور والروابط الحية
          </p>
        </div>

        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ تحميل المشاريع...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <p className="text-sm font-semibold text-[var(--text)]">لا توجد مشاريع مضافة حتى الآن</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            اضغط على زر "إضافة مشروع جديد" لإضافة أول مشروع إلى البورتفوليو.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p._id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:border-[var(--primary)] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-44 bg-[var(--surface-hover)] overflow-hidden">
                  <img
                    src={p.coverImage || "/placeholder.png"}
                    alt={p.title.ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {p.featured && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-md flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-current" />
                        <span>مميز في الرئيسية</span>
                      </span>
                    )}
                    {!p.visible && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold shadow-md flex items-center gap-1 backdrop-blur-sm">
                        <EyeOff className="w-3 h-3" />
                        <span>مخفي</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-sm text-[var(--text)] line-clamp-1">
                    {p.title.ar}
                  </h3>
                  {p.title.en && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5" dir="ltr">
                      {p.title.en}
                    </p>
                  )}
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-2 leading-relaxed">
                    {p.summary?.ar || p.summary?.en}
                  </p>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.technologies?.slice(0, 4).map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border)] text-[10px] font-medium text-[var(--text)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {p.technologies?.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] text-[var(--text-muted)]">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-hover)]/40 flex items-center justify-between">
                <a
                  href={`/ar/projects/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة الرابط</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white text-[var(--text)] transition-colors cursor-pointer"
                    title="تعديل المشروع"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title.ar)}
                    className="p-2 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="حذف المشروع"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / New Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-3xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">
                  {editingProject._id ? "تعديل بيانات المشروع" : "إضافة مشروع جديد"}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  املأ بيانات الـ Case Study لتعرض في صفحة المشروع المنفصلة
                </p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Slug and Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                    الرابط الدائم (slug) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder="my-awesome-project"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] text-xs font-mono"
                  />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    الرابط سيكون: /ar/projects/{editingProject.slug || "slug"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                    الفترة الزمنية
                  </label>
                  <input
                    type="text"
                    value={editingProject.period || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, period: e.target.value })}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] text-xs"
                  />
                </div>
              </div>

              {/* Title & Role */}
              <BilingualInput
                label="عنوان المشروع"
                required
                value={editingProject.title}
                onChange={(title) => setEditingProject({ ...editingProject, title })}
                placeholder={{ ar: "اسم المشروع بالعربية", en: "Project title in English" }}
              />

              <BilingualInput
                label="دورك في المشروع"
                value={editingProject.role || { ar: "", en: "" }}
                onChange={(role) => setEditingProject({ ...editingProject, role })}
                placeholder={{ ar: "مثلاً: مهندس برمجيات رئيسي ومصمم الواجهات", en: "e.g. Lead Full-Stack Architect" }}
              />

              {/* Summary */}
              <BilingualTextarea
                label="ملخص سريع (يظهر في كرت المشروع)"
                required
                rows={2}
                value={editingProject.summary}
                onChange={(summary) => setEditingProject({ ...editingProject, summary })}
                placeholder={{ ar: "ملخص في سطرين عن فكرة المشروع والهدف منه...", en: "Short summary of the project..." }}
              />

              {/* Cover Image Upload (Direct Cloudinary) */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  صورة الغلاف (تُرفع مباشرة إلى Cloudinary) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {editingProject.coverImage && (
                    <img
                      src={editingProject.coverImage}
                      alt="Cover preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[var(--border)]"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--primary)] text-xs font-semibold text-[var(--text)] cursor-pointer">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                          <span>جارٍ الرفع على Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[var(--primary)]" />
                          <span>رفع صورة جديدة من جهازك</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={editingProject.coverImage}
                      onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                      placeholder="أو الصق رابط الصورة المباشر هنا..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                    />
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  رابط فيديو توضيحي (YouTube / Vimeo / Cloudinary)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={editingProject.video?.url || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      video: { ...editingProject.video, url: e.target.value },
                    })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] text-xs"
                />
              </div>

              {/* Case Study Details: Problem / Solution / Result */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/30 space-y-4">
                <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                  <span>تفاصيل دراسة الحالة (Case Study Structure)</span>
                </h4>

                <BilingualTextarea
                  label="1. المشكلة والتحدي (The Problem)"
                  rows={2}
                  value={editingProject.problem || { ar: "", en: "" }}
                  onChange={(problem) => setEditingProject({ ...editingProject, problem })}
                  placeholder={{ ar: "ما المشكلة التي كان يعاني منها العميل أو المستخدمون؟", en: "What problem was the client or users facing?" }}
                />

                <BilingualTextarea
                  label="2. الحل والنهج الهندسي (The Solution)"
                  rows={2}
                  value={editingProject.solution || { ar: "", en: "" }}
                  onChange={(solution) => setEditingProject({ ...editingProject, solution })}
                  placeholder={{ ar: "كيف بنيت الحل برمجياً ومعمارياً؟", en: "How did you architect and engineer the solution?" }}
                />

                <BilingualTextarea
                  label="3. النتائج والأرقام (The Results)"
                  rows={2}
                  value={editingProject.result || { ar: "", en: "" }}
                  onChange={(result) => setEditingProject({ ...editingProject, result })}
                  placeholder={{ ar: "ما النتائج المحققة؟ (مثلاً: زيادة السرعة 40%، تحويلات 60%)", en: "What were the measurable outcomes and improvements?" }}
                />
              </div>

              {/* Technologies Tags */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  التقنيات المستخدمة (Technologies)
                </label>
                <div className="flex gap-2 mb-2">
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
                    placeholder="اكتب تقنية واضغط Enter (مثلاً Next.js)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--text)]"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold cursor-pointer"
                  >
                    إضافة
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editingProject.technologies?.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text)]"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="text-[var(--text-muted)] hover:text-rose-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured & Visible Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--primary)] accent-[var(--primary)]"
                  />
                  <span className="text-xs font-semibold text-[var(--text)]">
                    عرض كمشروع مميز في الصفحة الرئيسية
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.visible}
                    onChange={(e) => setEditingProject({ ...editingProject, visible: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--primary)] accent-[var(--primary)]"
                  />
                  <span className="text-xs font-semibold text-[var(--text)]">
                    المشروع ظاهر للزوار (Active)
                  </span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ الحفظ والتحديث...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حفظ المشروع الآن</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
