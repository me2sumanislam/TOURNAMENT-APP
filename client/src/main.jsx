 import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import "./index.css";

// future pages (ready structure)
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  // ভবিষ্যতে add করতে পারো 👇
  // {
  //   path: "/tournament/:id",
  //   element: <TournamentDetails />,
  // },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  // {
  //   path: "/admin",
  //   element: <AdminDashboard />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);