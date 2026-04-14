 import mongoose from "mongoose";

/**
 * Player Schema: 
 * টুর্নামেন্টে যারা জয়েন করবে তাদের তথ্য, পেমেন্ট স্ট্যাটাস এবং নির্দিষ্ট স্লট নাম্বার।
 */
const playerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    default: "N/A", 
    trim: true 
  },
  trxID: { 
    type: String, 
    default: "N/A", 
    trim: true 
  },
  status: { 
    type: String, 
    default: "Pending" // Pending, Verified, Rejected
  },
  // স্লট ম্যানেজমেন্টের জন্য নতুন ফিল্ড
  slotNumber: { 
    type: Number, 
    default: 0 // অ্যাডমিন যখন ভেরিফাই করবে তখন ১-৪৮ এর মধ্যে একটি নাম্বার বসবে
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * Tournament Schema: 
 * টুর্নামেন্টের ডিটেইলস, ম্যাপ, রুম আইডি-পাসওয়ার্ড এবং স্লট কন্ট্রোল।
 */
const tournamentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Match title is required"], 
    trim: true 
  },
  entry: { 
    type: Number, 
    required: [true, "Entry fee is required"], 
    min: 0 
  },
  prize: { 
    type: Number, 
    default: 0 
  },
  totalSlots: { 
    type: Number, 
    default: 48 
  },
  mode: {
    type: String,
    default: "Solo" // Solo, Duo, Squad
  },
  map: {
    type: String,
    default: "Bermuda" // Bermuda, Purgatory, Kalahari
  },
  time: {
    type: String, 
    required: [true, "Match time is required"] 
  },
  date: {
    type: String,
    required: [true, "Match date is required"]
  },
  // রুম আইডি এবং পাসওয়ার্ড (BattleZone এর মতো শুধুমাত্র ভেরিফাইড প্লেয়াররা দেখবে)
  roomID: { 
    type: String, 
    default: "" 
  },
  roomPass: { 
    type: String, 
    default: "" 
  },
  img: { 
    type: String, 
    default: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg" 
  },
  status: {
    type: String,
    default: "open" // open, ongoing, completed
  },
  players: [playerSchema],
}, { 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true },
  timestamps: true 
});

/**
 * Virtual Property: slotsLeft
 */
tournamentSchema.virtual('slotsLeft').get(function() {
  // শুধুমাত্র যারা Approved হয়েছে তাদের সংখ্যা বাদ দিয়ে স্লট হিসাব করা ভালো
  const filledSlots = this.players.filter(p => p.status === "Approved").length;
  return Math.max(0, this.totalSlots - filledSlots);
});

/**
 * Virtual Property: isFull
 */
tournamentSchema.virtual('isFull').get(function() {
  const filledSlots = this.players.filter(p => p.status === "Approved").length;
  return filledSlots >= this.totalSlots;
});

// মডেল ওভাররাইট রোধ করার জন্য
const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

export default Tournament;