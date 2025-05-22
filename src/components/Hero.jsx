import heroImage from "../assets/images/hero_image.png";
import { assets, countries } from "../assets/images/assets";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Hero = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!country || !countries.includes(country)) return;
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country }),
          }
        );
        const result = await res.json();
        setCityOptions(result?.data || []);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setCityOptions([]);
      }
    };
    fetchCities();
  }, [country]);

  const handleCountryChange = (e) => {
    const input = e.target.value;
    setCountry(input);
    setFilteredCountries(
      countries.filter((c) => c.toLowerCase().startsWith(input.toLowerCase()))
    );
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setFilteredCountries([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError("Check-in and check-out dates are required.");
      return setShowToast(true);
    }
    if (!guests || !city || !country) {
      setError("Please complete all fields.");
      return setShowToast(true);
    }
    if (checkIn >= checkOut) {
      setError("Check-out must be after check-in.");
      return setShowToast(true);
    }

    try {
      const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
      };

      const searchAvailabilityObj = {
        city,
        country,
        guests,
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut),
        page: 0,
        size: 5,
      };
      const response = await axios.get("room/search-availability", {
        params: searchAvailabilityObj,
      });

      // Navigate with state
      navigate("/rooms", {
        state: { rooms: response.data.content, params: searchAvailabilityObj },
      });
    } catch (err) {
      setError("An error occurred while searching. Try again.");
      setShowToast(true);
    }
  };

  return (
    <div
      className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundPosition: "center 80%",
      }}
    >
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover Your Perfect Gateway Destination
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Unparalleled luxury and comfort await at the world's most exclusive
        hotels and resorts. Start your journey today.
      </p>

      <form
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calendarIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            min={todayStr}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calendarIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            min={checkIn || todayStr}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="0"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FiMapPin className="h-5 w-5" />
            <label htmlFor="cityInput">City</label>
          </div>
          <input
            list="cityList"
            id="cityInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <datalist id="cityList">
            {cityOptions.map((c, index) => (
              <option value={c} key={index} />
            ))}
          </datalist>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <FiMapPin className="h-5 w-5" />
            <label htmlFor="countryInput">Country</label>
          </div>
          <input
            id="countryInput"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            placeholder="Type here"
            value={country}
            onChange={handleCountryChange}
          />
          {filteredCountries.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto z-50">
              {filteredCountries.map((c, index) => (
                <li
                  key={index}
                  className="px-3 py-1.5 cursor-pointer hover:bg-gray-200 text-sm"
                  onClick={() => handleCountrySelect(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-2 px-3 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          <FiSearch className="h-5 w-5" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
