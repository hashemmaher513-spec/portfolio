import mongoose, { Schema, Model } from "mongoose";
import { ISkillGroup } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const SkillGroupSchema = new Schema<ISkillGroup>(
  {
    title: { type: BilingualTextSchema, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    skills: [
      {
        name: { type: String, required: true },
        icon: { type: String, default: "" },
        level: { type: Number, min: 0, max: 100 },
        category: { type: String, default: "" },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const SkillGroup: Model<ISkillGroup> =
  mongoose.models.SkillGroup || mongoose.model<ISkillGroup>("SkillGroup", SkillGroupSchema);

export default SkillGroup;
