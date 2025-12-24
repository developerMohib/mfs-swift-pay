import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Services from "../Pages/Services/Services";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Profile from "../Pages/Profile/Profile";

import AdminTransactions from "../Pages/Dashboard/Admin/AllTransition/AllTransition";
import AgentManagement from "../Pages/Dashboard/Admin/AgentManage/AgentManage";
import UserManagement from "../Pages/Dashboard/Admin/UserManage/UserManage";
import AgentTransactions from "../Pages/Dashboard/Agent/AgentTransection/AgentTransection";
import CashOutRequests from "../Pages/Dashboard/Agent/CashOutRequ/CashOutRequ";
import CashInRequests from "../Pages/Dashboard/Agent/CashInRequ/CashInRequ";
import AdminLogin from "../Pages/AdminLogin/AdminLogin";
import CashDeposit from "../Pages/Dashboard/Agent/CashDeposit/CashDeposit";
import CashInto from "../Pages/Dashboard/User/CashInto";
import SendMoney from "../Pages/Dashboard/User/SendMoney";
import CashOut from "../Pages/Dashboard/User/CashOut";
import UserTransections from "../Pages/Dashboard/User/Transections";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // ===== PUBLIC ROUTES =====
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "sign-in",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Register />,
      },

      // ===== USER DASHBOARD ROUTES =====
      {
        path: "dashboard/user",
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "cash-in",
            element: <CashInto />,
          },
          {
            path: "send-money",
            element: <SendMoney />,
          },
          {
            path: "cash-out",
            element: <CashOut />,
          },
          {
            path: "transactions",
            element: <UserTransections />,
          },
        ],
      },

      // ===== AGENT DASHBOARD ROUTES =====
      {
        path: "dashboard/agent",
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "transactions",
            element: <AgentTransactions />,
          },
          {
            path: "cash-in-requests",
            element: <CashInRequests />,
          },
          {
            path: "cash-out-requests",
            element: <CashOutRequests />,
          },
          {
            path: "cash-deposit",
            element: <CashDeposit />,
          },
        ],
      },

      // ===== ADMIN DASHBOARD ROUTES =====
      {
        path: "dashboard/admin",
        children: [
          {
            index: true,
            element: <AdminTransactions />,
          },
          {
            path: "transactions",
            element: <AdminTransactions />,
          },
          {
            path: "manage-agents",
            element: <AgentManagement />,
          },
          {
            path: "manage-users",
            element: <UserManagement />,
          },
        ],
      },
    ],
  },

  // ===== STANDALONE ROUTES (Outside Main Layout) =====
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // ===== ERROR ROUTES =====
  {
    path: "*",
    element: <ErrorPage />,
  },
]);