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

export const router = createBrowserRouter([
    {
        path : '/',
        element: <App></App>,
        errorElement: <ErrorPage/>,
        children : [
            {
                path: '/',
                element: <Home />,
            },
            {
                path : '/about',
                element: <About />,
            },
            {
                path: '/services',
                element: <Services />
            },
            {
                path: '/sign-in',
                element: <Login />
            },
            {
                path: '/sign-up',
                element: <Register />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/cash-in',
                element: <CashInto />
            },
            {
                path: '/cash-out',
                element: <CashOut />
            },
            {
                path: '/send-money',
                element: <SendMoney />
            },
            {
                path: '/user-transection',
                element: <Transections />
            },
        ]
    }
])