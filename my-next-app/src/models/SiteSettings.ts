import mongoose, { Schema, Model } from "mongoose";
import { ISiteSettings } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: BilingualTextSchema, required: true },
    defaultLocale: { type: String, enum: ["ar", "en"], default: "ar" },
    defaultTheme: { type: String, enum: ["system", "dark", "light"], default: "system" },
    logo: {
      light: { type: String, default: "" },
      dark: { type: String, default: "" },
    },
    favicon: { type: String, default: "" },
    resumeUrl: {
      ar: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    contact: {
      email: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: BilingualTextSchema },
    },
    socials: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: "" },
        visible: { type: Boolean, default: true },
        _id: false,
      },
    ],
    seo: {
      title: { type: BilingualTextSchema, required: true },
      description: { type: BilingualTextSchema, required: true },
      ogImage: { type: String, default: "" },
      keywords: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
