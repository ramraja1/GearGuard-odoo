import MaintenanceRequest from "../models/MaintenanceRequest.model.js";
import Equipment from "../models/Equipment.model.js";

/**
 * =========================
 * CREATE MAINTENANCE REQUEST
 * (AUTO-FILL LOGIC IMPLEMENTED)
 * =========================
 */
export const createMaintenanceRequest = async (req, res) => {
  try {
    const {
      subject,
      type,
      equipmentId,
      scheduledDate
    } = req.body;

    // 1. Basic validation
    if (!subject || !type || !equipmentId) {
      return res.status(400).json({
        success: false,
        message: "Subject, type and equipment are required"
      });
    }

    // 2. Fetch equipment (AUTO-FILL SOURCE)
    const equipment = await Equipment.findById(equipmentId).populate("assignedTeam");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    // 3. AUTO-FILL LOGIC
    const maintenanceRequest = await MaintenanceRequest.create({
      subject,
      type, // Corrective | Preventive
      equipment: equipment._id,
      team: equipment.assignedTeam?._id || null,
      status: "New",
      scheduledDate: type === "Preventive" ? scheduledDate : null
    });

    res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      maintenanceRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create maintenance request",
      error: error.message
    });
  }
};

/**
 * =========================
 * GET ALL MAINTENANCE REQUESTS
 * =========================
 */
export const getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("equipment", "name serialNumber")
      .populate("team", "teamName")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance requests"
    });
  }
};

/**
 * =========================
 * ASSIGN TECHNICIAN
 * =========================
 */
export const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    request.assignedTo = technicianId;
    request.status = "In Progress";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Technician assigned successfully",
      request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign technician"
    });
  }
};

/**
 * =========================
 * UPDATE REQUEST STATUS
 * (KANBAN DRAG & DROP)
 * =========================
 */
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, duration } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    request.status = status;

    // If repaired, save duration
    if (status === "Repaired") {
      request.duration = duration || 0;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update request"
    });
  }
};

/**
 * =========================
 * GET PREVENTIVE REQUESTS
 * (CALENDAR VIEW)
 * =========================
 */
export const getPreventiveRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      type: "Preventive"
    })
      .populate("equipment", "name")
      .populate("assignedTo", "name");

    res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preventive requests"
    });
  }
};

/**
 * =========================
 * DELETE MAINTENANCE REQUEST
 * =========================
 */
export const deleteMaintenanceRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete maintenance request"
    });
  }
};
