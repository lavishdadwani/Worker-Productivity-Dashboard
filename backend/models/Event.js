import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  event_id: { type: String, unique: true, required: true },

  timestamp: { type: Date, required: true },

  worker_id: { type: String, required: true },
  workstation_id: { type: String, required: true },

  event_type: {
    type: String,
    enum: ["working", "idle", "absent", "product_count"],
    required: true,
  },

  confidence: { type: Number, default: null },
  count: { type: Number, default: 0 },
}, { timestamps: true });

// helpful indexes
eventSchema.index({ worker_id: 1, timestamp: 1 });
eventSchema.index({ workstation_id: 1, timestamp: 1 });

export default mongoose.model("Event", eventSchema);