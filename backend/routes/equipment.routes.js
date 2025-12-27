import express from "express";
<<<<<<< HEAD
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
=======
import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  scrapEquipment,
  getEquipmentRequests
} from "../controllers/equipment.controller.js";

const router = express.Router();

router.post("/", createEquipment);
router.get("/", getAllEquipments);
router.get("/:id", getEquipmentById);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);
router.put("/:id/scrap", scrapEquipment);
router.get("/:id/maintenance", getEquipmentRequests);
>>>>>>> 2455d38 (added controller, middleware, routes)

export default router;
