 import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Wallet from "../pages/Wallet/Wallet.jsx";
import AdminTransactions from "../pages/Admin/AdminTransactions.jsx"; // নতুন ইম্পোর্ট
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
  // অ্যাডমিন ড্যাশবোর্ড
  { 
    path: "/admin", 
    element: <AdminRoute><Admin /></AdminRoute> 
  },
  // পেমেন্ট অ্যাপ্রুভ করার জন্য নতুন রুট
  { 
    path: "/admin/payments", 
    element: <AdminRoute><AdminTransactions /></AdminRoute> 
  }
]);