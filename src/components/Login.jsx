import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.jsx";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EasyStayImage from "../assets/images/EasyStay.png";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";

const LOGIN_URL = "/auth/login";

function Login() {
  const { setAuth } = useAuth();
  const location = useLocation();

  const bookNowError = location.state?.bookNowError;
  const [showBookNowError, setShowBookNowError] = useState(false);

  useEffect(() => {
    if (bookNowError) {
      setShowBookNowError(true);
      const timer = setTimeout(() => setShowBookNowError(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [bookNowError]);

  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      JSON.stringify(response?.data);
      const { accessToken, refreshToken, role, passwordChanged } =
        response?.data ?? {};

      setAuth({ user, pwd, accessToken, refreshToken, role });
      setUser("");
      setPwd("");

      if (!passwordChanged) {
        navigate("/change-password");
        return;
      } else {
        if (role === "USER") {
          navigate("/");
        } else if (role === "MANAGER") {
          navigate("/hotelManager");
        }
      }
    } catch (err) {
      const messageKey = err?.response?.data?.message;
      const toastMessage =
        ERROR_MESSAGES[messageKey] || "Sign In failed. Try again later.";
      toast.error(toastMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-light-gray">
      {showBookNowError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in">
          {bookNowError}
        </div>
      )}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 bg-white h-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-charcoal-gray text-center mb-6 font-lora">
            Sign In to <span className="text-teal">EasyStay</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-charcoal-gray font-roboto"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-medium text-charcoal-gray font-roboto"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-warm-orange hover:text-teal font-medium font-montserrat transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={!user.trim() || !pwd.trim()}
              className="w-full bg-teal text-white py-2 px-4 rounded-2xl font-montserrat font-bold hover:bg-teal-dark transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-md"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-charcoal-gray font-roboto">
            Not registered yet?{" "}
            <Link
              to="/sign-up"
              className="text-warm-orange hover:text-teal font-medium font-montserrat transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          src={EasyStayImage}
          alt="EasyStay"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
