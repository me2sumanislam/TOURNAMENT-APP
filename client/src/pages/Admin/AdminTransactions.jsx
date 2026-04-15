 import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTransactions = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // সব পেন্ডিং রিকোয়েস্ট ফেচ করা
  const getRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions/admin/requests");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  // Approve (অ্যাপ্রুভ) করার ফাংশন
  const handleApprove = async (id) => {
    if (!window.confirm("আপনি কি এই পেমেন্টটি অ্যাপ্রুভ করতে চান?")) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/transactions/admin/approve/${id}`);
      if (res.data.success) {
        alert("সফলভাবে অ্যাপ্রুভ হয়েছে এবং ব্যালেন্স যোগ হয়েছে! ✅");
        getRequests(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      alert(err.response?.data?.error || "অ্যাপ্রুভ করা যায়নি।");
    }
  };

  // Reject (রিজেক্ট) করার ফাংশন
  const handleReject = async (id) => {
    if (!window.confirm("আপনি কি এই রিকোয়েস্টটি রিজেক্ট করতে চান?")) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/transactions/admin/reject/${id}`);
      if (res.data.success) {
        alert("রিকোয়েস্টটি রিজেক্ট করা হয়েছে। ❌");
        getRequests(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      alert("রিজেক্ট করা সম্ভব হয়নি।");
    }
  };

  if (loading) return <h3 style={{ textAlign: "center", marginTop: "50px" }}>লোড হচ্ছে...</h3>;

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>💰 পেমেন্ট রিকোয়েস্ট ম্যানেজমেন্ট</h2>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#333", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "15px" }}>ইউজার</th>
              <th style={{ padding: "15px" }}>টাকার পরিমাণ</th>
              <th style={{ padding: "15px" }}>TrxID / Phone</th>
              <th style={{ padding: "15px" }}>মেথড</th>
              <th style={{ padding: "15px", textAlign: "center" }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "15px" }}>
                    <strong>{req.userId?.name || "N/A"}</strong> <br />
                    <small style={{ color: "#666" }}>{req.userId?.email || "N/A"}</small>
                  </td>
                  <td style={{ padding: "15px", fontWeight: "bold", color: "#27ae60" }}>{req.amount} BDT</td>
                  <td style={{ padding: "15px", fontFamily: "monospace" }}>{req.trxID || req.phone}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ backgroundColor: "#e8f4fd", color: "#2980b9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                      {req.method}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <button 
                      onClick={() => handleApprove(req._id)}
                      style={{ backgroundColor: "#2ecc71", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}
                    >
                      Approve ✔
                    </button>
                    <button 
                      onClick={() => handleReject(req._id)}
                      style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Reject ✖
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#999" }}>কোনো পেন্ডিং রিকোয়েস্ট খুঁজে পাওয়া যায়নি। 🎉</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;