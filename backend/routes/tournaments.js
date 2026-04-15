 import express from "express";
import Tournament from "../models/Tournament.js";
import User from "../models/User.js"; // ব্যালেন্স চেক করার জন্য ইউজার মডেল প্রয়োজন

const router = express.Router();

// ✅ ১. সব টুর্নামেন্ট দেখার জন্য (GET)
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching matches" });
  }
});

// ✅ ২. নতুন টুর্নামেন্ট যোগ করার জন্য (POST)
router.post("/", async (req, res) => {
  try {
    const { title, fee, entry, prize, time, date, map, mode, totalSlots, img } = req.body;

    const tournamentData = {
      title,
      entry: entry || fee,
      prize,
      time,
      date,
      map,
      mode,
      totalSlots,
      img
    };

    const newTournament = new Tournament(tournamentData);
    const savedTournament = await newTournament.save();
    
    res.status(201).json({
      success: true,
      message: "Match created successfully! 🎮",
      data: savedTournament
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ ৩. টুর্নামেন্ট মুছে ফেলার জন্য (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Match not found" });
    res.json({ success: true, message: "Tournament deleted successfully! 🗑️" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ✅ ৪. প্লেয়ার জয়েন করার জন্য (POST) - ব্যালেন্স চেকসহ আপডেট করা হয়েছে
router.post("/join/:id", async (req, res) => {
  const { userId, name, phone, trxID } = req.body;
  
  try {
    const tournament = await Tournament.findById(req.params.id);
    const user = await User.findById(userId);

    if (!tournament) return res.status(404).json({ error: "Match not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ১. চেক করা ম্যাচ ফুল কি না
    if (tournament.isFull) {
      return res.status(400).json({ error: "Sorry, this match is already full!" });
    }

    // ২. চেক করা ইউজার অলরেডি জয়েন করেছে কি না
    const isAlreadyJoined = tournament.players.some(p => p.userId.toString() === userId);
    if (isAlreadyJoined) {
      return res.status(400).json({ error: "You have already joined this match!" });
    }

    // ৩. ব্যালেন্স চেক (যদি ইউজার ওয়ালেট দিয়ে জয়েন করে)
    if (user.balance < tournament.entry) {
        return res.status(400).json({ error: "Insufficient balance! Please add money to your wallet." });
    }

    // ৪. জয়েন করানো (শুরুতে স্লট ০ থাকে, অ্যাডমিন ভেরিফাই করলে স্লট নম্বর বসবে)
    tournament.players.push({ 
        userId, 
        name, 
        phone, 
        trxID, 
        status: "Pending", 
        slotNumber: 0 
    });

    await tournament.save();
    
    res.json({ 
        success: true, 
        message: `Success! ${name}, your join request is pending. 🔥` 
    });

  } catch (err) {
    res.status(500).json({ error: "Join failed! " + err.message });
  }
});

// ✅ ৫. পেমেন্ট স্ট্যাটাস আপডেট ও অটোমেটিক স্লট এসাইন (PATCH)
router.patch("/status/:tournamentId/:playerId", async (req, res) => {
  const { status } = req.body; 
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    const playerIndex = tournament.players.findIndex(p => p._id.toString() === req.params.playerId);
    if (playerIndex === -1) return res.status(404).json({ error: "Player not found" });

    let assignedSlot = 0;

    // যদি এডমিন কাউকে 'Verified' করে, তবে তাকে পরবর্তী খালি স্লটটি দেওয়া হবে
    if (status === "Verified") {
      // বর্তমানের ভেরিফাইড প্লেয়ার সংখ্যা গুনে পরবর্তী স্লট এসাইন করা
      const verifiedPlayersCount = tournament.players.filter(p => p.status === "Verified").length;
      assignedSlot = verifiedPlayersCount + 1; 

      // এখানে আপনি চাইলে ইউজারের ব্যালেন্স থেকে টাকা কেটে নেওয়ার লজিকও দিতে পারেন যদি আগে না কাটেন
      // await User.findByIdAndUpdate(tournament.players[playerIndex].userId, { $inc: { balance: -tournament.entry } });
    }

    // আপডেট লজিক
    tournament.players[playerIndex].status = status;
    tournament.players[playerIndex].slotNumber = assignedSlot;

    await tournament.save();

    res.json({ 
      success: true, 
      message: `Player is now ${status}! Slot Number: ${assignedSlot} 🎯` 
    });
  } catch (err) {
    res.status(500).json({ error: "Status update failed" });
  }
});

// ✅ ৬. রুম আইডি এবং পাসওয়ার্ড আপডেট করার জন্য (PATCH)
router.patch("/update-room/:id", async (req, res) => {
  const { roomID, roomPass } = req.body;
  try {
    const updatedMatch = await Tournament.findByIdAndUpdate(
      req.params.id,
      { roomID, roomPass },
      { new: true }
    );

    if (!updatedMatch) return res.status(404).json({ error: "Match not found" });

    res.json({ 
      success: true, 
      message: "Room ID & Password updated! 🔑", 
      data: updatedMatch 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update room info" });
  }
});

export default router;