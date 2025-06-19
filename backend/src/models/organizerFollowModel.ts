import mongoose, { Document, Schema } from "mongoose";

export interface IOrganizerFollow extends Document {
  follower: mongoose.Types.ObjectId;
  organizer: mongoose.Types.ObjectId;
  followedAt: Date;
  notificationsEnabled: boolean;
}

const organizerFollowSchema = new Schema<IOrganizerFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate follows
organizerFollowSchema.index({ follower: 1, organizer: 1 }, { unique: true });

// Create indexes for efficient querying
organizerFollowSchema.index({ follower: 1 });
organizerFollowSchema.index({ organizer: 1 });

const OrganizerFollow = mongoose.model<IOrganizerFollow>("OrganizerFollow", organizerFollowSchema);

export default OrganizerFollow;
