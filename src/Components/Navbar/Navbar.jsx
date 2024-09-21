import { Link, NavLink } from "react-router-dom";
import "./navbar.css"

const Navbar = () => {
  const nav = (
    <>
      <NavLink className={({isActive}) => isActive ? "active" : "navlink" } to="/"> Home </NavLink>
      <NavLink className={({isActive}) => isActive ? "active" : "navlink" } to="/about"> About </NavLink>
      <NavLink className={({isActive}) => isActive ? "active" : "navlink" } to="/services"> Services </NavLink>
      <NavLink className={({isActive}) => isActive ? "active" : "navlink" } to="/sign-in"> Log in </NavLink>
    </>
  );
  return (
    <header className="p-4 text-gray-800">
      <div className="container flex justify-between items-center mx-auto">
        <Link
          rel="noopener noreferrer"
          to="/"
          aria-label="Back to homepage"
          className="flex items-center font-bold text-2xl p-2"
        >
          <span className="text-secondary" >swift</span>
          <span className="text-orange-500" >Pay</span>
        </Link>
        <ul className="items-stretch hidden space-x-3 md:flex">{nav}</ul>
        <button className="flex justify-end p-4 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
