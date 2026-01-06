import { Outlet } from "react-router-dom";
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
            
        </>
    );
};

export default PublicLayout;