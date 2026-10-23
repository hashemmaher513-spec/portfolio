import React from "react";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)] text-center font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto shadow-inner">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-[var(--primary)] font-mono">404</span>
          <h1 className="text-xl font-bold tracking-tight">الصفحة غير موجودة</h1>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            الصفحة أو المشروع الذي تحاول الوصول إليه غير موجود أو تم نقله.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="/ar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </a>
        </div>
      </div>
    </div>
  );
}
