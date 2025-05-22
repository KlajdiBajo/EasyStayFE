import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import ERROR_MESSAGES from "../constants/ErrorMessages.js";

// Converts ISO "YYYY-MM-DD" → "DD/MM/YYYY" for server parsing
function toServerDate(iso = "") {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`; // dd/MM/yyyy
}

const BookingModal = ({
  room,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  setShow,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!checkInDate || !checkOutDate) {
      // show inline error
      return;
    }

    const bookingDto = {
      roomId: room.roomId,
      reservedFrom: toServerDate(checkInDate), // e.g. "27-06-2025"
      reservedTo: toServerDate(checkOutDate), // e.g. "29-06-2025"
    };

    try {
      await axiosPrivate.post("/booking", bookingDto);
      setSuccess(true);
      setTimeout(() => {
        setShow(false);
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      const msgKey = err?.response?.data?.message;
      const text =
        ERROR_MESSAGES[msgKey] || "Booking failed. Please try again.";
      // display error toast or inline message
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="mb-4">Redirecting to My Bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Book This Room?</h2>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Check-out Date</label>
            <input
              type="date"
              min={checkInDate}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            disabled={!checkInDate || !checkOutDate}
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow disabled:opacity-50"
          >
            Yes, Book
          </button>
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-300 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
