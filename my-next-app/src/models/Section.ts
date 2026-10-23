import mongoose, { Schema, Model } from "mongoose";
import { ISection } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: { type: BilingualTextSchema, required: true },
    subtitle: { type: BilingualTextSchema },
    visible: { type: Boolean, default: true },
    order: { type: Number, required: true, default: 0 },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

export const Section: Model<ISection> =
  mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);

export default Section;
