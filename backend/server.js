 import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";

// রাউট ইম্পোর্ট (নিশ্চিত করুন এই ফাইলগুলো routes ফোল্ডারে আছে)
import tournamentsRoute from "./routes/tournaments.js";
import authRoute from "./routes/auth.js";
import transactionsRoute from "./routes/transactions.js";

// ✅ ১. কনফিগারেশন ও DNS ফিক্স
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);
console.log("✅ DNS servers set to Cloudflare & Google");

const app = express();

// ✅ ২. মিডলওয়্যার
app.use(cors());
app.use(express.json()); 

// ✅ ৩. রাউট সেটআপ
app.use("/api/tournaments", tournamentsRoute);
app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionsRoute); // ওয়ালেট এপিআই এন্ডপয়েন্ট

// === ডিব্যাগিং লগ ===
console.log("=== Environment Debug ===");
console.log("MONGO_URI Status:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Undefined");

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