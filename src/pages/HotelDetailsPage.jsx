import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { roomsDummyData } from '../roomsDummyData';
import StarRating from '../components/StarRating';
import { FiMapPin } from 'react-icons/fi';
import { FaWifi, FaCoffee, FaSwimmer, FaCar, FaUtensils, FaFan, FaBed, FaWineBottle, FaSpa, FaTv } from 'react-icons/fa';

const HotelDetailsPage = () => {
  const { hotelId, roomId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Map amenity strings to React icon components
  const facilityIcons = {
    "WiFi": FaWifi,
    "Breakfast": FaCoffee,
    "Air Conditioning": FaFan,
    "Bed": FaBed,
    "Pool": FaSwimmer,
    "Sea View": FaUtensils,
    "Parking": FaCar,
    "Bar": FaWineBottle,
    "Spa": FaSpa,
    "TV": FaTv,
  };

  useEffect(() => {
    const room = roomsDummyData.find(
      r => r.hotelId === hotelId && r._id === roomId
    );
    if (room) {
      setHotel(room);
      setMainImage(room.images[0]);
    }
  }, [hotelId, roomId]);

  if (!hotel) return null;

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Hotel Details */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{hotel.hotelName} 
          <span className='font-inter text-sm'> ({hotel.roomtype})</span>
        </h1>
      </div>

      {/* Hotel Rating */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
      </div>

      {/* Hotel Address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <FiMapPin />
        <span>{hotel.address}</span>
      </div>

      {/* Hotel Images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img src={mainImage} alt="Hotel Main" 
            className='w-full rounded-xl shadow-lg object-cover' />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {hotel.images.length > 1 && hotel.images.map((image, index) => (
            <img
              onClick={() => setMainImage(image)}
              key={index}
              src={image}
              alt='Room'
              className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'outline outline-3 outline-orange-500' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Hotel Highlights */}
      <div className='flex flex-col md:flex-row md:justify-between mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {hotel.amenities.map((item, index) => {
              const Icon = facilityIcons[item];
              return (
                <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                  {Icon && <Icon className='w-5 h-5' />}
                  <p className='text-xs'>{item}</p>
                </div>
              );
            })}
          </div>
          {/* Hotel Price */}
          <p className='text-2xl font-medium'>${hotel.pricePerNight} <span className='text-base font-normal'>/night</span></p>
        </div>
      </div>

      {/* Hotel Description */}
      <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500 mt-10'>
        <p>{hotel.description}</p>
      </div>

      {/* Hotel Owner */}
      <div className='flex flex-col items-start gap-4 mt-8'>
        <div className='flex gap-4 items-center'>
          <img src={hotel.owner.image} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
          <div>
            <p className='text-lg md:text-xl'>Hosted By: {hotel.owner.name}</p>
            <div className='flex items-center mt-1'>
              <StarRating />
            </div>
          </div>
        </div>
            <button
                className='px-6 py-2.5 mt-4 rounded text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer'
            >
                Contact Now
            </button>
      </div>
    </div>
  );
}

export default HotelDetailsPage
