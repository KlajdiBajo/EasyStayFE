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
    <div className="flex items-center justify-center h-screen bg-light-gray px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-charcoal-gray text-center mb-6 font-lora">
          Forgot Password
        </h2>
        <p className="text-sm text-charcoal-gray text-center mb-4 font-roboto">
          Enter your username and we’ll send you an email with instructions to
          reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 font-roboto">
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-2 px-4 rounded-2xl font-montserrat font-bold hover:bg-teal-dark transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-xs text-center text-charcoal-gray mt-4 font-roboto">
          Haven’t received it? Check your spam folder just in case.
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
