 import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";                    // ← DNS fix এর জন্য
import tournamentsRoute from "./routes/tournaments.js";

// ✅ dotenv + DNS fix সবার উপরে
dotenv.config();

// DNS servers সেট করো (Cloudflare + Google) - querySrv এরর fix করার জন্য
dns.setServers(["1.1.1.1", "8.8.8.8"]);
console.log("✅ DNS servers set to 1.1.1.1 and 8.8.8.8");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tournaments", tournamentsRoute);

// === Debugging ===
console.log("=== Environment Debug ===");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Undefined");
console.log("Current directory:", process.cwd());

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI পাওয়া যায়নি! .env ফাইল চেক করো");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,   // 10 সেকেন্ড অপেক্ষা করবে
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
    if (err.message.includes("ECONNREFUSED")) {
      console.error("💡 টিপ: DNS সমস্যা হলে .env-এ mongodb:// (non-SRV) string ব্যবহার করো");
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});