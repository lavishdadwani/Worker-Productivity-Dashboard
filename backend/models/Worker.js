import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  worker_id: { type: String, required: true, unique: true },
  name: String,
});

export default mongoose.model("Worker", workerSchema);