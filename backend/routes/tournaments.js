 import express from "express";
import mongoose from "mongoose"; // ObjectId হ্যান্ডেল করার জন্য প্রয়োজন
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ ১. সকল টুর্নামেন্ট দেখার রাউট (GET)
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching matches" });
  }
});

// ✅ ২. ইউজারের জয়েন করা নির্দিষ্ট টুর্নামেন্ট দেখা (FIXED)
// এটি MyMatches.jsx থেকে কল হবে
router.get("/my-matches/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "undefined") {
        return res.status(400).json({ error: "Valid User ID is required" });
    }

    // কোড ফিক্স: অনেক সময় ডাটাবেসে ID অবজেক্ট হিসেবে থাকে, তাই কনভার্ট করে সার্চ করা হচ্ছে
    const matches = await Tournament.find({ 
      "players.userId": new mongoose.Types.ObjectId(userId) 
    });
    
    res.json(matches);
  } catch (err) {
    console.error("MyMatches Error:", err);
    res.status(500).json({ error: "Failed to fetch joined matches" });
  }
});

// ✅ ৩. নতুন টুর্নামেন্ট তৈরি করা (POST)
router.post("/", async (req, res) => {
  try {
    const { title, entry, prize, time, date, map, mode, totalSlots, img } = req.body;

    const newTournament = new Tournament({
      title, entry, prize, time, date, map, mode, totalSlots, img,
      players: [],
      roomID: "", 
      roomPass: "" 
    });

    const savedTournament = await newTournament.save();
    res.status(201).json({ success: true, message: "Match created! 🎮", data: savedTournament });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ ৪. ব্যালেন্স কেটে টুর্নামেন্টে জয়েন করা (POST)
router.post("/join/:id", async (req, res) => {
  try {
    const { userId, name, phone } = req.body;
    const tournamentId = req.params.id;

    if (!userId) return res.status(400).json({ error: "User ID is missing! 🔒" });
    if (!name) return res.status(400).json({ error: "In-game name is required! 🎮" });

    const tournament = await Tournament.findById(tournamentId);
    const user = await User.findById(userId);

    if (!tournament || !user) return res.status(404).json({ error: "Match or User not found" });

    // স্লট চেক
    if (tournament.players.length >= tournament.totalSlots) {
      return res.status(400).json({ error: "Sorry, this match is already full! 🚫" });
    }

    // ডুপ্লিকেট জয়েন চেক
    const isAlreadyJoined = tournament.players.some(p => p.userId && p.userId.toString() === userId.toString());
    if (isAlreadyJoined) {
      return res.status(400).json({ error: "You have already joined this match! ⚠️" });
    }

    // ব্যালেন্স চেক
    if (user.balance < tournament.entry) {
      return res.status(400).json({ error: "Insufficient balance! ❌ Please recharge your wallet." });
    }

    // ব্যালেন্স কাটা
    user.balance -= tournament.entry;
    await user.save();

    // প্লেয়ার তথ্য পুশ করা (অবশ্যই ObjectId হিসেবে)
    const nextSlot = tournament.players.length + 1;
    const newPlayer = { 
        userId: new mongoose.Types.ObjectId(userId), 
        name: name.trim(), 
        phone: phone || user.phone || "N/A", 
        status: "Verified", 
        slotNumber: nextSlot 
    };

    tournament.players.push(newPlayer);
    await tournament.save();
    
    res.json({ 
        success: true, 
        message: `Successfully Joined! ৳${tournament.entry} deducted. 🔥`,
        newBalance: user.balance
    });

  } catch (err) {
    console.error("Join Error:", err);
    res.status(500).json({ error: "Join failed! " + err.message });
  }
});

// ✅ ৫. রুম আইডি এবং পাসওয়ার্ড আপডেট (PATCH)
router.patch("/update-room/:id", async (req, res) => {
  const { roomID, roomPass } = req.body;
  try {
    const updatedMatch = await Tournament.findByIdAndUpdate(
      req.params.id,
      { roomID, roomPass },
      { new: true }
    );
    if (!updatedMatch) return res.status(404).json({ error: "Match not found" });
    res.json({ success: true, message: "Room ID & Password updated! 🔑" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update room info" });
  }
});

// ✅ ৬. টুর্নামেন্ট ডিলিট করা (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Match not found" });
    res.json({ success: true, message: "Match deleted! 🗑️" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;