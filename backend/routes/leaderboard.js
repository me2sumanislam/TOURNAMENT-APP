 import express from "express";
import Tournament from "../models/Tournament.js"; // নিশ্চিত করুন আপনার টুর্নামেন্ট মডেলের পাথ ঠিক আছে কিনা

const router = express.Router();

// লিডারবোর্ড ডাটা পাওয়ার এপিআই
router.get("/", async (req, res) => {
  try {
    // ১. ডাটাবেস থেকে সব টুর্নামেন্ট নিয়ে আসা
    const tournaments = await Tournament.find();
    
    // ২. সব টুর্নামেন্ট থেকে প্লেয়ারদের স্কোর ক্যালকুলেট করার জন্য একটি ম্যাপ তৈরি
    const leaderboardMap = {};

    tournaments.forEach((tournament) => {
      if (tournament.players && tournament.players.length > 0) {
        tournament.players.forEach((player) => {
          // শুধুমাত্র 'Approved' স্ট্যাটাস থাকা প্লেয়ারদের স্কোর যোগ হবে
          if (player.status === "Approved") {
            const userId = player.userId.toString();

            if (!leaderboardMap[userId]) {
              leaderboardMap[userId] = {
                _id: userId,
                name: player.name,
                avatar: player.avatar || "https://i.ibb.co/L8N81Vy/user-placeholder.png",
                totalKills: 0,
                totalPoints: 0,
              };
            }

            // আগের স্কোরের সাথে নতুন টুর্নামেন্টের স্কোর যোগ করা
            leaderboardMap[userId].totalKills += Number(player.kills || 0);
            leaderboardMap[userId].totalPoints += Number(player.points || 0);
          }
        });
      }
    });

    // ৩. অবজেক্টকে অ্যারেতে রূপান্তর করা
    const leaderboardArray = Object.values(leaderboardMap);

    // ৪. পয়েন্ট অনুযায়ী বড় থেকে ছোট (Descending) সাজানো এবং টপ ১০ জনকে নেওয়া
    const topPlayers = leaderboardArray
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10);

    res.status(200).json(topPlayers);
  } catch (err) {
    console.error("Leaderboard API Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;