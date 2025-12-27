import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: String,
  category: String,
  location: String,
  department: String,
  maintenanceTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  isScrapped: { type: Boolean, default: false }
});

export default mongoose.model("Equipment", equipmentSchema);
