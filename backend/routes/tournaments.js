 import express from "express";
import Tournament from "../models/Tournament.js"; 

const router = express.Router();

// ✅ ১. সব টুর্নামেন্ট দেখার জন্য (GET)
router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ ২. নতুন টুর্নামেন্ট যোগ করার জন্য (POST)
router.post("/", async (req, res) => {
  try {
    const newTournament = new Tournament(req.body);
    const savedTournament = await newTournament.save();
    res.status(201).json(savedTournament);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ ৩. টুর্নামেন্ট মুছে ফেলার জন্য (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Tournament deleted successfully!" });
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

    tournament.players.push({ 
      name, 
      phone, 
      trxID,
      status: "Pending" 
    });

    await tournament.save();
    res.json({ message: `Success! ${name}, your request is pending for approval. 🔥` });
  } catch (err) {
    console.error("Join Error:", err.message);
    res.status(500).json({ error: "Join failed" });
  }
});

// ✅ ৫. পেমেন্ট স্ট্যাটাস আপডেট করার জন্য (PATCH)
router.patch("/status/:tournamentId/:playerId", async (req, res) => {
  const { status } = req.body; 
  
  try {
    // সরাসরি আপডেট করার চেষ্টা (এতে এরর হওয়ার সম্ভাবনা কম থাকে)
    const updatedTournament = await Tournament.findOneAndUpdate(
      { _id: req.params.tournamentId, "players._id": req.params.playerId },
      { $set: { "players.$.status": status } },
      { new: true, runValidators: false } // ভ্যালিডেশন শিথিল করা হলো যাতে ফেইল না করে
    );

    if (!updatedTournament) {
      return res.status(404).json({ error: "Tournament or Player not found" });
    }

    res.json({ message: `Player status updated to ${status}! ✅` });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: "Status update failed", details: err.message });
  }
});

export default router;