import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FcMenu } from "react-icons/fc";
import { IoCloseOutline } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { Transition } from "@headlessui/react";

import "./navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [rotating, setRotating] = useState(false);
  const handleMenu = () => {
    setRotating(true);

    setTimeout(() => {
      setOpen(!open);
      setRotating(false);
    }, 100);
  };

  const nav = (
    <>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/"
      >
        {" "}
        Home{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/about"
      >
        {" "}
        About{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/services"
      >
        {" "}
        Services{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/cash-in"
      >
        {" "}
        Cash in{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/cash-out"
      >
        {" "}
        Cash Out{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/send-money"
      >
        {" "}
        Send Money{" "}
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "active" : "navlink")}
        to="/user-transection"
      >
        {" "}
        User Transection{" "}
      </NavLink>
    </>
  );
  return (
    <header className="px-4 py-1 text-gray-800 shadow">
      <div className="flex items-center md:gap-x-4 ">
      <div className="flex justify-between items-center container mx-auto ">
        <Link
          rel="noopener noreferrer"
          to="/"
          aria-label="Back to homepage"
          className="flex items-center font-bold md:text-4xl text-3xl p-2"
        >
          <span className="text-primary">swift</span>
          <span className="text-secondary">Pay</span>
        </Link>
        <ul className="items-stretch hidden space-x-3 md:flex">{nav}</ul>
        <button onClick={handleMenu} className="flex justify-end p-4 md:hidden">
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
     
      <button className="border px-2 py-1 rounded-md border-tarnary hover:bg-secondary hover:text-white font-medium transition-all duration-200" > <Link to="/sign-in" >Login</Link> </button>
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
            <ul className="flex flex-col text-white gap-4"> {nav} </ul>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Navbar;
