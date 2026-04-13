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
    // ফ্রন্টএন্ড থেকে আসা ডাটা রিসিভ করা (date যুক্ত করা হয়েছে)
    const { title, fee, entry, prize, time, date, map, mode, totalSlots, img } = req.body;

    // ডাটা ম্যাপিং লজিক
    const tournamentData = {
      title,
      entry: entry || fee, // যদি ফ্রন্টএন্ড থেকে 'fee' আসে তবে সেটি 'entry' তে বসবে
      prize,
      time, // অ্যাডমিন প্যানেল থেকে আসা সময়
      date, // অ্যাডমিন প্যানেল থেকে আসা তারিখ
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
    console.error("Create Error:", err.message);
    // validation error মেসেজটি ফ্রন্টএন্ডে পাঠানো
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

    // মডেলের ভার্চুয়াল প্রোপার্টি isFull ব্যবহার করে চেক
    if (tournament.isFull) {
      return res.status(400).json({ error: "Sorry, this match is already full!" });
    }

    tournament.players.push({ name, phone, trxID, status: "Pending" });
    await tournament.save();
    
    res.json({ success: true, message: `Success! ${name}, your request is pending. 🔥` });
  } catch (err) {
    res.status(500).json({ error: "Join failed" });
  }
});

// ✅ ৫. পেমেন্ট স্ট্যাটাস আপডেট (PATCH)
router.patch("/status/:tournamentId/:playerId", async (req, res) => {
  const { status } = req.body; 
  try {
    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: req.params.tournamentId, "players._id": req.params.playerId },
      { $set: { "players.$.status": status } },
      { new: true }
    );

    if (!updatedTournament) return res.status(404).json({ error: "Tournament or Player not found" });
    res.json({ success: true, message: `Status updated to ${status}! ✅` });
  } catch (err) {
    res.status(500).json({ error: "Status update failed" });
  }
});

export default router;