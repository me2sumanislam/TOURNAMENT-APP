 import mongoose from "mongoose";

// প্রতিটি প্লেয়ারের তথ্য এবং পেমেন্ট ডিটেইলস
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
    // enum ভ্যালিডেশন অনেক সময় আপডেট ব্লক করে, তাই এটি সহজ রাখা ভালো
    default: "Pending" 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const tournamentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  entry: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  prize: { 
    type: Number, 
    default: 0 
  },
  totalSlots: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  mode: {
    type: String,
    default: "Solo"
  },
  img: { 
    type: String, 
    default: "https://img.freepik.com/free-vector/gaming-tournament-banner-template_23-2149114197.jpg" 
  },
  players: [playerSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// ভার্চুয়াল প্রপার্টি: স্লট ফুল কি না তা অটোমেটিক চেক করবে
tournamentSchema.virtual('isFull').get(function() {
  return this.players.length >= this.totalSlots;
});

// মডেল ওভাররাইট রোধ করার জন্য
const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

export default Tournament;