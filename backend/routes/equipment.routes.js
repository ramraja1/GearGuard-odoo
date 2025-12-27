import express from "express";
import Equipment from "../models/Equipment.js";
import mongoose from "mongoose";

const router = express.Router();

/* CREATE EQUIPMENT */
router.post("/", async (req, res) => {
  try {
    const { name, category, location, department, maintenanceTeam } = req.body;

    if (!mongoose.Types.ObjectId.isValid(maintenanceTeam)) {
      return res.status(400).json({ message: "Invalid team id" });
    }

    const equipment = await Equipment.create({
      name,
      category,
      location,
      department,
      maintenanceTeam,
    });

    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL EQUIPMENT */
router.get("/", async (req, res) => {
  const data = await Equipment.find().populate("maintenanceTeam");
  res.json(data);
});

export default router;
