import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./Routes/Routes.jsx";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./AuthProvider/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>      
    </AuthProvider>
  </React.StrictMode>
);
