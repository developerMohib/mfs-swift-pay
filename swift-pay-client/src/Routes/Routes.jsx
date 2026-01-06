import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AgentLayout from "../layouts/AgentLayout";
import AdminLayout from "../layouts/AdminLayout";

// Standalone public pages 
import Home from "../Pages/common/Home";
import About from "../Pages/common/About";
import Services from "../Pages/common/Services";
import Register from "../Pages/common/Register";
import ErrorPage from "../Pages/common/ErrorPage";
import Login from "../Pages/common/Login";

// admin manage page
import AgentManage from "../Pages/admin/AgentManage";
import UserManage from "../Pages/admin/UserManage";
import HomeAdmin from "../Pages/admin/HomeAdmin";

// agent pages
import CashInRequ from "../Pages/agent/CashInRequ";
import CashDeposit from "../Pages/agent/CashDeposit";
import HomeAgent from "../Pages/agent/HomeAgent";
import AgentTransections from "../Pages/agent/AgentTransection";

// user pages
import CashInto from "../Pages/user/CashInto";
import SendMoney from "../Pages/user/SendMoney";
import CashOut from "../Pages/user/CashOut";
import UserTransections from "../Pages/user/Transections";
import UserProfile from "../Pages/user/UserProfile";
import AdminLogin from "../Pages/admin/AdminLogin";
import AllTransitions from "../Pages/admin/AllTransition";
import PublicLayout from "../layouts/PublicLayout";
import UpdateForm from "../Pages/common/UpdateForm";
import ProtectedRoute from "./ProtectedRoute";
//

// import Profile from "../Pages/common/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // ===== USER DASHBOARD =====
      {
        path: "dashboard/user",
        element: <ProtectedRoute><UserLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <UserProfile /> },
          { path: "cash-in", element: <CashInto /> },
          { path: "send-money", element: <SendMoney /> },
          { path: "cash-out", element: <CashOut /> },
          { path: "transactions", element: <UserTransections /> },
          // add more user routes
        ],
      },
      // ===== AGENT DASHBOARD =====
      {
        path: "dashboard/agent",
        element: <AgentLayout />,
        children: [
          { index: true, element: <HomeAgent /> },
          { path: "cash-in-requests", element: <CashInRequ /> },
          { path: "cash-out-requests", element: <CashDeposit /> },
          { path: "cash-deposit", element: <CashDeposit /> },
          { path: "transactions", element: <AgentTransections /> },
          // add more
        ],
      },
      // ===== ADMIN DASHBOARD =====
      {
        path: "dashboard/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <HomeAdmin /> },
          { path: "manage-users", element: <UserManage />, },
          { path: "manage-agents", element: <AgentManage />, },
          { path: "transactions", element: <AllTransitions /> },
          { path: "settings", element: <UpdateForm /> },
        ],
      },

      // Other public routes

      {
        path: "",
        element: <PublicLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "services", element: <Services /> },
          { path: "sign-in", element: <Login /> },
          { path: "sign-up", element: <Register /> },
          { path: "admin/login", element: <AdminLogin /> },
          //   error route
          { path: "*", element: <ErrorPage /> },
        ],
      },
    ],
  },
]);
