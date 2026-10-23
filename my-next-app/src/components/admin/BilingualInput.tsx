"use client";

import React, { useState } from "react";
import { BilingualText } from "@/models/types";
import { AlertCircle } from "lucide-react";

interface BilingualInputProps {
  label: string;
  value: BilingualText;
  onChange: (value: BilingualText) => void;
  required?: boolean;
  placeholder?: { ar?: string; en?: string };
  description?: string;
}

export function BilingualInput({
  label,
  value,
  onChange,
  required = true,
  placeholder,
  description,
}: BilingualInputProps) {
  const [activeTab, setActiveTab] = useState<"ar" | "en">("ar");

  const hasMissingEn = !value.en || value.en.trim() === "";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[var(--text)]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Tab Switcher & Missing indicator */}
        <div className="flex items-center gap-2">
          {hasMissingEn && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>إنجليزي ناقص</span>
            </span>
          )}

          <div className="inline-flex p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === "ar"
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === "en"
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-[var(--text-muted)]">{description}</p>
      )}

      {activeTab === "ar" ? (
        <input
          type="text"
          dir="rtl"
          required={required}
          value={value.ar || ""}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          placeholder={placeholder?.ar || "أدخل النص بالعربية..."}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all"
        />
      ) : (
        <input
          type="text"
          dir="ltr"
          value={value.en || ""}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          placeholder={placeholder?.en || "Enter text in English (optional)..."}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm transition-all"
        />
      )}
    </div>
  );
}

export default BilingualInput;
