 import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";

// রাউট ইম্পোর্ট
import tournamentsRoute from "./routes/tournaments.js";
import authRoute from "./routes/auth.js";
import transactionsRoute from "./routes/transactions.js";
// ✅ নতুন রাউট ইমপোর্ট (লিডারবোর্ড)
import leaderboardRoute from "./routes/leaderboard.js";

// ✅ ১. কনফিগারেশন ও DNS ফিক্স
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);
console.log("✅ DNS servers set to Cloudflare & Google");

const app = express();

// ✅ ২. মিডলওয়্যার
app.use(cors());
app.use(express.json()); 

// হেলথ চেক রুট
app.get("/", (req, res) => {
  res.send("🚀 Tournament Server is Running...");
});

// ✅ ৩. রাউট সেটআপ
app.use("/api/tournaments", tournamentsRoute);
app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionsRoute); 
// ✅ লিডারবোর্ড রাউট কানেক্ট করা হলো
app.use("/api/leaderboard", leaderboardRoute);

// === ডিব্যাগিং লগ ===
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing! Check .env file.");
  process.exit(1);
}

// ✅ ৪. ডাটাবেস কানেকশন
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// ✅ ৫. গ্লোবাল এরর হ্যান্ডলার
app.use((err, req, res, next) => {
  console.error("🔥 Server Error Stack:", err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Server Error", 
    error: err.message 
  });
});

// ✅ ৬. সার্ভার লিসেন
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});