import mongoose, { Schema, Model } from "mongoose";
import { IExperience } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: BilingualTextSchema, required: true },
    location: { type: BilingualTextSchema },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: BilingualTextSchema, required: true },
    technologies: [{ type: String }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
