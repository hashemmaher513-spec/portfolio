"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  Sparkles,
  Wrench,
  MessageSquare,
  Palette,
  Sliders,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  adminEmail: string;
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "لوحة القيادة", href: "/admin", icon: LayoutDashboard },
    { name: "الملف الشخصي والـ Hero", href: "/admin/profile", icon: User },
    { name: "المشاريع ودراسات الحالة", href: "/admin/projects", icon: Briefcase },
    { name: "المهارات والتقنيات", href: "/admin/skills", icon: Layers },
    { name: "الخبرات والمسيرة", href: "/admin/experience", icon: Sparkles },
    { name: "الخدمات المقدمة", href: "/admin/services", icon: Wrench },
    { name: "آراء العملاء", href: "/admin/testimonials", icon: Sparkles },
    { name: "صندوق الرسائل", href: "/admin/messages", icon: MessageSquare },
    { name: "المظهر والألوان (Theme)", href: "/admin/theme", icon: Palette },
    { name: "هيكل وترتيب الأقسام", href: "/admin/sections", icon: Sliders },
    { name: "الإعدادات العامة والسيو", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface)]">
        <span className="font-bold text-sm tracking-wide text-[var(--primary)]">
          لوحة تحكم البورتفوليو
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg border border-[var(--border)] text-[var(--text)]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 z-40 inset-y-0 right-0 w-64 border-l border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        } h-screen overflow-y-auto`}
      >
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-[var(--text)] tracking-tight">
                لوحة المالك
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                تحكم ديناميكي كامل
              </p>
            </div>
            <a
              href="/ar"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              title="معاينة الموقع الحي"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold shadow-[var(--primary)]/20"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Logout */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 flex items-center justify-center font-bold text-xs text-[var(--primary)]">
              {adminEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text)] truncate">
                المالك
              </p>
              <p className="text-[11px] text-[var(--text-muted)] truncate" dir="ltr">
                {adminEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
