import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { assets, cities, countries } from "../assets/images/assets";

const initialState = {
  name: "",
  contact: "",
  address: "",
  city: "",
  country: "",
};

const HotelRegistration = ({ onClose }) => {
  const [inputs, setInputs] = useState(initialState);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Auto-hide error popup after 1s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Custom validation
    if (
      !inputs.name.trim() ||
      !inputs.contact.trim() ||
      !inputs.address.trim() ||
      !inputs.city ||
      !inputs.country
    ) {
      setError("Please fill all the fields.");
      return;
    }
    setError("");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();                 // Hide popup
      navigate("/hotelManager"); // Redirect to dashboard
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
      <form
        className="flex bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
        onSubmit={handleSubmit}
      >
        {/* Left: Hotel image (hidden on mobile) */}
        <img
          src={assets.hotelRegistration}
          alt="reg-image"
          className="w-1/2 h-auto max-h-[600px] object-cover hidden md:block"
        />

        {/* Right: Form fields */}
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10 overflow-y-auto max-h-[95vh]">
          <FiX
            className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-gray-500 hover:text-red-500"
            onClick={onClose}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* Custom Error Message */}
          {error && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-8 py-4 rounded-lg shadow-lg font-medium">
              {error}
            </div>
          )}

          {/* Success Popup */}
          {showSuccess && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg font-medium">
              Registration completed successfully!
            </div>
          )}

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

          {/* Phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              name="contact"
              value={inputs.contact}
              onChange={handleChange}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              name="address"
              value={inputs.address}
              onChange={handleChange}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>

          {/* Select City Dropdown */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">City</label>
            <select
              id="city"
              name="city"
              value={inputs.city}
              onChange={handleChange}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            >
              <option value="">Select City:</option>
              {cities.map((city) => (
                <option value={city} key={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Select Country Dropdown */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="country" className="font-medium text-gray-500">Country</label>
            <select
              id="country"
              name="country"
              value={inputs.country}
              onChange={handleChange}
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            >
              <option value="">Select Country:</option>
              {countries.map((country) => (
                <option value={country} key={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <button
            className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelRegistration;
