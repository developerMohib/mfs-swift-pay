import { Outlet } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

function App() {
  return (
    <>
      <div className="container mx-auto">
        <Outlet />
      </div>
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
