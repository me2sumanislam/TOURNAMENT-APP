 import express from "express";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ ১. সব টুর্নামেন্ট দেখার রাউট (GET)
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching matches" });
  }
});

// ✅ ২. ইউজারের জয়েন করা নির্দিষ্ট টুর্নামেন্ট দেখা
router.get("/my-matches/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    
    const matches = await Tournament.find({ "players.userId": userId });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch joined matches" });
  }
});

// ✅ ৩. নতুন টুর্নামেন্ট যোগ করা (POST)
router.post("/", async (req, res) => {
  try {
    const { title, entry, prize, time, date, map, mode, totalSlots, img } = req.body;

    const newTournament = new Tournament({
      title,
      entry,
      prize,
      time,
      date,
      map,
      mode,
      totalSlots,
      img,
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

// ✅ ৪. অটোমেটিক ব্যালেন্স কেটে প্লেয়ার জয়েন (POST) - UPDATED TO FIX VALIDATION ERROR
router.post("/join/:id", async (req, res) => {
  try {
    const { userId, name, phone } = req.body;
    const tournamentId = req.params.id;

    // ১. ডাটা চেক (যদি নাম বা আইডি না থাকে তবে এখানেই থামিয়ে দেবে)
    if (!userId) return res.status(400).json({ error: "User ID is missing! 🔒" });
    if (!name) return res.status(400).json({ error: "In-game name is required! 🎮" });

    const tournament = await Tournament.findById(tournamentId);
    const user = await User.findById(userId);

    if (!tournament) return res.status(404).json({ error: "Match not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ২. চেক করা ম্যাচ ফুল কি না
    if (tournament.players.length >= tournament.totalSlots) {
      return res.status(400).json({ error: "Sorry, this match is already full! 🚫" });
    }

    // ৩. চেক করা ইউজার অলরেডি জয়েন করেছে কি না (Safe Check)
    const isAlreadyJoined = tournament.players.some(p => p.userId && p.userId.toString() === userId.toString());
    
    if (isAlreadyJoined) {
      return res.status(400).json({ error: "You have already joined this match! ⚠️" });
    }

    // ৪. ব্যালেন্স চেক
    if (user.balance < tournament.entry) {
      return res.status(400).json({ error: "Insufficient balance! ❌ Please recharge your wallet." });
    }

    // ৫. ব্যালেন্স কাটা এবং সেভ করা
    user.balance -= tournament.entry;
    await user.save();

    // ৬. প্লেয়ার অ্যাড করা (নিশ্চিত করা হয়েছে যে name ফিল্ডে ডাটা যাচ্ছে)
    const nextSlot = tournament.players.length + 1;
    
    const newPlayer = { 
        userId: user._id, 
        name: name.trim(), // ইনপুট থেকে আসা নাম
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

// ✅ ৬. টুর্নামেন্ট মুছে ফেলা (DELETE)
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