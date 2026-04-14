 import mongoose from "mongoose";

/**
 * User Schema:
 * ইউজারের প্রোফাইল ইনফরমেশন, ব্যালেন্স এবং গেম স্ট্যাটিস্টিকস।
 */
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
    // ইউজারের ওয়ালেট ব্যালেন্স (ডিফল্ট ০)
    balance: { 
      type: Number, 
      default: 0 
    },
    // কয়টি ম্যাচ খেলেছে
    matchesPlayed: { 
      type: Number, 
      default: 0 
    },
    // কয়টি ম্যাচ জিতেছে
    won: { 
      type: Number, 
      default: 0 
    },
    // ইউজারের রোল (user অথবা admin)
    role: { 
      type: String, 
      default: "user" 
    },
    // প্রোফাইল পিকচার (অপশনাল)
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/147/147144.png"
    }
  },
  { timestamps: true }
);

// মডেল তৈরি এবং এক্সপোর্ট
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;