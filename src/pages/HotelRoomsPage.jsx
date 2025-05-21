import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { roomsDummyData } from '../roomsDummyData';
import { FaWifi, FaCoffee, FaSwimmer, FaCar, FaUtensils, FaFan, FaBed, FaWineBottle, FaSpa, FaTv } from 'react-icons/fa';
import StarRating from '../components/StarRating';
import useAuth from "../hooks/useAuth";

import { useBookings } from '../context/BookingsContext';

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
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [bookNowError, setBookNowError] = useState('');
  const [showBookToast, setShowBookToast] = useState(false);

  // ===== Booking Popup State =====
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const { bookings, setBookings } = useBookings();
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  // FILTER HANDLERS
  const handleRoomTypeChange = (checked, label) => {
    setSelectedRoomTypes((prev) =>
      checked ? [...prev, label] : prev.filter(type => type !== label)
    );
  };

  const handlePriceRangeChange = (checked, label) => {
    setSelectedPriceRanges((prev) =>
      checked ? [...prev, label] : prev.filter(range => range !== label)
    );
  };

  const handleSortOptionChange = (label) => {
    setSelectedSortOption(label);
  };

  const filterByRoomType = (room) => 
    selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomtype);

  const filterByPriceRange = (room) => {
    if (selectedPriceRanges.length === 0) return true;
    return selectedPriceRanges.some(range => {
      const [min, max] = range.replace('$ ', '').split(' to ');
      return (
        room.pricePerNight >= Number(min) && room.pricePerNight <= Number(max)
      );
    });
  };

  let filteredRooms = roomsDummyData
    .filter(filterByRoomType)
    .filter(filterByPriceRange);

  if (selectedSortOption === "Price Low to High") {
    filteredRooms = filteredRooms.slice().sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (selectedSortOption === "Price High to Low") {
    filteredRooms = filteredRooms.slice().sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (selectedSortOption === "Newest First") {
    filteredRooms = filteredRooms.slice().reverse();
  }

  const navigate = useNavigate();
  const location = useLocation();

  // Show Book Now Popup
  const handleBookNow = (roomId) => {
    if (!isLoggedIn) {
      navigate("/sign-in", {
        state: { from: location, bookNowError: "You need to login to book a room." }
      });
    } else {
      const room = roomsDummyData.find(r => r._id === roomId);
      setSelectedRoom(room);
      setShowBookPopup(true);
      setCheckInDate('');
      setCheckOutDate('');
    }
  };

  // Confirm Booking
  const handleConfirmBooking = () => {
    if (!checkInDate || !checkOutDate) return;
    const newBooking = {
      _id: Date.now().toString(),
      hotel: selectedRoom.hotel,
      room: selectedRoom,
      guests: 2, // Or get from input
      checkInDate,
      checkOutDate,
      totalPrice: selectedRoom.pricePerNight,
      isCanceled: false
    };
    setBookings(prev => [...prev, newBooking]);
    setShowBookPopup(false);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 2200);
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

      {bookingSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in">
          Booking successful!
        </div>
      )}

      {/* Book Now Popup */}
      {showBookPopup && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Book This Room?</h2>
            <div className='flex flex-col gap-4 mb-4'>
              <div>
                <label className='block text-sm mb-1'>Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                disabled={!checkInDate || !checkOutDate}
                className="px-4 py-2 bg-[#49B9FF] hover:bg-[#2399e5] text-white rounded transition font-semibold"
                onClick={handleConfirmBooking}
              >
                Yes, Book
              </button>
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition font-semibold"
                onClick={() => setShowBookPopup(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-stretch py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
            style={{ minHeight: 340 }}
          >
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
            <span onClick={() => {
              setSelectedRoomTypes([]);
              setSelectedPriceRanges([]);
              setSelectedSortOption("");
            }}
            className='hidden lg:block'            >
              CLEAR
            </span>
          </div>
        </div>
        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
            {roomTypes.map((room, index)=>(
              <CheckBox 
                key={index} 
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index)=>(
              <CheckBox 
                key={index} 
                label={`$ ${range}`} 
                selected={selectedPriceRanges.includes(`$ ${range}`)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index)=>(
              <RadioButton 
                key={index} 
                label={option} 
                selected={selectedSortOption === option}
                onChange={handleSortOptionChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelRoomsPage;
