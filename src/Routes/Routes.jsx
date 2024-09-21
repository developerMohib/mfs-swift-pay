import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Services from "../Pages/Services/Services";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

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
        ]
    }
])