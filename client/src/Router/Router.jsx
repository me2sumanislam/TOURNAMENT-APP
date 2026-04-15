 import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import { PrivateRoute, AdminRoute } from "./Guard.jsx"; // Guard.jsx থেকে ইমপোর্ট করা হচ্ছে
import Wallet from "../pages/Wallet/Wallet.jsx";
 
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
    path: "/admin", 
    element: <AdminRoute><Admin /></AdminRoute> 
  },
  
{
     path: "/wallet", 
     element: <PrivateRoute><Wallet />
     </PrivateRoute> 
     
    }
]);


 