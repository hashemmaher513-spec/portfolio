import mongoose, { Schema, Model } from "mongoose";
import { IProject } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: BilingualTextSchema, required: true },
    summary: { type: BilingualTextSchema, required: true },
    role: { type: BilingualTextSchema },
    period: { type: String, default: "" },
    coverImage: { type: String, required: true },
    video: {
      url: { type: String, default: "" },
      type: { type: String, enum: ["upload", "youtube", "vimeo"], default: "youtube" },
    },
    problem: { type: BilingualTextSchema },
    solution: { type: BilingualTextSchema },
    result: { type: BilingualTextSchema },
    technologies: [{ type: String }],
    gallery: [
      {
        url: { type: String, required: true },
        alt: { type: BilingualTextSchema },
        _id: false,
      },
    ],
    links: [
      {
        label: { type: BilingualTextSchema, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ["live", "github", "other"], default: "live" },
        _id: false,
      },
    ],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    seo: {
      title: { type: BilingualTextSchema },
      description: { type: BilingualTextSchema },
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
