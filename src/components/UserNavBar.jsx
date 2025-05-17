import logo from "../assets/images/logo.png";
import { useNavigate, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // icons

const UserNavBar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!auth?.accessToken;

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setAuth({});
      navigate("/sign-in");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div>
      <nav className="bg-indigo-700 border-b border-indigo-500">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
              <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
                <img className="h-10 w-auto" src={logo} alt="React Jobs" />
                <span className="hidden md:block text-white text-2xl font-bold ml-2">
                  CodePioneers
                </span>
              </NavLink>
              <div className="md:ml-auto">
                <div className="flex space-x-2">
                  <NavLink to="/" className={linkClass}>
                    Home
                  </NavLink>
                  <NavLink to="/jobs" className={linkClass}>
                    Jobs
                  </NavLink>
                  <NavLink to="/add-job" className={linkClass}>
                    Add Job
                  </NavLink>
                  <button
                    onClick={handleAuthClick}
                    className={linkClass({ isActive: false })}
                  >
                    {isLoggedIn ? (
                      <>
                        <FaSignOutAlt className="inline mr-2" />
                        Log out
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="inline mr-2" />
                        Log in
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserNavBar;
