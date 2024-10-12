import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { ToastContainer, Slide } from "react-toastify";
import BottomTop from "./Features/BottomTop/BottomTop";

function App() {
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
}

export default App;
