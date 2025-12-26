import { Outlet } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Navbar from '../components/common/navbar/Navbar';
import Footer from '../components/common/footer/Footer';
import BottomTop from "../features/BottomTop";

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto">
                <Outlet />
            </div>
            <Footer />
            <BottomTop />
            {/* Toast here */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                closeOnClick
                theme="dark"
                transition={Slide}
            />
        </>
    );
};

export default PublicLayout;