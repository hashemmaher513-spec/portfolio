"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Clock,
  Reply,
  Loader2,
  CheckCircle2,
  Archive,
  Search,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleRead = async (m: any) => {
    const newRead = !m.read;
    setMessages(messages.map((item) => (item._id === m._id ? { ...item, read: newRead } : item)));
    if (selectedMessage?._id === m._id) {
      setSelectedMessage({ ...selectedMessage, read: newRead });
    }

    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m._id, read: newRead }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الرسالة؟")) return;

    setMessages(messages.filter((item) => item._id !== id));
    if (selectedMessage?._id === id) setSelectedMessage(null);

    await fetch(`/api/admin/messages?id=${id}`, {
      method: "DELETE",
    });
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">
            صندوق الرسائل والتواصل (Inbox)
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            جميع الرسائل والاستفسارات الواردة من نموذج التواصل في الموقع العام
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute right-3 top-3 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الإيميل..."
            className="w-full pr-9 pl-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="text-xs text-[var(--text-muted)] mt-2">جارٍ جلب الرسائل...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <Mail className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold text-[var(--text)]">صندوق الرسائل فارغ</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            لم تصلك أي رسائل بعد من زوار البورتفوليو.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List Column */}
          <div className="lg:col-span-1 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filtered.map((m) => {
              const isSelected = selectedMessage?._id === m._id;
              return (
                <div
                  key={m._id}
                  onClick={() => {
                    setSelectedMessage(m);
                    if (!m.read) toggleRead(m);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 shadow-sm"
                      : m.read
                      ? "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                      : "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5 truncate">
                      {!m.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                      {new Date(m.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] truncate" dir="ltr">
                    {m.email}
                  </p>

                  <p className="text-xs text-[var(--text)] line-clamp-2 mt-2 leading-relaxed">
                    {m.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Message Detail View Column */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text)]">
                      {selectedMessage.subject || "استفسار تواصل"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text)]">
                        من: {selectedMessage.name}
                      </span>
                      <span>•</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[var(--primary)] hover:underline"
                        dir="ltr"
                      >
                        {selectedMessage.email}
                      </a>
                      <span>•</span>
                      <span>{new Date(selectedMessage.createdAt).toLocaleString("ar-EG")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRead(selectedMessage)}
                      className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                      title={selectedMessage.read ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
                    >
                      {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-2 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="bg-[var(--surface-hover)]/40 p-5 rounded-2xl border border-[var(--border)]">
                  <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.body}
                  </p>
                </div>

                {/* Reply Action */}
                <div className="flex items-center justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=رد على استفسارك: ${encodeURIComponent(
                      selectedMessage.subject || "بورتفوليو هاشم ماهر"
                    )}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-lg shadow-[var(--primary)]/20 transition-all cursor-pointer"
                  >
                    <Reply className="w-4 h-4" />
                    <span>الرد عبر البريد الإلكتروني</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                <Mail className="w-12 h-12 text-[var(--text-muted)] opacity-30 mb-3" />
                <p className="text-sm font-semibold text-[var(--text)]">
                  اختر رسالة من القائمة لعرض تفاصيلها والرد عليها
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
