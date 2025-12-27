import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  subject: { type: String, required: true },

  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },

  type: {
    type: String,
    enum: ["Corrective", "Preventive"],
    required: true,
  },

  status: {
    type: String,
    enum: ["New", "In Progress", "Repaired", "Scrap"],
    default: "New",
  },

  scheduledDate: Date,
  hoursSpent: Number,
});

export default mongoose.model("Request", requestSchema);
