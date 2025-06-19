import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: "general" | "technical" | "partnerships" | "careers";
  status: "unread" | "read" | "responded";
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ["general", "technical", "partnerships", "careers"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["unread", "read", "responded"],
      default: "unread",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message; 