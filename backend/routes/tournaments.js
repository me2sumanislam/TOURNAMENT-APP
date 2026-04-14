 import express from "express";
import Tournament from "../models/Tournament.js"; 

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

// ✅ ৪. প্লেয়ার জয়েন করার জন্য (POST)
router.post("/join/:id", async (req, res) => {
  const { name, phone, trxID } = req.body;
  
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: "Match not found" });

    if (tournament.isFull) {
      return res.status(400).json({ error: "Sorry, this match is already full!" });
    }

    // শুরুতে স্লট ০ থাকে, ভেরিফাই হলে স্লট নাম্বার বসবে
    tournament.players.push({ name, phone, trxID, status: "Pending", slotNumber: 0 });
    await tournament.save();
    
    res.json({ success: true, message: `Success! ${name}, your request is pending. 🔥` });
  } catch (err) {
    res.status(500).json({ error: "Join failed" });
  }
});

// ✅ ৫. পেমেন্ট স্ট্যাটাস আপডেট ও অটোমেটিক স্লট এসাইন (PATCH)
router.patch("/status/:tournamentId/:playerId", async (req, res) => {
  const { status } = req.body; 
  try {
    const tournament = await Tournament.findById(req.params.tournamentId);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    let assignedSlot = 0;

    // যদি এডমিন কাউকে 'Verified' করে, তবে তাকে পরবর্তী খালি স্লটটি দেওয়া হবে
    if (status === "Verified") {
      const approvedPlayers = tournament.players.filter(p => p.status === "Verified");
      assignedSlot = approvedPlayers.length + 1; 
    }

    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: req.params.tournamentId, "players._id": req.params.playerId },
      { 
        $set: { 
          "players.$.status": status,
          "players.$.slotNumber": assignedSlot 
        } 
      },
      { new: true }
    );

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