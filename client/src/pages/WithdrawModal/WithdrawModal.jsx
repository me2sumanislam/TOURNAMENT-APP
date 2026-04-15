 import React, { useState } from "react";
import { X } from "lucide-react";

const WithdrawModal = ({ isOpen, onClose, availableBalance, onWithdraw }) => {
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleWithdrawClick = () => {
    if (amount < 100) {
      alert("সর্বনিম্ন ১০০ টাকা উইথড্র করা যাবে!");
      return;
    }
    if (amount > availableBalance) {
      alert("আপনার পর্যাপ্ত ব্যালেন্স নেই!");
      return;
    }
    
    // ইউজারকে পেন্ডিং মেসেজ দেখানো
    alert(`আপনার ${amount} BDT উইথড্র রিকোয়েস্টটি 'Pending' অবস্থায় আছে। অ্যাডমিন চেক করে আপনার নম্বরে টাকা পাঠিয়ে দিবে।`);
    
    onWithdraw({ selectedMethod, phone, amount });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#fff9ff] w-full max-w-[400px] rounded-[30px] p-6 shadow-2xl relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X size={24}/></button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-white px-8 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-800 mb-1">Available Amount</p>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-2xl">💵</span>
              <h2 className="text-2xl font-black text-black">BDT {availableBalance}</h2>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-6">
          {["bKash", "Nagad", "Rocket"].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all ${
                selectedMethod === m ? "border-purple-600 bg-purple-50" : "border-gray-100 bg-white"
              }`}
            >
              <span className="text-[12px] font-bold text-gray-700">{m}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Mobile Number"
            className="w-full p-4 bg-white border border-gray-300 rounded-xl outline-none focus:border-orange-500 font-medium"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 font-light">৳</span>
            <input 
              type="number" 
              placeholder="Amount to Withdraw"
              className="w-full p-4 pl-10 bg-white border border-gray-300 rounded-xl outline-none focus:border-orange-500 font-medium"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-center text-red-500 text-xs font-semibold">* Minimum Withdrawal amount is ৳100</p>
        </div>

        <button 
          onClick={handleWithdrawClick}
          className="w-full mt-6 py-4 bg-[#ff8c00] text-white rounded-full font-black text-lg shadow-lg active:scale-95 transition-all"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default WithdrawModal;