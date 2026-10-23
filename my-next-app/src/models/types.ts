/**
 * Core bilingual string type used across the entire dynamic portfolio.
 * Arabic is required by default, English is optional with smart fallback.
 */
export interface BilingualText {
  ar: string;
  en?: string;
}

export interface BilingualRichText {
  ar: string;
  en?: string;
}

export type Locale = "ar" | "en";
export type ThemeMode = "system" | "dark" | "light";

export interface IAdmin {
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteSettings {
  _id?: string;
  siteName: BilingualText;
  defaultLocale: Locale;
  defaultTheme: ThemeMode;
  logo: {
    light?: string;
    dark?: string;
  };
  favicon?: string;
  resumeUrl?: {
    ar?: string;
    en?: string;
  };
  contact: {
    email: string;
    whatsapp: string;
    phone?: string;
    address?: BilingualText;
  };
  socials: Array<{
    platform: string;
    url: string;
    icon?: string;
    visible: boolean;
  }>;
  seo: {
    title: BilingualText;
    description: BilingualText;
    ogImage?: string;
    keywords?: string[];
  };
  updatedAt: Date;
}

export interface ITheme {
  _id?: string;
  colors: {
    light: {
      background: string;
      surface: string;
      surfaceHover: string;
      primary: string;
      primaryHover: string;
      secondary: string;
      text: string;
      textMuted: string;
      border: string;
    };
    dark: {
      background: string;
      surface: string;
      surfaceHover: string;
      primary: string;
      primaryHover: string;
      secondary: string;
      text: string;
      textMuted: string;
      border: string;
    };
  };
  fonts: {
    ar: string;
    en: string;
  };
  radius: "none" | "sm" | "md" | "lg" | "full";
  updatedAt: Date;
}

export interface ISection {
  _id?: string;
  key: string;
  title: BilingualText;
  subtitle?: BilingualText;
  visible: boolean;
  order: number;
  config?: Record<string, unknown>;
}

export interface IProfile {
  _id?: string;
  name: BilingualText;
  title: BilingualText;
  tagline: BilingualText;
  bio: BilingualRichText;
  avatar: string;
  ctaButtons: Array<{
    text: BilingualText;
    link: string;
    variant: "primary" | "secondary" | "outline";
  }>;
  stats: Array<{
    label: BilingualText;
    value: string;
    icon?: string;
    order: number;
  }>;
}

export interface ISkillGroup {
  _id?: string;
  title: BilingualText;
  order: number;
  visible: boolean;
  skills: Array<{
    name: string;
    icon?: string;
    level?: number;
    category?: string;
  }>;
}

export interface IExperience {
  _id?: string;
  company: string;
  role: BilingualText;
  location?: BilingualText;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: BilingualText;
  technologies: string[];
  order: number;
  visible: boolean;
}

export interface IProject {
  _id?: string;
  slug: string;
  title: BilingualText;
  summary: BilingualText;
  role?: BilingualText;
  period?: string;
  coverImage: string;
  video?: {
    url?: string;
    type?: "upload" | "youtube" | "vimeo";
  };
  problem?: BilingualRichText;
  solution?: BilingualRichText;
  result?: BilingualRichText;
  technologies: string[];
  gallery: Array<{
    url: string;
    alt?: BilingualText;
  }>;
  links: Array<{
    label: BilingualText;
    url: string;
    type: "live" | "github" | "other";
  }>;
  featured: boolean;
  order: number;
  visible: boolean;
  views: number;
  seo?: {
    title?: BilingualText;
    description?: BilingualText;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IService {
  _id?: string;
  title: BilingualText;
  description: BilingualText;
  icon: string;
  order: number;
  visible: boolean;
}

export interface ITestimonial {
  _id?: string;
  name: string;
  position: BilingualText;
  company: string;
  text: BilingualText;
  avatar?: string;
  order: number;
  visible: boolean;
}

export interface IMessage {
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  body: string;
  read: boolean;
  archived: boolean;
  createdAt: Date;
}

export interface IAnalyticsEvent {
  _id?: string;
  type: "pageview" | "project_view";
  path: string;
  projectSlug?: string;
  locale: string;
  referrer?: string;
  createdAt: Date;
}
