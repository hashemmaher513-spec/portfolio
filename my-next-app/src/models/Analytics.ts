import mongoose, { Schema, Model } from "mongoose";
import { IAnalyticsEvent } from "./types";

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: {
      type: String,
      enum: ["pageview", "project_view"],
      required: true,
    },
    path: { type: String, required: true },
    projectSlug: { type: String, default: "" },
    locale: { type: String, default: "ar" },
    referrer: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Auto-expire raw analytics events after 180 days to keep database lightweight
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
