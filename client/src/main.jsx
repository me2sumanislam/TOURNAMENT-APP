 import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { router } from "../src/Router/Router.jsx"; // এটি router.jsx ফাইল থেকে আসবে
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {/* RouterProvider এখন আলাদা করা router ফাইলটি ব্যবহার করবে */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);