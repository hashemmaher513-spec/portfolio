import mongoose, { Schema, Model } from "mongoose";
import { IMessage } from "./types";

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: "", trim: true },
    body: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
