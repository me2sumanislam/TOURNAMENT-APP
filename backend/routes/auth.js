 import express from "express";
import User from "../models/User.js"; // নিশ্চিত করুন ফাইল এক্সটেনশন .js আছে
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
  try {
    // ইমেইল আগে থেকেই আছে কি না চেক করা (ভালো প্র্যাকটিস)
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
    const { password, ...others } = user._doc; // পাসওয়ার্ড বাদে ডাটা পাঠানো
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

    // টোকেন তৈরি (secret key টি .env ফাইল থেকে নেওয়া ভালো)
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

export default router;