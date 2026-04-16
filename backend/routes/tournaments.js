 import express from "express";
import mongoose from "mongoose";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ ১. সকল টুর্নামেন্ট দেখার রাউট
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching matches" });
  }
});

// ✅ ২. রুম আইডি এবং পাসওয়ার্ড দেখা (Device Fingerprint Support)
router.get("/room-info/:tournamentId/:userId", async (req, res) => {
  try {
    const { tournamentId, userId } = req.params;
    const { deviceId } = req.query;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ error: "Match not found!" });

    const player = tournament.players.find(p => p.userId.toString() === userId);
    if (!player) return res.status(403).json({ error: "You are not a participant!" });

    if (!player.ipAddress) {
      player.ipAddress = deviceId; 
      await tournament.save();
    } else if (player.ipAddress !== deviceId) {
      return res.status(403).json({ 
        error: "Access Denied! Use your original device to view credentials." 
      });
    }

    res.json({ 
      roomID: tournament.roomID, 
      roomPass: tournament.roomPass,
      slotNumber: player.slotNumber 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch room info" });
  }
});

// ✅ ৩. ইউজারের জয়েন করা টুর্নামেন্ট দেখা
router.get("/my-matches/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const matches = await Tournament.find({ 
      "players.userId": new mongoose.Types.ObjectId(userId) 
    });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// ✅ ৪. নতুন টুর্নামেন্ট তৈরি করা
router.post("/", async (req, res) => {
  try {
    const newTournament = new Tournament({ ...req.body, players: [] });
    const saved = await newTournament.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ ৫. ব্যালেন্স কেটে জয়েন করা (অটোমেটিক স্লটসহ)
router.post("/join/:id", async (req, res) => {
  try {
    const { userId, name, phone } = req.body;
    const tournament = await Tournament.findById(req.params.id);
    const user = await User.findById(userId);

    if (!tournament || !user) return res.status(404).json({ error: "Data not found" });
    if (user.balance < tournament.entry) return res.status(400).json({ error: "Insufficient balance!" });

    user.balance -= tournament.entry;
    await user.save();

    const nextSlot = tournament.players.length + 1;
    tournament.players.push({
      userId: new mongoose.Types.ObjectId(userId),
      name: name.trim(),
      phone: phone || user.phone || "N/A",
      status: "Verified",
      slotNumber: nextSlot
    });

    await tournament.save();
    res.json({ success: true, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Join failed" });
  }
});

// ✅ ৬. রুম আপডেট করা
router.patch("/update-room/:id", async (req, res) => {
  try {
    await Tournament.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: "Room updated!" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ ৭. অ্যাডমিন কর্তৃক স্লট ও রেজাল্ট আপডেট (Updated for Instant UI Reflection)
router.patch("/update-player-admin/:tournamentId/:userId", async (req, res) => {
  try {
    const { tournamentId, userId } = req.params;
    const { slotNumber, kills, points } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    const playerIndex = tournament.players.findIndex(p => p.userId.toString() === userId);
    if (playerIndex === -1) return res.status(404).json({ error: "Player not found" });

    // ডাটা আপডেট
    if (slotNumber !== undefined) tournament.players[playerIndex].slotNumber = Number(slotNumber);
    tournament.players[playerIndex].kills = Number(kills) || 0;
    tournament.players[playerIndex].points = Number(points) || 0;

    tournament.markModified('players');
    const updatedTournament = await tournament.save();

    // রেজাল্ট পাঠানোর সময় success: true এবং আপডেটেড ডাটা পাঠানো হচ্ছে
    res.json({ 
      success: true, 
      message: "Data updated successfully! ✅",
      data: updatedTournament 
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update: " + err.message });
  }
});

// ✅ ৮. ডিভাইস লক রিসেট করা
router.patch("/reset-ip/:tournamentId/:userId", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);
    const player = tournament.players.find(p => p.userId.toString() === req.params.userId);
    if (player) {
      player.ipAddress = null;
      await tournament.save();
      return res.json({ success: true, message: "Device lock removed!" });
    }
    res.status(404).json({ error: "Player not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

// ✅ ৯. টুর্নামেন্ট ডিলিট করা
router.delete("/:id", async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;