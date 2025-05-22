// src/pages/HotelDetailsPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { FiMapPin } from "react-icons/fi";
import {
  FaWifi,
  FaCoffee,
  FaSwimmer,
  FaConciergeBell,
  FaMountain,
  FaBed,
} from "react-icons/fa";

// Mapping of facility keys → icon components
const FACILITY_ICONS = {
  FREE_WIFI: FaWifi,
  FREE_BREAKFAST: FaCoffee,
  ROOM_SERVICE: FaConciergeBell,
  MOUNTAIN_VIEW: FaMountain,
  POOL_ACCESS: FaSwimmer,
};

// Human-friendly room type labels
const ROOM_TYPE_LABELS = {
  FAMILY_SUITE: "Family Suite",
  LUXURY_ROOM: "Luxury Room",
  DOUBLE_BED: "Double Bed",
  SINGLE_BED: "Single Bed",
};

export default function HotelDetailsPage() {
  const { hotelId, roomId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const humanRoomType = useMemo(
    () => ROOM_TYPE_LABELS[room?.type] || room?.type.replaceAll("_", " "),
    [room]
  );

  const gridColsClass = useMemo(() => {
    if (images.length <= 1) return "grid-cols-1";
    if (images.length === 2) return "grid-cols-2";
    if (images.length === 3) return "grid-cols-3";
    return "grid-cols-4";
  }, [images]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [hRes, rRes, pRes] = await Promise.all([
        axios.get("/hotel/getById", { params: { hotelId } }),
        axios.get("/room/getById", { params: { roomId } }),
        axios.get("/photo/getPhoto", {
          params: { type: "ROOM", referenceId: roomId },
        }),
      ]);

      setHotel(hRes.data);
      setRoom(rRes.data);

      const raw = pRes.data;
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const urls = arr.map(({ url }) => url);
      setImages(urls);
      setMainImage(urls[0] ?? "/images/no-photo-available.png");
    } catch (e) {
      console.error(e);
      setError("Failed to load hotel details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hotelId, roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <p className="p-8 text-center text-gray-600">Loading…</p>;
  }
  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  return (
    <article className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hotel Name */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-playfair">{hotel.name}</h1>
        <h2 className="text-xl text-gray-600 mt-1">{humanRoomType}</h2>
      </header>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-500 mb-10">
        <FiMapPin />
        <address className="not-italic">
          {hotel.roadName}, {hotel.city}, {hotel.country}
        </address>
      </div>

      {/* Image Gallery */}
      <section className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt="Main room view"
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className={`grid gap-4 w-full ${gridColsClass}`}>
          {images.length > 0 ? (
            images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(src)}
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === src
                    ? "outline-3 outline-orange-500 outline"
                    : ""
                }`}
              />
            ))
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">No photos available</span>
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section className="flex flex-wrap gap-4 mb-6">
        {room.amenities.map((amenity, idx) => {
          const Icon = FACILITY_ICONS[amenity];
          const label = amenity.replaceAll("_", " ");
          return (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
            >
              {Icon && <Icon className="w-5 h-5 text-gray-600" />}
              <span className="text-xs text-gray-700">{label}</span>
            </div>
          );
        })}
      </section>

      {/* Guest Count & Pricing */}
      <section className="flex items-center gap-6 mb-10">
        <div className="flex items-center gap-2 text-gray-600">
          <FaBed className="w-5 h-5" />
          <span className="text-sm">
            {room.maxGuests} guest{room.maxGuests > 1 ? "s" : ""}
          </span>
        </div>
        <p className="text-2xl font-medium">
          ${room.pricePerNight}{" "}
          <span className="text-base font-normal">/ night</span>
        </p>
      </section>

      {/* Description */}
      <section className="max-w-3xl border-t border-b border-gray-300 py-10 text-gray-500">
        <p>{hotel.description}</p>
      </section>
    </article>
  );
}
