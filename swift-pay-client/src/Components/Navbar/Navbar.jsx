import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FcMenu } from "react-icons/fc";
import { IoCloseOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import logo from "/swift-pay-logo.png";

// Local imports
import { UserContext } from "../../AuthProvider/AuthProvider";
import ThemeChanger from "../../Features/ThemeChanger/ThemeChanger";
import "./navbar.css";

const Navbar = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate()
  const { user, logout, loading } = useContext(UserContext);
  const role = user?.userRole || null;
  const isAuthenticated = role !== null;
  const [open, setOpen] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  // const imgUrl = localStorage.getItem('uploadedImage');


  const handleMenu = () => {
    setRotating(true);

    setTimeout(() => {
      setOpen(!open);
      setRotating(false);
    }, 100);
  };

  // Handle click outside of menu to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // log out
  const handleLogout = () => {
    logout();
    toast.success("Log out successfully!");
    navigate('/')
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  const nav = (
    <>
      {isAuthenticated ? (
        <>
          <NavLink to="/">Home</NavLink>
          {role === "user" && (
            <>
              <NavLink to="user/cash-in">Cash In</NavLink>
              <NavLink to="user/cash-out">Cash Out</NavLink>
              <NavLink to="user/send-money">Send Money</NavLink>
              <NavLink to="user/transaction">Transactions</NavLink>
            </>
          )}
          {role === "admin" && (
            <>
              <NavLink to="admin/transaction">All Transactions</NavLink>
              <NavLink to="admin/manage-agents">Manage Agents</NavLink>
              <NavLink to="admin/manage-users">Manage Users</NavLink>
            </>
          )}
          {role === "agent" && (
            <>
              <NavLink to="agent/transaction">Transactions</NavLink>
              <NavLink to="agent/cashin">Cash In</NavLink>
              <NavLink to="agent/cashout">Cash Out</NavLink>
              <NavLink to="agent/cash-deposit">Deposit Personal</NavLink>
            </>
          )}
        </>
      ) : (
        <>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
        </>
      )}
    </>
  );

  return (
    <header
      className={`px-4 py-1 text-tarnary shadow transition-all duration-500 ${
        isSticky
          ? "sticky top-0 w-full z-50 bg-bg shadow-lg backdrop-blur-md"
          : ""
      }`}
    >
      <div className="flex items-center md:gap-x-4 ">
        <div className="flex justify-between items-center container mx-auto ">
          <Link
            rel="noopener noreferrer"
            to="/"
            aria-label="Back to homepage"
            className="flex items-center font-bold md:text-4xl text-3xl p-2"
          >
            <img className="h-10 w-auto" src={logo} alt="swift pay logo" />
            <span className="text-primary">swift</span>
            <span className="text-secondary">Pay</span>
          </Link>
          {/* <div> <img src={imgUrl} alt="" /> </div> */}
          <ul className="items-stretch hidden space-x-3 md:flex">{nav}</ul>
          <button
            ref={menuRef}
            onClick={handleMenu}
            className="flex justify-end p-4 md:hidden"
          >
            {/* Loading Spinner */}
            {rotating ? (
              <ImSpinner2 className="text-2xl animate-spin" />
            ) : open ? (
              /* Close Icon with animation */
              <IoCloseOutline className="text-2xl transition-transform transform rotate-0 hover:rotate-180 duration-300" />
            ) : (
              /* Menu Icon with animation */
              <FcMenu className="text-2xl transition-transform transform rotate-0 hover:rotate-180 duration-300" />
            )}
          </button>
        </div>

        {user ? (
          <>
            <Link to="/user/profile">
              {" "}
              <img
                title={user?.userName}
                className="h-8 rounded-full"
                src={user?.userPhoto ? user?.userPhoto : "https://avatars.githubusercontent.com/u/92154638?v=4"}
                alt={user?.userName}
              />{" "}
            </Link>
            <button
              onClick={handleLogout}
              className="border px-2 py-1 rounded-md border-tarnary hover:bg-secondary hover:text-bg font-medium transition-all duration-200"
            >
              {" "}
              Logout
            </button>
          </>
        ) : (
          <button className="border px-2 py-1 rounded-md border-tarnary hover:bg-secondary hover:text-bg font-medium transition-all duration-200">
            {" "}
            <Link to="/sign-in">Login</Link>{" "}
          </button>
        )}
        <ThemeChanger />
      </div>

      {/* Navbar for mobile device, make it headless ui */}
      <Transition
        show={open}
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-y-full"
        enterTo="translate-y-0"
        leave="transition-transform duration-200 ease-in"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-full"
      >
        <div
          className="md:hidden bg-tarnary absolute text-center w-full z-50 left-0 "
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <ul className="flex flex-col text-bg gap-4"> {nav} </ul>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Navbar;
