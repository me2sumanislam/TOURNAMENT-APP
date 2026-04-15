 import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    balance: { 
      type: Number, 
      default: 0 
    },
    matchesPlayed: { 
      type: Number, 
      default: 0 
    },
    won: { 
      type: Number, 
      default: 0 
    },
    // ✅ নতুন ফিল্ড: মোট কত কিল করেছে
    totalKills: {
      type: Number,
      default: 0
    },
    // ✅ নতুন ফিল্ড: লিডারবোর্ডের জন্য মোট পয়েন্ট
    totalPoints: {
      type: Number,
      default: 0
    },
    role: { 
      type: String, 
      default: "user" 
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/147/147144.png"
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;