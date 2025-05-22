import { assets } from "../../assets/images/assets";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoggedIn = !!auth?.accessToken;

  const handleAuthClick = () => {
    setAuth({});
    navigate("/sign-in");
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      {/* Logo */}
      <Link
        to="/hotelManager"
        className="flex items-center gap-3 min-w-[170px]"
      >
        <img src={assets.logo} alt="logo" className="h-9" />
        <span
          className={`font-bold text-2xl tracking-tight ${
            isHome ? "text-white" : "text-gray-900"
          }`}
        >
          EasyStay
        </span>
      </Link>
      {/* Right Side: Login/Profile */}
      <div className="min-w-[170px] flex justify-end items-center gap-4">
        {isLoggedIn && auth.user ? (
          <div className="flex items-center gap-3">
            <FiUser
              className={`h-6 w-6 ${isHome ? "text-white" : "text-gray-700"}`}
            />
            <span
              className={`font-semibold ${
                isHome ? "text-white" : "text-gray-800"
              }`}
            >
              {auth.user.username}
            </span>
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium text-sm shadow"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/sign-in")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm shadow"
          >
            <FaSignInAlt />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
