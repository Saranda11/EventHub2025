import mongoose, { Document, Schema } from "mongoose";

export interface IEventRegistration extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  registrationDate: Date;
  status: "registered" | "attended" | "cancelled";
  ticketCode: string;
  qrCode?: string;
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  paymentAmount?: number;
  cancellationDate?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["registered", "attended", "cancelled"],
      default: "registered",
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate registrations
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Create indexes for efficient querying
eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ user: 1 });
eventRegistrationSchema.index({ status: 1 });
eventRegistrationSchema.index({ ticketCode: 1 });

const EventRegistration = mongoose.model<IEventRegistration>("EventRegistration", eventRegistrationSchema);

export default EventRegistration;
