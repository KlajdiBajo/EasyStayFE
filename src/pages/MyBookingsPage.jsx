import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { FiMapPin, FiUser } from "react-icons/fi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";

const roomTypeLabels = {
  FAMILY_SUITE: "Family Suite",
  LUXURY_ROOM: "Luxury Room",
  DOUBLE_BED: "Double Bed",
  SINGLE_BED: "Single Bed",
};

const parseDmy = (dmy) => {
  if (!dmy) return null;
  const [day, month, year] = dmy.split("/");
  return new Date(+year, +month - 1, +day);
};

const MyBookingsPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const username = auth?.user;

  const [bookings, setBookings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [page, setPage] = useState(0);
  const size = 2;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosPrivate.get("/booking", {
          params: { username, page, size },
        });
        const data = res.data.content || [];

        const enriched = await Promise.all(
          data.map(async (b) => {
            let roomDetails = null;
            try {
              const roomRes = await axiosPrivate.get("/room/getById", {
                params: { roomId: b.roomId },
              });
              roomDetails = roomRes.data;
            } catch (err) {
              const messageKey = err?.response?.data?.message;
              const toastMessage =
                ERROR_MESSAGES[messageKey] ||
                "Failed to load the booked room. Please try again later!";
              toast.error(toastMessage);
            }

            let photoUrl = null;
            try {
              const photoRes = await axiosPrivate.get("/photo/getPhoto", {
                params: { type: "ROOM", referenceId: b.roomId },
              });
              photoUrl = photoRes.data[0]?.url ?? null;
            } catch (err) {
              const messageKey = err?.response?.data?.message;
              const toastMessage =
                ERROR_MESSAGES[messageKey] ||
                "Failed to load the booked rooms images.";
              toast.error(toastMessage);
            }

            return {
              ...b,
              room: roomDetails,
              photoUrl,
              checkInDate: b.reservedFrom,
              checkOutDate: b.reservedTo,
            };
          })
        );

        setBookings((prev) => (page === 0 ? enriched : [...prev, ...enriched]));
        if (enriched.length < size) setHasMore(false);
      } catch (err) {
        const messageKey = err?.response?.data?.message;
        const toastMessage =
          ERROR_MESSAGES[messageKey] ||
          "Failed to load bookings. Please try again.";
        toast.error(toastMessage);
      }
    };
    if (username && hasMore) fetchBookings();
  }, [axiosPrivate, username, page, hasMore]);

  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowConfirmModal(true);
  };

  const handleCancel = async () => {
    try {
      await axiosPrivate.patch("/booking/cancel", null, {
        params: { bookingId: bookingToCancel },
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingToCancel ? { ...b, isCancelled: true } : b
        )
      );
      setShowConfirmModal(false);
      toast.success("Reservation canceled successfully!");
      setBookingToCancel(null);
    } catch (err) {
      const messageKey = err?.response?.data?.message;
      const toastMessage =
        ERROR_MESSAGES[messageKey] ||
        "Failed to cancel booking. Please try again.";
      toast.error(toastMessage);
    }
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setBookingToCancel(null);
  };

  const isUpcoming = (dmy) => {
    const date = parseDmy(dmy);
    return date && date > new Date();
  };

  return (
    <>
      <div className="py-28 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
        <Title
          title="My Bookings"
          subtitle={
            <>
              Easily manage your past, current, and upcoming hotel reservations.
              <br /> Plan your trips seamlessly.
            </>
          }
          align="left"
        />

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg px-8 py-6 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Cancel Reservation?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this reservation? This action
                cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded font-semibold"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded font-semibold"
                >
                  No, Keep
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mt-8 w-full text-gray-800">
          <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
            <div>Hotels & Rooms</div>
            <div>Date & Timings</div>
            <div>Reservation</div>
          </div>

          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={booking.photoUrl}
                  alt="room"
                  className="w-full md:w-44 rounded shadow object-cover"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 md:ml-3">
                  <p className="font-playfair text-2xl">
                    {booking.room?.name}
                    <span className="font-sans text-sm ml-2">
                      {roomTypeLabels[booking.room?.type] || booking.room?.type}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiMapPin />
                    <span>
                      {booking.room?.roadName}, {booking.room?.city},{" "}
                      {booking.room?.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiUser /> <span>Guests: {booking.room?.maxGuests}</span>
                  </div>
                  <p className="text-base">Total: ${booking.totalCosts}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-in:</p>
                  <p className="text-gray-500 text-sm">
                    {parseDmy(booking.checkInDate)?.toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-out:</p>
                  <p className="text-gray-500 text-sm">
                    {parseDmy(booking.checkOutDate)?.toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center pt-3">
                {booking.isCancelled ? (
                  <span className="text-red-500 font-semibold">Canceled</span>
                ) : isUpcoming(booking.checkInDate) ? (
                  <button
                    onClick={() => openCancelModal(booking.bookingId)}
                    className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-700"
                  >
                    Cancel Reservation
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">Past booking</span>
                )}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default MyBookingsPage;
