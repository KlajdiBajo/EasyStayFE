import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { roomsDummyData } from '../roomsDummyData';
import { FaWifi, FaCoffee, FaSwimmer, FaCar, FaUtensils, FaFan, FaBed, FaWineBottle, FaSpa, FaTv } from 'react-icons/fa';
import StarRating from '../components/StarRating';
import useAuth from "../hooks/useAuth";

const CheckBox = ({label, selected = false, onChange = () => { }}) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)}/>
    <span className='font-light select-none'>{label}</span>
  </label>
);

const RadioButton = ({label, selected = false, onChange = () => { }}) => (
  <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
    <input type="radio" name='sortOption' checked={selected} onChange={() => onChange(label)}/>
    <span className='font-light select-none'>{label}</span>
  </label>
);

const HotelRoomsPage = () => {
  const [openFilters, setOpenFilters] = useState(false);

  const [bookNowError, setBookNowError] = useState('');
  const [showBookToast, setShowBookToast] = useState(false);

  const { auth } = useAuth();
  const isLoggedIn = !!auth?.accessToken;

  const facilityIcons = {
    "WiFi": FaWifi,
    "Breakfast": FaCoffee,
    "Air Conditioning": FaFan,
    "Pool": FaSwimmer,
    "Sea View": FaUtensils,
    "Parking": FaCar,
    "Bar": FaWineBottle,
    "Spa": FaSpa,
    "TV": FaTv,
  };

  const roomTypes = [
    "Single Bed", 
    "Double Bed", 
    "Luxury Room", 
    "Family Suite"
  ];

  const priceRanges = [
    "0 to 500", 
    "500 to 1000", 
    "1000 to 2000", 
    "2000 to 3000"
  ];

  const sortOptions = [
    "Price Low to High", 
    "Price High to Low", 
    "Newest First"
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleBookNow = (roomId) => {
    if (!isLoggedIn) {
      navigate("/sign-in", {
        state: { from: location, bookNowError: "You need to login to book a room." }
      });
    } else {
      navigate(`/rooms/hotels`);
    }
  };

  useEffect(() => {
    if (showBookToast) {
      const timer = setTimeout(() => setShowBookToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showBookToast]);

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {showBookToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in">
          {bookNowError}
        </div>
      )}

      <div>
        <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
              Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
            </p>
        </div>

        {roomsDummyData.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-stretch py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            style={{ minHeight: 340 }}
          >
            {/* Image Side */}
            <div className="md:w-1/2 w-full flex">
              <img
                onClick={() => {
                  navigate(`/rooms/${room.hotelId}/${room._id}`);
                  scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt="hotel-img"
                title="View Room Details"
                className="rounded-xl shadow-lg object-cover w-full h-full cursor-pointer"
                style={{
                  minHeight: 260,
                  height: "100%",
                  aspectRatio: "16/10",
                  objectFit: "cover"
                }}
              />
            </div>

            {/* Right Side Content */}
            <div className="md:w-1/2 w-full flex flex-col justify-between gap-2"
                style={{ minHeight: 260, height: "100%" }}
            >
              <div className="flex-1">
                <p className="text-gray-500">{room.hotel.city}</p>
                <p
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    scrollTo(0, 0);
                  }}
                  className="text-gray-800 text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel.name}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  {/* <p className="ml-2">200+ reviews</p> */}
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <FiMapPin />
                  <span>{room.hotel.address}</span>
                </div>
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => {
                    const Icon = facilityIcons[item];
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <p className="text-xs">{item}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-medium text-gray-700">
                  ${room.pricePerNight} <span className="text-base font-normal">/night</span>
                </p>
                <button
                  onClick={() => handleBookNow(room._id)}
                  className="px-6 py-2 rounded-lg bg-[#49B9FF] text-white font-semibold shadow hover:bg-[#2399e5] transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 ml-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters ? "border-b" : ""}`}>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='text-xs cursor-pointer'>
            <span onClick={()=> setOpenFilters(!openFilters)} className='lg:hidden'>{openFilters ? 'HIDE' : 'SHOW'}</span>
            <span className='hidden lg:block'>CLEAR</span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
            {roomTypes.map((room, index)=>(
              <CheckBox key={index} label={room} />
            ))}
          </div>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index)=>(
              <CheckBox key={index} label={`$ ${range}`} />
            ))}
          </div>
          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index)=>(
              <RadioButton key={index} label={option} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default HotelRoomsPage;
