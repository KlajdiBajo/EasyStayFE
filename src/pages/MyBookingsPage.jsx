import { useState } from 'react'
import Title from '../components/Title';
import { userBookingsDummyData } from '../userBookingsDummyData';
import { FiMapPin, FiUser } from 'react-icons/fi';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState(
    userBookingsDummyData.map(b => ({ ...b, isCanceled: b.isCanceled || false }))
  );
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const openCancelModal = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowConfirmModal(true);
  };

  const handleCancle = () => {
    setBookings(prev =>
      prev.map(b =>
        b._id === bookingToCancel ? { ...b, isCanceled: true } : b
      )
    );
    setCancelSuccess(bookingToCancel);
    setShowConfirmModal(false);

    setTimeout(() => {
      setBookings(prev =>
        prev.filter(b => b._id !== bookingToCancel)
      );
      setCancelSuccess(null);
      setBookingToCancel(null);
    }, 1000);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setBookingToCancel(null);
  };

  const isUpcoming = (checkInDate) => {
    return new Date(checkInDate) > new Date();
  };

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title
        title="My Bookings"
        subtitle={
          <>
            Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips
            <br />
            seamlessly with just a few clicks.
          </>
        }
        align="left"
      />

      {cancelSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in">
          Reservation canceled successfully!
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Reservation?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded transition font-semibold"
                onClick={handleCancle}
              >
                Yes, Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition font-semibold"
                onClick={closeModal}
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div className='w-1/3'>Hotels</div>
          <div className='w-1/3'>Date & Timings</div>
          <div className='w-1/3'>Reservation</div>
        </div>
        {bookings.map((booking) => (
          <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
            {/* ----- Hotel Details -----*/}
            <div className='flex flex-col md:flex-row'>
              <img
                src={booking.room.images[0]}
                alt="hotel-img"
                className='w-full md:w-44 rounded shadow object-cover'
              />
              <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-3'>
                <p className='font-playfair text-2xl'>{booking.hotel.name}
                  <span className='font-sans text-sm'> ({booking.room.roomtype})</span>
                </p>
                <div className='flex items-center gap-1 text-sm text-gray-500'>
                  <FiMapPin />
                  <span>{booking.hotel.address}</span>
                </div>
                <div className='flex items-center gap-1 text-sm text-gray-500'>
                  <FiUser />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p className='text-base'>Total: ${booking.totalPrice}</p>
              </div>
            </div>
            {/* ----- Date & Timings -----*/}
            <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
              <div>
                <p>Check-in:</p>
                <p className='text-gray-500 text-sm'>{new Date(booking.checkInDate).toDateString()}</p>
              </div>
              <div>
                <p>Check-out:</p>
                <p className='text-gray-500 text-sm'>{new Date(booking.checkOutDate).toDateString()}</p>
              </div>
            </div>
            {/* ----- Reservation Management -----*/}
            <div className='flex flex-col items-start justify-center pt-3'>
              {booking.isCanceled ? (
                <span className='text-red-500 font-semibold'>Canceled</span>
              ) : isUpcoming(booking.checkInDate) ? (
                <button
                  onClick={() => openCancelModal(booking._id)}
                  className='px-5 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-700 transition'
                >
                  Cancel Reservation
                </button>
              ) : (
                <span className='text-gray-500 text-sm'>Past booking</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookingsPage;
