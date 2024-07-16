import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Services from "../Pages/Services/Services";
export const router = createBrowserRouter([
    {
        path : '/',
        element: <App></App>,
        errorElement: <p>go home</p>,
        children : [
            {
                path: '/',
                element: <Home></Home>,
            },
            {
                path : '/about',
                element: <About></About>,
            },
            {
                path: '/services',
                element: <Services></Services>
            },
        ]
    }
])