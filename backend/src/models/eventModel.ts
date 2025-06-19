import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  category: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  status: "draft" | "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  isPrivate: boolean;
  invitedEmails?: string[];
  university?: string;
  registrationDeadline?: Date;
  allowCancellation: boolean;
  cancellationDeadlineHours: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    maxAttendees: {
      type: Number,
      required: true,
      min: 1,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    invitedEmails: {
      type: [String],
      default: [],
    },
    university: {
      type: String,
    },
    registrationDeadline: {
      type: Date,
    },
    allowCancellation: {
      type: Boolean,
      default: true,
    },
    cancellationDeadlineHours: {
      type: Number,
      default: 24,
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ isPrivate: 1 });
eventSchema.index({ university: 1 });

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
