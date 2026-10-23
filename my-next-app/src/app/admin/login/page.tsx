"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("hashemmaher2009@gmail.com");
  const [password, setPassword] = useState("hashem123456789");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  const handleSeedInit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed");
      const data = await res.json();
      if (data.success) {
        alert("تم تجهيز قاعدة البيانات بحساب المالك والبيانات الافتراضية بنجاح!");
      } else {
        alert("حدث خطأ: " + data.error);
      }
    } catch (e: any) {
      alert("خطأ: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--primary)] opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[var(--secondary)] opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              لوحة التحكم — تسجيل الدخول
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              بورتفوليو هاشم ماهر | دخول المالك المصرح به فقط
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-center gap-3">
              <span className="font-semibold">تنبيه:</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--text-muted)] pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--text-muted)] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pr-10 pl-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/25 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Setup seed helper */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-muted)] mb-3">
              أول مرة تشغل التطبيق؟ اضغط لتهيئة الحساب والبيانات التلقائية في MongoDB Atlas:
            </p>
            <button
              type="button"
              onClick={handleSeedInit}
              className="text-xs text-[var(--primary)] hover:underline font-semibold cursor-pointer"
            >
              ⚡ تهيئة قاعدة البيانات تلقائياً (Initialize Default Data)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
