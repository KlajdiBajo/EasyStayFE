import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const FORGOT_PASSWORD_URL = "/auth/resend";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter your username.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${FORGOT_PASSWORD_URL}?username=${encodeURIComponent(username)}`,
        null,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Please check your email!");
      setUsername("");
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      toast.error("Unable to send reset instructions. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-600 text-center mb-6">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your username and we’ll send you an email with instructions to
          reset your password.
        </p>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-4">
          Haven’t received it? Check your spam folder just in case.
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
