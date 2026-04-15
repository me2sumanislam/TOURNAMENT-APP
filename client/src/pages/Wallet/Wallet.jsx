 import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import axios from "axios"; // ✅ axios ইমপোর্ট করুন
import { 
  ChevronRight, Info, PlayCircle, Wallet as WalletIcon, Copy, X 
} from "lucide-react";
import WithdrawModal from "../WithdrawModal/WithdrawModal.jsx";

const AddMoneyModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext); // ✅ ইউজার ডাটা নেওয়ার জন্য
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [trxID, setTrxID] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const paymentNumber = "01952606134";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!trxID || !amount) {
      alert("দয়া করে ট্রানজেকশন আইডি এবং টাকার পরিমাণ সঠিকভাবে দিন।");
      return;
    }

    try {
      // ✅ ডাটাবেসে পাঠানোর জন্য অবজেক্ট
      const depositData = {
        userId: user._id,
        amount: Number(amount),
        method: selectedMethod,
        trxID: trxID
      };

      const res = await axios.post("http://localhost:5000/api/transactions/deposit", depositData);

      if (res.data.success) {
        alert(`আপনার ${amount} BDT অ্যাড করার রিকোয়েস্টটি জমা হয়েছে। অ্যাডমিন ভেরিফাই করলে ব্যালেন্স অ্যাড হবে।`);
        setAmount("");
        setTrxID("");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "সার্ভার এরর! আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[400px] rounded-[30px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-around p-3 bg-gray-50 border-b">
          {["bKash", "Rocket", "Nagad"].map((m) => (
            <button key={m} onClick={() => setSelectedMethod(m)} className={`flex flex-col items-center p-2 px-4 rounded-xl border-2 transition-all ${selectedMethod === m ? "border-pink-600 bg-pink-50" : "border-gray-100 bg-white"}`}>
              <span className={`text-[10px] font-bold ${selectedMethod === m ? "text-pink-600" : "text-gray-400"}`}>{m}</span>
            </button>
          ))}
        </div>
        <div className="p-5 bg-[#d81b60] relative">
          <h3 className="text-white text-center font-bold mb-5 italic uppercase tracking-wider text-sm">ট্রানজেকশন আইডি ও পরিমাণ দিন</h3>
          <div className="space-y-4">
            <div className="relative">
               <label className="absolute -top-2 left-4 bg-[#d81b60] px-2 text-[10px] text-white z-10">Amount</label>
               <input type="number" className="w-full p-4 bg-transparent border-2 border-white rounded-xl text-white outline-none font-bold" placeholder="টাকার পরিমাণ" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="relative">
               <label className="absolute -top-2 left-4 bg-[#d81b60] px-2 text-[10px] text-white z-10">Transaction ID</label>
               <input type="text" className="w-full p-4 bg-transparent border-2 border-white rounded-xl text-white outline-none uppercase font-bold" placeholder="TrxID দিন" value={trxID} onChange={(e) => setTrxID(e.target.value)} />
            </div>
            <div className="text-white text-[12px] space-y-2 leading-tight bg-black/10 p-3 rounded-2xl border border-white/20">
              <p>• আপনার {selectedMethod} পেমেন্ট নম্বর: <span className="font-bold underline">{paymentNumber}</span></p>
              <button onClick={handleCopy} className="bg-white text-[#d81b60] px-3 py-1 rounded-md font-bold text-xs mt-1">{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <button onClick={handleVerify} className="w-full mt-6 py-4 bg-white text-[#d81b60] rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all">VERIFY</button>
          <button onClick={onClose} className="w-full mt-3 text-white/50 text-[11px] font-bold">CLOSE</button>
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const { user } = useContext(AuthContext);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div className="bg-[#f7f9fc] min-h-screen p-4 font-sans text-gray-900 pb-20">
      <div className="bg-white rounded-[30px] shadow-sm p-6 mb-4 flex justify-between items-center border-b-4 border-gray-100">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cash Balance</p>
          <h1 className="text-4xl font-black text-gray-800">BDT {user?.balance || 0}</h1>
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl"><WalletIcon size={24} className="text-blue-500" /></div>
      </div>

      <div className="bg-white rounded-[30px] shadow-sm overflow-hidden mb-6 border border-gray-50">
        <BalanceRow icon="🏆" label="Winning Cash Balance" amount={user?.winningBalance || 0} btnText="WITHDRAW" btnColor="bg-[#4CAF50]" onClick={() => setIsWithdrawOpen(true)} />
        <BalanceRow icon="🏦" label="Deposit Cash" amount={user?.balance || 0} btnText="ADD MONEY" btnColor="bg-[#2196F3]" onClick={() => setIsAddMoneyOpen(true)} />
        <BalanceRow icon="🎁" label="Refer and Earn" amount={user?.referralBonus || 0} btnText="REFER" btnColor="bg-[#9C27B0]" onClick={() => {}} />
      </div>

      <div className="bg-white rounded-[30px] p-5 space-y-4 border border-gray-50">
        <h3 className="text-xs font-black text-gray-400 uppercase px-1">সহযোগিতামূলক ভিডিও</h3>
        <TutorialRow title="কিভাবে টাকা অ্যাড করবেন" />
        <TutorialRow title="কিভাবে ম্যাচে জয়েন করবেন" />
        <TutorialRow title="উইথড্র করার সঠিক নিয়ম" />
      </div>

      <AddMoneyModal isOpen={isAddMoneyOpen} onClose={() => setIsAddMoneyOpen(false)} />
      <WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} availableBalance={user?.winningBalance || 0} onWithdraw={(data) => console.log(data)} />
    </div>
  );
};

const BalanceRow = ({ icon, label, amount, btnText, btnColor, onClick }) => (
  <div className="flex items-center justify-between p-5 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">{label} <Info size={12}/></p>
        <h2 className="text-xl font-black text-gray-800">BDT {amount}</h2>
      </div>
    </div>
    <button onClick={onClick} className={`${btnColor} text-white px-4 py-2 rounded-xl font-black text-[10px] shadow-lg active:scale-90 transition-all`}>{btnText}</button>
  </div>
);

const TutorialRow = ({ title }) => (
  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
    <div className="flex items-center gap-3">
      <div className="bg-white p-2 rounded-xl shadow-sm"><PlayCircle className="text-red-500" size={20} /></div>
      <p className="font-bold text-[13px] text-gray-700">{title}</p>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </div>
);

export default Wallet;