import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.jsx";
import axios from "../api/axios.js";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CodePioneersImage from "../assets/images/CodePioneers.jpg";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";

const LOGIN_URL = "/auth/login";

function Login() {
  const { setAuth } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      }

      navigate(from, { replace: true });
    } catch (err) {
      const messageKey = err?.response?.data?.message;
      const toastMessage =
        ERROR_MESSAGES[messageKey] || "Sign In failed. Try again later.";
      toast.error(toastMessage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 bg-white h-full">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-600 text-center mb-6">
            Sign In to <span className="text-black">CodePioneers</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-700"
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={!user.trim() || !pwd.trim()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Not registered yet?{" "}
            <Link
              to="/sign-up"
              className="text-black hover:text-indigo-700 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          src={CodePioneersImage}
          alt="CodePioneers"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
