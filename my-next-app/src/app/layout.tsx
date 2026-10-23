import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "هاشم ماهر | بورتفوليو مطور برمجيات متكامل",
  description: "بورتفوليو احترافي ديناميكي بالكامل لمطور Full-Stack",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
