"use client";

import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe, Eye, CheckCircle2 } from "lucide-react";

interface AdminHeaderProps {
  adminEmail: string;
}

export function AdminHeader({ adminEmail }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>قاعدة البيانات متصلة</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Public site link */}
        <a
          href="/ar"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] hover:border-[var(--primary)] text-[var(--text)] text-xs font-semibold transition-all shadow-sm"
        >
          <Eye className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>معاينة الموقع العام</span>
        </a>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default AdminHeader;
