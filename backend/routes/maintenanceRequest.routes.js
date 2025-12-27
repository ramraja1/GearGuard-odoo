import express from "express";
import {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  assignTechnician,
  updateRequestStatus,
  getPreventiveRequests,
  deleteMaintenanceRequest
} from "../controllers/maintenanceRequest.controller.js";

const router = express.Router();

router.post("/", createMaintenanceRequest);
router.get("/", getAllMaintenanceRequests);
router.put("/:id/assign", assignTechnician);
router.put("/:id/status", updateRequestStatus);
router.get("/preventive/calendar", getPreventiveRequests);
router.delete("/:id", deleteMaintenanceRequest);

export default router;
