import express from "express";
import Equipment from "../models/Equipment.js";
import Request from "../models/Request.js";
import mongoose from "mongoose";

const router = express.Router();

// GET ALL REQUESTS (Dashboard + Kanban)
router.get("/", async (req, res) => {
  try {
    const data = await Request.find()
      .populate("equipment")
      .populate("team");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* CREATE REQUEST */
router.post("/", async (req, res) => {
  try {
    const { subject, equipmentId, type, scheduledDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({ message: "Invalid equipment id" });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const request = await Request.create({
      subject,
      equipment: equipment._id,
      team: equipment.maintenanceTeam, // 🔥 AUTO
      type,
      scheduledDate,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE STATUS (KANBAN) */
router.patch("/:id/status", async (req, res) => {
  const { status, hoursSpent } = req.body;

  const request = await Request.findById(req.params.id);
  request.status = status;
  if (hoursSpent) request.hoursSpent = hoursSpent;

  await request.save();
  res.json(request);
});

router.get("/:id", async (req, res) => {
  const data = await Request.findById(req.params.id)
    .populate("equipment")
    .populate("team");

  res.json(data);
});



export default router;
