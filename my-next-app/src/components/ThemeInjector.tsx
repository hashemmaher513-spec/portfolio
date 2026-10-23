import React from "react";
import { ITheme } from "@/models";

interface ThemeInjectorProps {
  theme?: ITheme | null;
}

export function ThemeInjector({ theme }: ThemeInjectorProps) {
  const light = theme?.colors?.light || {
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    secondary: "#0f766e",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  };

  const dark = theme?.colors?.dark || {
    background: "#080b11",
    surface: "#0f172a",
    surfaceHover: "#1e293b",
    primary: "#38bdf8",
    primaryHover: "#0ea5e9",
    secondary: "#2dd4bf",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#1e293b",
  };

  const radiusMap = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px",
  };

  const radius = radiusMap[theme?.radius || "lg"] || "16px";

  const css = `
    :root {
      --color-bg-light: ${light.background};
      --color-surface-light: ${light.surface};
      --color-surface-hover-light: ${light.surfaceHover};
      --color-primary-light: ${light.primary};
      --color-primary-hover-light: ${light.primaryHover};
      --color-secondary-light: ${light.secondary};
      --color-text-light: ${light.text};
      --color-text-muted-light: ${light.textMuted};
      --color-border-light: ${light.border};

      --color-bg-dark: ${dark.background};
      --color-surface-dark: ${dark.surface};
      --color-surface-hover-dark: ${dark.surfaceHover};
      --color-primary-dark: ${dark.primary};
      --color-primary-hover-dark: ${dark.primaryHover};
      --color-secondary-dark: ${dark.secondary};
      --color-text-dark: ${dark.text};
      --color-text-muted-dark: ${dark.textMuted};
      --color-border-dark: ${dark.border};

      --app-radius: ${radius};
    }

    /* Light Mode Active Variables */
    :root, html[data-theme="light"] {
      --bg: var(--color-bg-light);
      --surface: var(--color-surface-light);
      --surface-hover: var(--color-surface-hover-light);
      --primary: var(--color-primary-light);
      --primary-hover: var(--color-primary-hover-light);
      --secondary: var(--color-secondary-light);
      --text: var(--color-text-light);
      --text-muted: var(--color-text-muted-light);
      --border: var(--color-border-light);
    }

    /* Dark Mode Active Variables */
    html.dark, html[data-theme="dark"] {
      --bg: var(--color-bg-dark);
      --surface: var(--color-surface-dark);
      --surface-hover: var(--color-surface-hover-dark);
      --primary: var(--color-primary-dark);
      --primary-hover: var(--color-primary-hover-dark);
      --secondary: var(--color-secondary-dark);
      --text: var(--color-text-dark);
      --text-muted: var(--color-text-muted-dark);
      --border: var(--color-border-dark);
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    }
  `;

  const inlineScript = `
    (function() {
      try {
        var saved = localStorage.getItem('portfolio_theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch(e) {}
    })();
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
    </>
  );
}

export default ThemeInjector;
