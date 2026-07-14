import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FcMenu } from "react-icons/fc";
import { IoCloseOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import logo from "/swift-pay-logo.png";

// Local imports
import { UserContext } from "../../../authProvider/AuthProvider";
import ThemeChanger from "../../../features/ThemeChanger";
import "./navbar.css";

const Navbar = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(UserContext);
  const role = user?.userRole || null;
  const isAuthenticated = role !== null;
  const [open, setOpen] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Log out successfully!");
    navigate("/");
  };

  if (loading) {
    return <div className="h-16 border-b border-base-300" />;
  }

  const nav = (
    <>
      {isAuthenticated ? (
        <>
          <NavLink to="/">Home</NavLink>
          {role === "user" && (
            <>
              <NavLink to="dashboard/user/cash-in">Cash In Request</NavLink>
              <NavLink to="dashboard/user/send-money">Send Money</NavLink>
              <NavLink to="dashboard/user/cash-out">Cash Out</NavLink>
              <NavLink to="dashboard/user/transactions">Transactions</NavLink>
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
      className={`px-4 py-2 transition-all duration-300 border-b border-base-300 ${
        isSticky
          ? "sticky top-0 w-full z-50 bg-base-100/90 backdrop-blur-md shadow-sm"
          : "bg-base-100"
      }`}
    >
      <div className="flex items-center justify-between container-page">
        <Link
          rel="noopener noreferrer"
          to="/"
          aria-label="Back to homepage"
          className="flex items-center font-bold md:text-3xl text-2xl py-2"
        >
          <img className="h-8 w-auto" src={logo} alt="swift pay logo" />
          <span className="text-primary">swift</span>
          <span className="text-secondary">Pay</span>
        </Link>

        <ul className="items-stretch hidden gap-5 text-sm font-medium md:flex">{nav}</ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard/user">
                <img
                  title={user?.userName}
                  className="h-8 w-8 rounded-full object-cover border border-base-300"
                  src={user?.userPhoto ? user?.userPhoto : "https://avatars.githubusercontent.com/u/92154638?v=4"}
                  alt={user?.userName}
                />
              </Link>
              <button onClick={handleLogout} className="btn-outline-minimal btn-sm">
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="btn-primary-minimal btn-sm">
              Login
            </Link>
          )}
          <ThemeChanger />

          <button ref={menuRef} onClick={handleMenu} className="flex justify-end p-2 md:hidden">
            {rotating ? (
              <ImSpinner2 className="text-2xl animate-spin" />
            ) : open ? (
              <IoCloseOutline className="text-2xl transition-transform transform rotate-0 hover:rotate-180 duration-300" />
            ) : (
              <FcMenu className="text-2xl transition-transform transform rotate-0 hover:rotate-180 duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={open}
        enter="transition-transform duration-300 ease-out"
        enterFrom="-translate-y-full"
        enterTo="translate-y-0"
        leave="transition-transform duration-200 ease-in"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-full"
      >
        <div className="md:hidden bg-base-100 border-t border-base-300 absolute text-center w-full z-50 left-0" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <ul className="flex flex-col gap-4 text-sm font-medium">{nav}</ul>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Navbar;