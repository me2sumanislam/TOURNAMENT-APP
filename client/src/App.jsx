//  import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "./Context/AuthContext"; 

// // পেজ ইম্পোর্ট (পাথগুলো আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী চেক করুন)
// import Home from "./pages/Home/Home";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import CreateTournament from "./pages/Admin/CreateTournament";

// // ✅ অ্যাডমিন প্রোটেকশন কম্পোনেন্ট
// const AdminRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);

//   // যদি ডাটাবেজ থেকে ইউজার ডাটা আসতে সময় নেয়, তবে লোডিং দেখাবে
//   // এটি না থাকলে অনেক সময় ডাটা আসার আগেই রিডাইরেক্ট করে দেয়
//   if (loading) {
//     return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">Loading Context...</div>;
//   }

//   // ইউজার না থাকলে বা ইউজার অ্যাডমিন না হলে হোমে পাঠিয়ে দিবে
//   if (!user || user.role !== "admin") {
//     console.log("Access Denied: User is not an admin or not logged in.");
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-900">
//         <Routes>
//           {/* 🌍 পাবলিক রাউটস */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* 🔒 অ্যাডমিন প্রোটেক্টেড রাউটস */}
//           <Route 
//             path="/admin-dashboard" 
//             element={
//               <AdminRoute>
//                 <AdminDashboard />
//               </AdminRoute>
//             } 
//           />
//           <Route 
//             path="/admin/add-tournament" 
//             element={
//               <AdminRoute>
//                 <CreateTournament />
//               </AdminRoute>
//             } 
//           />
          
//           {/* 🚫 ৪০৪ পেজ (যদি কোনো রাউট না মিলে) */}
//           <Route path="*" element={<div className="text-white text-center pt-20 text-3xl font-bold">404 - Page Not Found</div>} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;