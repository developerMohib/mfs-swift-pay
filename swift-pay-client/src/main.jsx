import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./Routes/Routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
  </React.StrictMode>
);
