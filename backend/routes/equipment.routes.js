import express from "express";
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

export default router;
