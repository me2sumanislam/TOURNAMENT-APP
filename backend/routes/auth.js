 import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json("Email already exists!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password!");

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" }, 
      process.env.JWT_SECRET || "your_jwt_secret", 
      { expiresIn: "1d" }
    );
    
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
 * ✅ অ্যাডমিন কর্তৃক ইউজারের রেজাল্ট আপডেট করার রাউট
 * kills: কিলের সংখ্যা
 * points: লিডারবোর্ড পয়েন্ট
 * isWinner: ইউজার কি ম্যাচটি জিতেছে? (true/false)
 */
router.post("/update-stats/:userId", async (req, res) => {
  const { userId } = req.params;
  const { kills, points, isWinner } = req.body;

  try {
    // ডাটাবেস আপডেট লজিক
    const updateData = {
      $inc: { 
        totalKills: kills || 0, 
        totalPoints: points || 0,
        matchesPlayed: 1 
      }
    };

    // যদি প্লেয়ার ম্যাচ জিতে থাকে, তবে 'won' ফিল্ড ১ বাড়বে
    if (isWinner) {
      updateData.$inc.won = 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Stats and Winner data updated!", 
      data: updatedUser 
    });
  } catch (err) {
    console.error("🔥 Error updating stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;