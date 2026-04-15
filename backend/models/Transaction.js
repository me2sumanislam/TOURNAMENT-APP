 import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['Deposit', 'Withdraw'], 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    method: { 
      type: String, 
      required: true 
    }, // bKash, Nagad, Rocket
    trxID: { 
      type: String 
    }, // Deposit এর জন্য
    phone: { 
      type: String 
    }, // Withdraw এর জন্য
    status: { 
      type: String, 
      default: 'Pending' // Pending, Approved, Rejected
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default Transaction;