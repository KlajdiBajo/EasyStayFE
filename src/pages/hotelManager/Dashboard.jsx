import { useState, useEffect } from "react";
import Title from "../../components/Title";
import { MdOutlineEventAvailable, MdAttachMoney } from "react-icons/md";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });
  const [bookings, setBookings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(5); // Show 5 bookings per page
  const [totalPages, setTotalPages] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosPrivate.get("/booking/getStats");
        setDashboardData((prev) => ({
          ...prev,
          totalBookings: response.data.totalBookings,
          totalRevenue: response.data.totalRevenue,
        }));
      } catch {
        toast.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, [axiosPrivate]);

  useEffect(() => {
    const fetchHotelId = async () => {
      try {
        if (!auth?.user) return;
        const res = await axiosPrivate.get("/hotel/filterHotels", {
          params: { managerUserId: auth.userId, page: 0, size: 1 },
        });
        const hotels = res.data.content || [];
        if (hotels.length > 0) {
          setHotelId(hotels[0].hotelId);
        }
      } catch {
        toast.error("Failed to fetch hotel info");
      }
    };
    fetchHotelId();
  }, [auth, axiosPrivate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!hotelId) return;
      try {
        const response = await axiosPrivate.get("/booking", {
          params: { hotelId, page, size },
        });
        setBookings(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } catch {
        toast.error("Failed to fetch bookings");
      }
    };
    fetchBookings();
  }, [axiosPrivate, hotelId, page, size]);

  // Helper to get reservation status
  const getReservationStatus = (checkIn, checkOut, isCancelled) => {
    if (isCancelled) return "Cancelled";
    const today = new Date();
    const checkInDate = parseDateString(checkIn);
    const checkOutDate = parseDateString(checkOut);
    today.setHours(0, 0, 0, 0);
    checkInDate && checkInDate.setHours(0, 0, 0, 0);
    checkOutDate && checkOutDate.setHours(0, 0, 0, 0);
    if (today < checkInDate) return "Upcoming";
    if (today > checkOutDate) return "Finished";
    if (today >= checkInDate && today <= checkOutDate) return "In Progress";
    if (checkInDate < today) return "Pending";
    return null;
  };

  // Helper to parse date string (ISO or DD/MM/YYYY)
  function parseDateString(dateStr) {
    if (!dateStr) return null;
    if (dateStr.includes("-")) return new Date(dateStr); // ISO
    const [day, month, year] = dateStr.split("/");
    return new Date(+year, +month - 1, +day);
  }

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
      toast.success("Cancelation successful");
      setBookingToCancel(null);
    } catch {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <>
      <div>
        <Title
          align="left"
          font="outfit"
          title="Dashboard"
          subtitle="Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations"
        />

        <div className="flex gap-4 my-8">
          {/* ---- Total Bookings ----*/}
          <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
            <MdOutlineEventAvailable className="text-blue-500 h-10 w-10 max-sm:hidden" />
            <div className="flex flex-col sm:ml-4 font-medium">
              <p className="text-blue-500 text-lg">Total Bookings</p>
              <p className="text-neutral-400 text-base">
                {dashboardData.totalBookings}
              </p>
            </div>
          </div>

          {/* ---- Total Revenue ----*/}
          <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
            <MdAttachMoney className="text-green-600 h-10 w-10 max-sm:hidden" />
            <div className="flex flex-col sm:ml-4 font-medium">
              <p className="text-blue-500 text-lg">Total Revenue</p>
              <p className="text-neutral-400 text-base">
                $ {dashboardData.totalRevenue}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Recent Bookings ----*/}
        <h2 className="text-xl text-blue-950/70 font-medium mb-5">
          Recent Bookings
        </h2>
        <div className="w-full">
          <div className="text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Reservation Ticket
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Username
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Room Number
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Check In
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Check Out
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium text-center">
                    Reservation
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bookings.map((item, index) => {
                  const status = getReservationStatus(
                    item.reservedFrom,
                    item.reservedTo,
                    item.isCancelled
                  );
                  return (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.bookingTicket}
                      </td>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.username}
                      </td>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.roomNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.reservedFrom}
                      </td>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.reservedTo}
                      </td>
                      <td className="py-3 px-4 border-t border-gray-300 text-center">
                        {status === "Cancelled" ? (
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                            Cancelled
                          </span>
                        ) : status === "Upcoming" ? (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                            Upcoming
                          </span>
                        ) : status === "In Progress" ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            In Progress
                          </span>
                        ) : status === "Pending" ? (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                            Pending
                          </span>
                        ) : status === "Finished" ? (
                          <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs">
                            Finished
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="w-full border-t pt-4 bg-white">
            <div className="flex gap-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Cancel Reservation?</h2>
            <p className="mb-4">
              Are you sure you want to cancel this reservation?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCancel}
              >
                Yes, Cancel
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowConfirmModal(false)}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Dashboard;
