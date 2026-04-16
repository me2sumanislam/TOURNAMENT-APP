 import mongoose from "mongoose";

/**
 * Player Schema: 
 * টুর্নামেন্টে যারা জয়েন করবে তাদের তথ্য, পেমেন্ট স্ট্যাটাস, রেজাল্ট এবং সিকিউরিটি।
 */
const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  // স্লট ম্যানেজমেন্ট
  slotNumber: { 
    type: Number, 
    default: 0 
  },
  /**
   * ✅ Match Results:
   * ম্যাচ শেষে ইউজারের পারফরম্যান্স সেভ করার জন্য এই ফিল্ডগুলো প্রয়োজন।
   */
  kills: { 
    type: Number, 
    default: 0 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  /**
   * ✅ IP/Device Tracking Field:
   * ইউজার যখন প্রথমবার রুম আইডি দেখবে, তখন তার Fingerprint/IP এখানে সেভ হবে।
   */
  ipAddress: { 
    type: String, 
    default: null 
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
    default: "Bermuda" 
  },
  time: {
    type: String, 
    required: [true, "Match time is required"] 
  },
  date: {
    type: String,
    required: [true, "Match date is required"]
  },
  // রুম আইডি এবং পাসওয়ার্ড
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
  const filledSlots = this.players.filter(p => p.status === "Verified").length;
  return Math.max(0, this.totalSlots - filledSlots);
});

/**
 * Virtual Property: isFull
 */
tournamentSchema.virtual('isFull').get(function() {
  const filledSlots = this.players.filter(p => p.status === "Verified").length;
  return filledSlots >= this.totalSlots;
});

// মডেল ওভাররাইট রোধ করার জন্য
const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

export default Tournament;