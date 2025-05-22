import { useState } from "react";
import Title from "../../components/Title";
import { FiCamera } from "react-icons/fi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const initialImages = { 1: null, 2: null, 3: null, 4: null };
const initialInputs = {
  roomNumber: "",
  roomType: "",
  pricePerNight: 0,
  maxGuests: 1,
  amenities: {
    "Free Wifi": false,
    "Free Breakfast": false,
    "Room Service": false,
    "Mountain View": false,
    "Pool Access": false,
  },
};

const amenityMap = {
  "Free Wifi": "FREE_WIFI",
  "Free Breakfast": "FREE_BREAKFAST",
  "Room Service": "ROOM_SERVICE",
  "Mountain View": "MOUNTAIN_VIEW",
  "Pool Access": "POOL_ACCESS",
};

const AddRoom = ({ onAddRoom }) => {
  const [images, setImages] = useState(initialImages);
  const [inputs, setInputs] = useState(initialInputs);
  const [showToast, setShowToast] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const handleAddRoom = async (e) => {
    e.preventDefault();

    const amenitiesArray = Object.keys(inputs.amenities)
      .filter((a) => inputs.amenities[a])
      .map((a) => amenityMap[a]);

    const payload = {
      roomNumber: inputs.roomNumber,
      type: inputs.roomType,
      pricePerNight: Number(inputs.pricePerNight),
      maxGuests: Number(inputs.maxGuests),
      amenities: amenitiesArray,
    };

    try {
      const roomRes = await axiosPrivate.post(
        "/room",
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const roomId = roomRes?.data?.roomId;

      if (roomId) {
        const uploadedImages = Object.values(images).filter(Boolean);

        for (const img of uploadedImages) {
          const formData = new FormData();
          formData.append("file", img);
          formData.append("type", "ROOM");
          formData.append("id", roomId);

          await axiosPrivate.post("/photo", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (onAddRoom) {
          onAddRoom({
            ...payload,
            images: uploadedImages.map((img) => URL.createObjectURL(img)),
            _id: roomId,
            isAvailable: true,
          });
        }

        setShowToast(true);
        setInputs(initialInputs);
        setImages(initialImages);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error("Error adding room or uploading images:", error);
    }
  };

  return (
    <form className="pb-10" onSubmit={handleAddRoom}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subtitle="Fill in the details..."
      />

      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium">
          Room added successfully!
        </div>
      )}

      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            {images[key] ? (
              <img
                className="h-20 w-20 object-cover rounded cursor-pointer opacity-80"
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
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) =>
                setImages({ ...images, [key]: e.target.files[0] })
              }
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4 flex-wrap">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Number</p>
          <input
            type="text"
            placeholder="101"
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            value={inputs.roomNumber}
            onChange={(e) =>
              setInputs({ ...inputs, roomNumber: e.target.value })
            }
          />
        </div>

        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="SINGLE_BED">Single Bed</option>
            <option value="DOUBLE_BED">Double Bed</option>
            <option value="LUXURY_ROOM">Luxury Room</option>
            <option value="FAMILY_SUITE">Family Suite</option>
          </select>
        </div>

        <div>
          <p className="mt-4 text-gray-800">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>

        <div>
          <p className="mt-4 text-gray-800">Max Guests</p>
          <input
            type="number"
            placeholder="1"
            className="border border-gray-300 mt-1 rounded p-2 w-24"
            value={inputs.maxGuests}
            onChange={(e) =>
              setInputs({ ...inputs, maxGuests: e.target.value })
            }
          />
        </div>
      </div>

      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm">
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
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}>{amenity}</label>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white px-8 py-2 rounded mt-8 cursor-pointer">
        Add Room
      </button>
    </form>
  );
};

export default AddRoom;
