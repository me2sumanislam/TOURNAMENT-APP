 import express from "express";
import User from "../models/User.js";

const router = express.Router();

// লিডারবোর্ড ডাটা পাওয়ার এপিআই
router.get("/", async (req, res) => {
  try {
    // পয়েন্ট অনুযায়ী বড় থেকে ছোট (Descending) সাজিয়ে টপ ১০ জনকে আনবে
    const topPlayers = await User.find({ role: "user" })
      .sort({ totalPoints: -1 }) 
      .limit(10)
      .select("name totalPoints totalKills avatar");

    res.status(200).json(topPlayers);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;