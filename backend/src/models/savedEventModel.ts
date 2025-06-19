import mongoose, { Document, Schema } from "mongoose";

export interface ISavedEvent extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  savedAt: Date;
  notes?: string;
}

const savedEventSchema = new Schema<ISavedEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate saves
savedEventSchema.index({ user: 1, event: 1 }, { unique: true });

// Create indexes for efficient querying
savedEventSchema.index({ user: 1 });
savedEventSchema.index({ event: 1 });

const SavedEvent = mongoose.model<ISavedEvent>("SavedEvent", savedEventSchema);

export default SavedEvent;
