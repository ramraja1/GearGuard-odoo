import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String }] // simple: names/emails
});

export default mongoose.model("Team", teamSchema);
