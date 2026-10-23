import mongoose, { Schema, Model } from "mongoose";
import { ITheme } from "./types";

const ColorPaletteSchema = new Schema(
  {
    background: { type: String, required: true },
    surface: { type: String, required: true },
    surfaceHover: { type: String, required: true },
    primary: { type: String, required: true },
    primaryHover: { type: String, required: true },
    secondary: { type: String, required: true },
    text: { type: String, required: true },
    textMuted: { type: String, required: true },
    border: { type: String, required: true },
  },
  { _id: false }
);

const ThemeSchema = new Schema<ITheme>(
  {
    colors: {
      light: {
        type: ColorPaletteSchema,
        default: () => ({
          background: "#ffffff",
          surface: "#f8fafc",
          surfaceHover: "#f1f5f9",
          primary: "#3b82f6",
          primaryHover: "#2563eb",
          secondary: "#64748b",
          text: "#0f172a",
          textMuted: "#64748b",
          border: "#e2e8f0",
        }),
      },
      dark: {
        type: ColorPaletteSchema,
        default: () => ({
          background: "#090d16",
          surface: "#0f172a",
          surfaceHover: "#1e293b",
          primary: "#60a5fa",
          primaryHover: "#3b82f6",
          secondary: "#94a3b8",
          text: "#f8fafc",
          textMuted: "#94a3b8",
          border: "#1e293b",
        }),
      },
    },
    fonts: {
      ar: { type: String, default: "Cairo" },
      en: { type: String, default: "Inter" },
    },
    radius: {
      type: String,
      enum: ["none", "sm", "md", "lg", "full"],
      default: "lg",
    },
  },
  {
    timestamps: true,
  }
);

export const Theme: Model<ITheme> =
  mongoose.models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema);

export default Theme;
