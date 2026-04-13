 import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./Context/AuthContext.jsx"; 
import Home from "./pages/Home/Home.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import "./index.css";

// ✅ স্ট্রিক্ট অ্যাডমিন রুট
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // ডাটা লোড না হওয়া পর্যন্ত অপেক্ষা করবে (ক্র্যাশ হবে না)
  if (loading) return <div className="bg-gray-900 min-h-screen text-white p-10 font-bold">Checking access...</div>;

  // ইউজার নেই অথবা রোল অ্যাডমিন না
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/admin",
    element: <AdminRoute><Admin /></AdminRoute>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);