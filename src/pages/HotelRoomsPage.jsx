// src/pages/HotelRoomsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import RoomCard from "../components/RoomCard";
import BookingModal from "../components/BookingModal";
import useAuth from "../hooks/useAuth";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_PAGE_SIZE = 5;

// Convert "DD/MM/YYYY" → "YYYY-MM-DD" for <input type="date">
function toISODate(dmy = "") {
  const parts = dmy.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function HotelRoomsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isLoggedIn = !!auth?.accessToken;

  // Hero search params: checkIn/checkOut in "DD/MM/YYYY"
  const heroParams = location.state?.params;
  const fromHero = Boolean(heroParams);

  // Build our search parameters (send DD/MM/YYYY back to API)
  const [searchParams] = useState(
    fromHero
      ? { ...heroParams }
      : { page: 0, size: DEFAULT_PAGE_SIZE, sortBy: "newestFirst" }
  );

  // Convert heroParams to ISO for <input> fields
  const [initialCheckInISO, initialCheckOutISO] = useMemo(() => {
    if (!fromHero) return ["", ""];
    return [toISODate(heroParams.checkIn), toISODate(heroParams.checkOut)];
  }, [fromHero, heroParams]);

  // Pagination & data state
  const [rooms, setRooms] = useState(location.state?.rooms || []);
  const [roomImages, setRoomImages] = useState({});
  const [page, setPage] = useState(searchParams.page);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Booking popup state
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Date inputs for booking modal
  const [checkInDate, setCheckInDate] = useState(initialCheckInISO);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutISO);

  const [showBookToast, setShowBookToast] = useState(false);

  // Fetch one page of rooms
  const fetchPage = useCallback(
    async (pageToLoad) => {
      setLoading(true);
      try {
        const params = { ...searchParams, page: pageToLoad };
        const url = fromHero
          ? "/room/search-availability"
          : "/room/searchRooms";
        const res = await axios.get(url, { params });
        const items = res.data.content || [];

        setRooms((prev) => (pageToLoad === 0 ? items : [...prev, ...items]));
        if (items.length < searchParams.size) {
          setHasMore(false);
        }

        // Fetch one photo per room
        const imgs = await Promise.all(
          items.map(async (r) => {
            const photoRes = await axios
              .get("/photo/getPhoto", {
                params: { type: "ROOM", referenceId: r.roomId },
              })
              .catch(() => ({ data: [] }));
            return {
              roomId: r.roomId,
              url: photoRes.data[0]?.url ?? null,
            };
          })
        );
        setRoomImages((prev) => {
          const copy = { ...prev };
          imgs.forEach(({ roomId, url }) => (copy[roomId] = url));
          return copy;
        });
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fromHero, searchParams]
  );

  // Initial load
  useEffect(() => {
    if (rooms.length === 0 || fromHero) {
      fetchPage(searchParams.page);
    }
  }, [fetchPage, fromHero, rooms.length, searchParams.page]);

  // Auto-hide login toast
  useEffect(() => {
    if (showBookToast) {
      const t = setTimeout(() => setShowBookToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showBookToast]);

  // Handlers
  const handleBookNow = (roomId) => {
    if (!isLoggedIn) {
      setShowBookToast(true);
      navigate("/sign-in", {
        state: {
          from: location,
          bookNowError: "You need to login to book a room.",
        },
      });
      return;
    }
    setSelectedRoom(rooms.find((r) => r.roomId === roomId));
    setCheckInDate(initialCheckInISO);
    setCheckOutDate(initialCheckOutISO);
    setShowBookPopup(true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const next = page + 1;
      setPage(next);
      fetchPage(next);
    }
  };

  return (
    <>
      <div className="pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Login Toast */}
        {showBookToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            You need to login to book a room.
          </div>
        )}

        {showBookPopup && selectedRoom && (
          <BookingModal
            room={selectedRoom}
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            setShow={setShowBookPopup}
          />
        )}

        {/* Header */}
        <h1 className="font-playfair text-4xl mb-4">Hotel Rooms</h1>

        {/* Empty/Loading */}
        {loading && rooms.length === 0 && <p>Loading rooms…</p>}
        {!loading && rooms.length === 0 && (
          <p className="text-center text-gray-500">
            No rooms found for your criteria.
          </p>
        )}

        {/* Room List */}
        <div className="space-y-10">
          {rooms.map((r) => (
            <RoomCard
              key={r.roomId}
              room={r}
              imageUrl={roomImages[r.roomId]}
              onView={() => {
                navigate(`/rooms/${r.hotelId}/${r.roomId}`);
                window.scrollTo(0, 0);
              }}
              onBook={() => handleBookNow(r.roomId)}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMore && rooms.length > 0 && (
          <div className="flex justify-center my-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded shadow disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
