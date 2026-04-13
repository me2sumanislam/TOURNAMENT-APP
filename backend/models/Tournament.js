 import mongoose from "mongoose";

/**
 * Player Schema: 
 * টুর্নামেন্টে যারা জয়েন করবে তাদের তথ্য ও পেমেন্ট স্ট্যাটাস।
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
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * Tournament Schema: 
 * টুর্নামেন্টের ডিটেইলস, ম্যাপ, টাইম এবং স্লট ম্যানেজমেন্ট।
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
  // টাইম ফিল্ডটি স্ট্রিং হিসেবেই রাখা হলো যাতে HTML Time Input সরাসরি সেভ করা যায়
  time: {
    type: String, 
    required: [true, "Match time is required"] 
  },
  // ডেট আলাদা থাকলে ফিল্টার করতে সুবিধা হয়
  date: {
    type: String,
    required: [true, "Match date is required"]
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
  return Math.max(0, this.totalSlots - this.players.length);
});

/**
 * Virtual Property: isFull
 */
tournamentSchema.virtual('isFull').get(function() {
  return this.players.length >= this.totalSlots;
});

// মডেল ওভাররাইট রোধ করার জন্য
const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

export default Tournament;