import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl m-auto px-4" >
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
