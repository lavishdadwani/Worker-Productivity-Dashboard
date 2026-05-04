import mongoose from "mongoose";

const workstationSchema = new mongoose.Schema({
  workstation_id: { type: String, required: true, unique: true },
  name: String,
});

export default mongoose.model("Workstation", workstationSchema);