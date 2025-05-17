import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { toast } from "react-toastify";
import CodePioneersImage from "../assets/images/CodePioneers.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const REGISTER_URL = "/auth/signup";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

const Register = () => {
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  const formatBirthdate = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
    return parts.filter(Boolean).join("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    if (!v1) {
      toast.error("Invalid username format.");
      return;
    }

    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username: user,
          firstname,
          lastname,
          email,
          gender,
          birthdate,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(
        "Sign-up successful! Check your email for your temporary password to sign in."
      );

      setUser("");
      setFirstname("");
      setLastname("");
      setEmail("");
      setGender("");
      setBirthdate("");

      setTimeout(() => {
        navigate("/sign-in");
      }, 1500);
    } catch (err) {
      const messageKey = err?.response?.data?.message;
      const toastMessage =
        ERROR_MESSAGES[messageKey] || "Sign Up failed. Try again later.";
      toast.error(toastMessage);
    }
  };

  const isValidEmail = EMAIL_REGEX.test(email);
  const isValidDate = DATE_REGEX.test(birthdate);

  const renderValidationIcon = (condition, value) => {
    if (!value) return null;
    return condition ? (
      <FontAwesomeIcon icon={faCheck} className="text-green-500 ml-2" />
    ) : (
      <FontAwesomeIcon icon={faTimes} className="text-red-500 ml-2" />
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 bg-white h-full">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-indigo-600 text-center mb-6">
            Sign Up to <span className="text-black">CodePioneers</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-700"
              >
                Username:
                <span className="inline-flex items-center space-x-2 ml-2">
                  {renderValidationIcon(validName, user)}
                </span>
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <p
                id="uidnote"
                className={`mt-2 text-sm rounded-md p-3 bg-black text-white shadow-md ${
                  userFocus && user && !validName ? "block" : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            </div>

            <div>
              <label
                htmlFor="firstname"
                className="block font-medium text-gray-700"
              >
                First Name:
                {renderValidationIcon(firstname.trim().length > 0, firstname)}
              </label>
              <input
                type="text"
                id="firstname"
                autoComplete="off"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block font-medium text-gray-700"
              >
                Last Name:
                {renderValidationIcon(lastname.trim().length > 0, lastname)}
              </label>
              <input
                type="text"
                id="lastname"
                autoComplete="off"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700"
              >
                Email:
                {renderValidationIcon(isValidEmail, email)}
              </label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block font-medium text-gray-700"
              >
                Gender:
                {renderValidationIcon(gender !== "", gender)}
              </label>
              <select
                id="gender"
                value={gender}
                autoComplete="off"
                onChange={(e) => setGender(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="RATHERNOTSAY">Rather not say</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="birthdate"
                className="block font-medium text-gray-700"
              >
                Birthdate:
                {renderValidationIcon(isValidDate, birthdate)}
              </label>
              <input
                type="text"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(formatBirthdate(e.target.value))}
                required
                autoComplete="off"
                placeholder="dd/mm/yyyy"
                pattern="^\d{2}/\d{2}/\d{4}$"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={
                !validName ||
                !firstname.trim() ||
                !lastname.trim() ||
                !email.trim() ||
                !gender.trim() ||
                !birthdate.trim()
              }
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link
              to="/sign-in"
              className="text-black hover:text-indigo-700 font-medium"
            >
              Sign In
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
};

export default Register;
