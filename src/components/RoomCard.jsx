import React from "react";
import { FiMapPin } from "react-icons/fi";
import { FaImage } from "react-icons/fa";

const RoomCard = ({ room, imageUrl, onView, onBook }) => {
  return (
    <div
      className="flex flex-col md:flex-row items-stretch border-b border-gray-300 pb-10 last:border-0"
      style={{ minHeight: 340 }}
    >
      <div className="md:w-1/2 w-full flex">
        {imageUrl ? (
          <img
            src={imageUrl}
            onClick={onView}
            alt="Room photo"
            title="View Room Details"
            className="rounded-xl shadow-lg object-cover w-full h-full cursor-pointer"
            style={{
              minHeight: 260,
              aspectRatio: "16/10",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            onClick={onView}
            title="View Room Details"
            className="flex items-center justify-center rounded-xl bg-gray-100 w-full cursor-pointer"
            style={{
              minHeight: 260,
              aspectRatio: "16/10",
            }}
          >
            <FaImage className="text-6xl text-gray-300" />
          </div>
        )}
      </div>
      <div
        className="md:w-1/2 w-full flex flex-col justify-between pl-6"
        style={{ minHeight: 260 }}
      >
        <div>
          <p className="text-gray-500">{room.city}</p>
          <p onClick={onView} className="text-3xl font-playfair cursor-pointer">
            {room.name}
          </p>
          <div className="flex items-center gap-1 text-gray-500 mt-2">
            <FiMapPin />
            <span>{room.roadName}</span>
          </div>
          <div className="flex flex-wrap items-center mt-3 gap-4">
            {room.amenities.map((a, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-[#F5F5FF]/70 text-xs"
              >
                {a.replaceAll("_", " ")}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-medium text-gray-700">
            ${room.pricePerNight}{" "}
            <span className="text-base font-normal">/night</span>
          </p>
          <button
            onClick={onBook}
            className="px-6 py-2 bg-[#49B9FF] text-white rounded-lg shadow hover:bg-[#2399e5] transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
