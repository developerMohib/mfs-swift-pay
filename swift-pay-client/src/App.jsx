import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
