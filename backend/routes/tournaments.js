 import express from "express";
import Tournament from "../models/Tournament.js"; // Ensure this model exists

const router = express.Router();

// ✅ Get all tournaments
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Join a tournament
router.post("/join/:id", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    tournament.players.push({ name });
    await tournament.save();

    res.json({ message: `Player ${name} joined ${tournament.title}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;