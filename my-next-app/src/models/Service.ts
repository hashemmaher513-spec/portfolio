import mongoose, { Schema, Model } from "mongoose";
import { IService } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    title: { type: BilingualTextSchema, required: true },
    description: { type: BilingualTextSchema, required: true },
    icon: { type: String, default: "Code" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
