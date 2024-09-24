import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Services from "../Pages/Services/Services";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Profile from "../Pages/Profile/Profile";
import CashInto from "../Pages/Dashboard/User/CashInto/CashInto";
import CashOut from "../Pages/Dashboard/User/CashOut/CashOut";
import SendMoney from "../Pages/Dashboard/User/SendMoney/SendMoney";
import Transections from "../Pages/Dashboard/User/Transections/Transections";
import AllTransition from "../Pages/Dashboard/Admin/AllTransition/AllTransition";
import AgentManage from "../Pages/Dashboard/Admin/AgentManage/AgentManage";
import UserManage from "../Pages/Dashboard/Admin/UserManage/UserManage";
import AgentTransection from "../Pages/Dashboard/Agent/AgentTransection/AgentTransection";
import CashOutRequ from "../Pages/Dashboard/Agent/CashOutRequ/CashOutRequ";
import CashInRequ from "../Pages/Dashboard/Agent/CashInRequ/CashInRequ";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/sign-in",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <Register />,
      },

      // Here User route added
      // Here User route added
      {
        path: "user",
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "cash-in",
            element: <CashInto />,
          },
          {
            path: "cash-out",
            element: <CashOut />,
          },
          {
            path: "send-money",
            element: <SendMoney />,
          },
          {
            path: "transection",
            element: <Transections />,
          },
        ],
      },

      // Here Agent route added
      // Here Agent route added
      {
        path: "agent",
        children: [
          {
            path: "transaction",
            element: <AgentTransection />,
          },
          {
            path: "cashin",
            element: <CashInRequ />,
          },
          {
            path: "cashout",
            element: <CashOutRequ />,
          },
        ],
      },

      // Here Admin route added
      // Here Admin route added
      {
        path: "admin",
        children: [
          {
            path: "transection",
            element: <AllTransition />,
          },
          {
            path: "manage-agents",
            element: <AgentManage />,
          },
          {
            path: "manage-users",
            element: <UserManage />,
          },
        ],
      },
    ],
  },
]);
