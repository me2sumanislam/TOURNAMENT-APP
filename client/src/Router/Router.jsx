 import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Wallet from "../pages/Wallet/Wallet.jsx";
import MyMatches from "../pages/MyMatches/MyMatches.jsx"; // নতুন ইম্পোর্ট
import AdminTransactions from "../pages/Admin/AdminTransactions.jsx";
import { PrivateRoute, AdminRoute } from "./Guard.jsx";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <Home /> 
  },
  { 
    path: "/login", 
    element: <Login /> 
  },
  { 
    path: "/register", 
    element: <Register /> 
  },
  { 
    path: "/profile", 
    element: <PrivateRoute><Profile /></PrivateRoute> 
  },
  { 
    path: "/wallet", 
    element: <PrivateRoute><Wallet /></PrivateRoute> 
  },
  // ইউজার কতগুলো ম্যাচে জয়েন করেছে তা দেখার রুট
  { 
    path: "/my-matches", 
    element: <PrivateRoute><MyMatches /></PrivateRoute> 
  },
  
  // অ্যাডমিন ড্যাশবোর্ড
  { 
    path: "/admin", 
    element: <AdminRoute><Admin /></AdminRoute> 
  },
  // পেমেন্ট অ্যাপ্রুভ করার জন্য রুট
  { 
    path: "/admin/payments", 
    element: <AdminRoute><AdminTransactions /></AdminRoute> 
  }
]);