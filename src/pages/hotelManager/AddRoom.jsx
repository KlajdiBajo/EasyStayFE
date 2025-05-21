import { useState } from 'react';
import Title from '../../components/Title';
import { FiCamera } from "react-icons/fi";

const initialImages = { 1: null, 2: null, 3: null, 4: null };
const initialInputs = {
  roomType: '',
  pricePerNight: 0,
  amenities: {
    'WiFi': false,
    'Breakfast': false,
    'Air Conditioning': false,
    'Pool': false,
    'TV': false,
    'Sea View': false,
    'Parking': false,
    'Spa': false,
    'Bar': false,
    'Room Service': false,
    'Mountain View': false,
    'Free Wifi': false,
    'Free Breakfast': false,
    'Pool Access': false,
  }
};

const AddRoom = ({ onAddRoom }) => {
  const [images, setImages] = useState(initialImages);
  const [inputs, setInputs] = useState(initialInputs);
  const [showToast, setShowToast] = useState(false);

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (onAddRoom) {
      const amenitiesArray = Object.keys(inputs.amenities).filter(a => inputs.amenities[a]);
      onAddRoom({
        roomtype: inputs.roomType,
        amenities: amenitiesArray,
        pricePerNight: Number(inputs.pricePerNight),
        images: Object.values(images).filter(Boolean).map(img => URL.createObjectURL(img)),
        _id: Date.now().toString(),
        isAvailable: true,
        // Optional: Add more fields as needed (hotelId, hotelName, etc.)
      });
    }
    setShowToast(true);
    setInputs(initialInputs);
    setImages(initialImages);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <form className="pb-10" onSubmit={handleAddRoom}>
      <Title align='left' font='outfit' title='Add Room' subtitle='Fill in the details...' />
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
          Room added successfully!
        </div>
      )}
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            {images[key] ? (
              <img className='h-20 w-20 object-cover rounded cursor-pointer opacity-80'
                   src={URL.createObjectURL(images[key])}
                   alt=""
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-100 rounded h-20 w-20 cursor-pointer opacity-80 border-2 border-dashed border-gray-300">
                <FiCamera className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept='image/*'
              id={`roomImage${key}`}
              hidden
              onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>
      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select
            value={inputs.roomType}
            onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
            className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Suite">Luxury Suite</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div>
          <p className='mt-4 text-gray-800'>
            Price <span className='text-xs'>/night</span>
          </p>
          <input
            type="number"
            placeholder='0'
            className='border border-gray-300 mt-1 rounded p-2 w-24'
            value={inputs.pricePerNight}
            onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })}
          />
        </div>
      </div>
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity]
                  }
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
          </div>
        ))}
      </div>
      <button className='bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer'>
        Add Room
      </button>
    </form>
  );
};

export default AddRoom;
