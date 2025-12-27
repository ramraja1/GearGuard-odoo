import express from "express";
import {
  createMaintenanceTeam,
  getAllMaintenanceTeams,
  getMaintenanceTeamById,
  addTeamMember,
  removeTeamMember,
  updateMaintenanceTeam,
  deleteMaintenanceTeam
} from "../controllers/maintenanceTeam.controller.js";

const router = express.Router();

router.post("/", createMaintenanceTeam);
router.get("/", getAllMaintenanceTeams);
router.get("/:id", getMaintenanceTeamById);
router.put("/:id", updateMaintenanceTeam);
router.delete("/:id", deleteMaintenanceTeam);
router.put("/:id/add-member", addTeamMember);
router.put("/:id/remove-member", removeTeamMember);

export default router;
