import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { ToastContainer, Slide } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
      
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
