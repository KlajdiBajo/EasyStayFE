import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { toast } from "react-toastify";
import EasyStayImage from "../assets/images/EasyStay.png";
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
  const [role, setRole] = useState("");

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
          role,
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
      setRole("");

      setTimeout(() => {
        if (role === "USER") {
          navigate("/");
        } else if (role === "HOTEL_MANAGER") {
          navigate("/hotelManager");
        } else {
          navigate("/sign-in");
        }
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
    <div className="flex flex-col lg:flex-row h-screen bg-light-gray">
      <div className="flex items-center justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-8 py-6 bg-white h-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mt-16">
          <h2 className="text-2xl font-bold text-charcoal-gray text-center mb-6 font-lora">
            Sign Up to <span className="text-teal">EasyStay</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
              <p
                id="uidnote"
                className={`mt-2 text-sm rounded-md p-3 bg-black text-white shadow-md font-roboto ${userFocus && user && !validName ? "block" : "hidden"}`}
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
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
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
                className="block font-medium text-charcoal-gray font-roboto"
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
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block font-medium text-charcoal-gray font-roboto"
              >
                Role:
                {renderValidationIcon(role !== "", role)}
              </label>
              <select
                id="role"
                value={role}
                autoComplete="off"
                onChange={(e) => setRole(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
              >
                <option value="">Select Role</option>
                <option value="USER">User</option>
                <option value="HOTEL_MANAGER">Hotel Manager</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={
                !validName ||
                !firstname.trim() ||
                !lastname.trim() ||
                !email.trim() ||
                !gender.trim() ||
                !birthdate.trim() ||
                !role.trim()
              }
              className="w-full bg-teal text-white py-2 px-4 rounded-2xl font-montserrat font-bold hover:bg-teal-dark transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-charcoal-gray font-roboto">
            Already registered?{" "}
            <Link
              to="/sign-in"
              className="text-warm-orange hover:text-teal font-medium font-montserrat transition-colors duration-200"
            >
              Sign In
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
};

export default Register;
