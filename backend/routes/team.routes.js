import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

/* CREATE TEAM */
router.post("/", async (req, res) => {
  try {
    const { name, members } = req.body;

    const team = await Team.create({
      name,
      members,
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL TEAMS */
router.get("/", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

export default router;
