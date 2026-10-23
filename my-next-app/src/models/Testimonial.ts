import mongoose, { Schema, Model } from "mongoose";
import { ITestimonial } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    position: { type: BilingualTextSchema, required: true },
    company: { type: String, default: "", trim: true },
    text: { type: BilingualTextSchema, required: true },
    avatar: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
