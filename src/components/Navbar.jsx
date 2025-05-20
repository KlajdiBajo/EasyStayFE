import React from "react";
import { assets } from "../assets/images/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const Navbar = () => {
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Hotel Rooms", path: "/rooms" },
  ];
  // Private links for logged-in users
  const privateLinks = [
    { name: "My Bookings", path: "/bookings" },
    { name: "Report", path: "/report" },
  ];

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoggedIn = !!auth?.accessToken;

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setAuth({});
      navigate("/sign-in");
    } else {
      navigate("/sign-in");
    }
  };

  const navbarShadow = isHome ? "" : "shadow";
  const navbarBg = isHome ? "bg-transparent" : "bg-white";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-20 py-4 ${navbarBg} ${navbarShadow}`}
      style={{ minHeight: "72px" }}
    >
      {/* Logo & Brand */}
      <Link to="/" className="flex items-center gap-3 min-w-[170px]">
        <img src={assets.logo} alt="logo" className="h-9" />
        <span className={`font-bold text-2xl tracking-tight ${isHome ? "text-white" : "text-gray-900"}`}>
          EasyStay
        </span>
      </Link>

      {/* Links Centered */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {/* Public links */}
        {publicLinks.map((link, i) => (
          <NavLink
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${isHome ? "text-white" : "text-gray-700"}`}
          >
            {link.name}
            <div className={`${isHome ? "bg-white" : "bg-gray-700"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
          </NavLink>
        ))}
        {/* Private links if logged in */}
        {/* {isLoggedIn && auth.user && privateLinks.map((link, i) => ( */}
        {privateLinks.map((link, i) => (
          <NavLink
            key={i + publicLinks.length}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${isHome ? "text-white" : "text-gray-700"}`}
          >
            {link.name}
            <div className={`${isHome ? "bg-white" : "bg-gray-700"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
          </NavLink>
        ))}
      </div>

      {/* Right Side: Login/Profile */}
      <div className="min-w-[170px] flex justify-end">
        {isLoggedIn && auth.user ? (
          <div className="flex items-center gap-2">
            <FiUser className={`h-6 w-6 ${isHome ? "text-white" : "text-gray-700"}`} />
            <span className={`font-semibold ${isHome ? "text-white" : "text-gray-800"}`}>
              {auth.user.username}
            </span>
            <button
              onClick={handleAuthClick}
              className={`flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-2 rounded-full font-medium text-base shadow`}
            >
              <FaSignOutAlt className="inline mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleAuthClick}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-full font-medium text-base shadow"
          >
            <FaSignInAlt className="inline mr-2" />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
