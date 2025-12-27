import Equipment from "../models/Equipment.model.js";
import MaintenanceRequest from "../models/MaintenanceRequest.model.js";

/**
 * =========================
 * CREATE EQUIPMENT
 * =========================
 */
export const createEquipment = async (req, res) => {
  try {
    const {
      name,
      serialNumber,
      department,
      location,
      assignedTeam
    } = req.body;

    if (!name || !serialNumber || !department || !location) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const existing = await Equipment.findOne({ serialNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Equipment with this serial number already exists"
      });
    }

    const equipment = await Equipment.create({
      name,
      serialNumber,
      department,
      location,
      assignedTeam
    });

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      equipment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create equipment",
      error: error.message
    });
  }
};

/**
 * =========================
 * GET ALL EQUIPMENTS
 * =========================
 */
export const getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find()
      .populate("assignedTeam", "teamName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: equipments.length,
      equipments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipments"
    });
  }
};

/**
 * =========================
 * GET SINGLE EQUIPMENT
 * =========================
 */
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate("assignedTeam", "teamName");

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    // Smart Button Count (Open Requests)
    const openRequestsCount = await MaintenanceRequest.countDocuments({
      equipment: equipment._id,
      status: { $in: ["New", "In Progress"] }
    });

    res.status(200).json({
      success: true,
      equipment,
      openRequestsCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipment"
    });
  }
};

/**
 * =========================
 * UPDATE EQUIPMENT
 * =========================
 */
export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      equipment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update equipment"
    });
  }
};

/**
 * =========================
 * DELETE EQUIPMENT
 * =========================
 */
export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete equipment"
    });
  }
};

/**
 * =========================
 * SCRAP EQUIPMENT (BUSINESS LOGIC)
 * =========================
 */
export const scrapEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    }

    equipment.isScrapped = true;
    await equipment.save();

    // Update all open maintenance requests to "Scrap"
    await MaintenanceRequest.updateMany(
      { equipment: equipment._id },
      { status: "Scrap" }
    );

    res.status(200).json({
      success: true,
      message: "Equipment scrapped successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to scrap equipment"
    });
  }
};

/**
 * =========================
 * GET EQUIPMENT MAINTENANCE REQUESTS
 * (SMART BUTTON FUNCTION)
 * =========================
 */
export const getEquipmentRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      equipment: req.params.id
    })
      .populate("assignedTo", "name")
      .populate("team", "teamName")
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
