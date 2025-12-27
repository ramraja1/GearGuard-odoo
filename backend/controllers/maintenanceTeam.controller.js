import MaintenanceTeam from "../models/MaintenanceTeam.model.js";
import User from "../models/User.model.js";

/**
 * =========================
 * CREATE MAINTENANCE TEAM
 * =========================
 */
export const createMaintenanceTeam = async (req, res) => {
  try {
    const { teamName, members } = req.body;

    if (!teamName) {
      return res.status(400).json({
        success: false,
        message: "Team name is required"
      });
    }

    // Prevent duplicate team names
    const existingTeam = await MaintenanceTeam.findOne({ teamName });
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Maintenance team already exists"
      });
    }

    const team = await MaintenanceTeam.create({
      teamName,
      members: members || []
    });

    res.status(201).json({
      success: true,
      message: "Maintenance team created successfully",
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create maintenance team",
      error: error.message
    });
  }
};

/**
 * =========================
 * GET ALL MAINTENANCE TEAMS
 * =========================
 */
export const getAllMaintenanceTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance teams"
    });
  }
};

/**
 * =========================
 * GET SINGLE TEAM
 * =========================
 */
export const getMaintenanceTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate("members", "name email role");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Maintenance team not found"
      });
    }

    res.status(200).json({
      success: true,
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance team"
    });
  }
};

/**
 * =========================
 * ADD MEMBER TO TEAM
 * =========================
 */
export const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Maintenance team not found"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already part of this team"
      });
    }

    team.members.push(userId);
    await team.save();

    res.status(200).json({
      success: true,
      message: "Team member added successfully",
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add team member"
    });
  }
};

/**
 * =========================
 * REMOVE MEMBER FROM TEAM
 * =========================
 */
export const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Maintenance team not found"
      });
    }

    team.members = team.members.filter(
      member => member.toString() !== userId
    );

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team member removed successfully",
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove team member"
    });
  }
};

/**
 * =========================
 * UPDATE MAINTENANCE TEAM
 * =========================
 */
export const updateMaintenanceTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Maintenance team not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance team updated successfully",
      team
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update maintenance team"
    });
  }
};

/**
 * =========================
 * DELETE MAINTENANCE TEAM
 * =========================
 */
export const deleteMaintenanceTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Maintenance team not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance team deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete maintenance team"
    });
  }
};
