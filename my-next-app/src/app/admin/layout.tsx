import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { ThemeInjector } from "@/components/ThemeInjector";
import { connectToDatabase } from "@/lib/mongodb";
import { Theme } from "@/models";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If no session, we render children (which could be the login page).
  // The AdminSidebar and AdminHeader are only rendered when logged in.
  let themeData = null;
  try {
    await connectToDatabase();
    themeData = await Theme.findOne().lean();
  } catch (e) {
    console.error("Theme load error in admin:", e);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row font-sans" dir="rtl">
      <ThemeInjector theme={themeData as any} />

      {session ? (
        <>
          {/* Admin Sidebar */}
          <AdminSidebar adminEmail={session.email} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader adminEmail={session.email} />
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </>
      ) : (
        <div className="flex-1 w-full">{children}</div>
      )}
    </div>
  );
}
