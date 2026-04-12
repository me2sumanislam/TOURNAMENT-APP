 import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Admin from "./pages/Admin/Admin.jsx"; // নতুন Admin পেজ ইমপোর্ট করা হলো
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin", // ব্রাউজারে /admin লিখলে এই পেজ আসবে
    element: <Admin />,
  },
  
  /* ভবিষ্যতে এই পেজগুলো অ্যাড করতে পারবেন:
  {
    path: "/tournament/:id",
    element: <TournamentDetails />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  */
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);