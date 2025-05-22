import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { assets } from "../assets/images/assets";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";
import axios from "../api/axios.js";

const initialState = {
  name: "",
  description: "",
  roadName: "",
  city: "",
  country: "",
};

const HotelRegistration = ({ onClose }) => {
  const [inputs, setInputs] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // ✅ watch auth readiness

  /* ------------------------------------------------------------------
   * Wait until we have a valid access‑token before making any manager / hotel
   * checks.  This solves the race‑condition where the component rendered
   * before the refresh‑token flow finished and therefore `axiosPrivate`
   * requests were unauthenticated and failed silently.
   * -----------------------------------------------------------------*/
  useEffect(() => {
    if (!auth?.accessToken) return; // 🔸 auth not ready yet – exit early

    const checkIfHotelExists = async () => {
      try {
        const currentUserResponse = await axiosPrivate.get("/user/currentUser");
        const userId = currentUserResponse?.data?.userId;
        const role = currentUserResponse?.data?.role;

        // Allow only MANAGERs to register a hotel
        if (role !== "MANAGER") {
          setShouldRender(false);
          return;
        }

        // Does this manager already have a hotel?
        const res = await axios.get(
          `/hotel/filterHotels?managerUserId=${userId}&page=0&size=1`
        );

        setShouldRender(res.data?.content?.length === 0);
      } catch (err) {
        setShouldRender(false);
      }
    };

    checkIfHotelExists();
  }, [auth?.accessToken, axiosPrivate]);

  /* -------------------- fetch list of countries once -------------------- */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/iso"
        );
        const result = await res.json();
        setCountryOptions(result?.data?.map((c) => c.name) || []);
      } catch {
        setCountryOptions([]);
      }
    };
    fetchCountries();
  }, []);

  /* -------------- fetch cities whenever a country is selected -------------- */
  useEffect(() => {
    if (!inputs.country) return;

    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: inputs.country }),
          }
        );
        const result = await res.json();
        setCityOptions(result?.data || []);
      } catch {
        setCityOptions([]);
      }
    };
    fetchCities();
  }, [inputs.country]);

  /* -------------------------- input helpers -------------------------- */
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid = () =>
    inputs.name.trim() &&
    inputs.description.trim() &&
    inputs.roadName.trim() &&
    inputs.city &&
    inputs.country;

  /* ------------------------------ submit ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return toast.error("Please fill all the fields!");

    try {
      setLoading(true);
      await axiosPrivate.post("/hotel", JSON.stringify(inputs), {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Hotel registered successfully!");
      setSuccess(true);
      onClose();
    } catch (err) {
      const messageKey = err?.response?.data?.message;
      toast.error(ERROR_MESSAGES[messageKey] || "Hotel registration failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  /* ------------------------------ render ------------------------------ */
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
      <form
        onSubmit={handleSubmit}
        className="flex bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
      >
        <img
          src={assets.hotelRegistration}
          alt="reg-image"
          className="w-1/2 h-auto max-h-[600px] object-cover hidden md:block"
        />

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10 overflow-y-auto max-h-[95vh]">
          <FiX
            className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-gray-500 hover:text-red-500"
            onClick={() =>
              success
                ? onClose()
                : toast.info("You need to register your hotel before closing.")
            }
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>

          {/* Description */}
          <div className="w-full mt-4">
            <label htmlFor="description" className="font-medium text-gray-500">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={inputs.description}
              onChange={handleChange}
              placeholder="Write a short description of your hotel..."
              rows={4}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light resize-none"
            />
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="roadName" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="roadName"
              name="roadName"
              value={inputs.roadName}
              onChange={handleChange}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>

          {/* Country */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="country" className="font-medium text-gray-500">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={inputs.country}
              onChange={handleChange}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            >
              <option value="">Select Country:</option>
              {countryOptions.map((country) => (
                <option value={country} key={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              id="city"
              name="city"
              value={inputs.city}
              onChange={handleChange}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            >
              <option value="">Select City:</option>
              {cityOptions.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelRegistration;
