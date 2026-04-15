 import express from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ ১. অ্যাড মানি রিকোয়েস্ট (Deposit)
router.post("/deposit", async (req, res) => {
  try {
    const { userId, amount, method, trxID } = req.body;
    const newDeposit = new Transaction({
      userId,
      type: "Deposit",
      amount,
      method,
      trxID,
      status: "Pending" // নিশ্চিত করছি P বড় হাতের
    });
    await newDeposit.save();
    console.log("✅ New Deposit Created:", newDeposit._id);
    res.status(200).json({ success: true, message: "Request Submitted! 🔥" });
  } catch (err) {
    console.error("❌ Deposit Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ২. উইথড্র রিকোয়েস্ট (Withdraw)
router.post("/withdraw", async (req, res) => {
  try {
    const { userId, amount, method, phone } = req.body;
    const user = await User.findById(userId);
    
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance! ❌" });
    }

    const newWithdraw = new Transaction({
      userId,
      type: "Withdraw",
      amount,
      method,
      phone,
      status: "Pending"
    });
    await newWithdraw.save();
    console.log("✅ New Withdraw Created:", newWithdraw._id);
    res.status(200).json({ success: true, message: "Withdraw request pending!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ৩. অ্যাডমিন সব পেন্ডিং রিকোয়েস্ট দেখবে
router.get("/admin/requests", async (req, res) => {
  try {
    // ডিব্যগিং এর জন্য সব ডাটা একবার চেক করা হচ্ছে
    const allCount = await Transaction.countDocuments();
    const requests = await Transaction.find({ status: "Pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    console.log(`📊 DB Stats: Total=${allCount}, Pending=${requests.length}`);
    
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Fetch Requests Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ৪. অ্যাডমিন রিকোয়েস্ট অ্যাপ্রুভ করবে
router.put("/admin/approve/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction || transaction.status !== "Pending") {
      return res.status(400).json({ error: "Request not found or already processed!" });
    }

    if (transaction.type === "Deposit") {
      await User.findByIdAndUpdate(transaction.userId, {
        $inc: { balance: transaction.amount }
      });
    } else if (transaction.type === "Withdraw") {
      await User.findByIdAndUpdate(transaction.userId, {
        $inc: { balance: -transaction.amount }
      });
    }

    transaction.status = "Approved";
    await transaction.save();

    console.log(`✅ Approved: ${transaction._id}`);
    res.status(200).json({ success: true, message: "Transaction Approved! ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ৫. অ্যাডমিন রিকোয়েস্ট রিজেক্ট করবে
router.put("/admin/reject/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    console.log(`❌ Rejected: ${req.params.id}`);
    res.status(200).json({ success: true, message: "Transaction Rejected! ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;