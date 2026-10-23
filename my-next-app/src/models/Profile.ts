import mongoose, { Schema, Model } from "mongoose";
import { IProfile } from "./types";

const BilingualTextSchema = new Schema(
  {
    ar: { type: String, required: true },
    en: { type: String, default: "" },
  },
  { _id: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: BilingualTextSchema, required: true },
    title: { type: BilingualTextSchema, required: true },
    tagline: { type: BilingualTextSchema, required: true },
    bio: { type: BilingualTextSchema, required: true },
    avatar: { type: String, default: "" },
    ctaButtons: [
      {
        text: { type: BilingualTextSchema, required: true },
        link: { type: String, required: true },
        variant: { type: String, enum: ["primary", "secondary", "outline"], default: "primary" },
        _id: false,
      },
    ],
    stats: [
      {
        label: { type: BilingualTextSchema, required: true },
        value: { type: String, required: true },
        icon: { type: String, default: "" },
        order: { type: Number, default: 0 },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
