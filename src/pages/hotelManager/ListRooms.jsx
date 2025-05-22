import { useState, useEffect } from "react";
import Title from "../../components/Title";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotelId, setHotelId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  // Room type and amenity label maps
  const roomTypeLabels = {
    FAMILY_SUITE: "Family Suite",
    LUXURY_ROOM: "Luxury Room",
    DOUBLE_BED: "Double Bed",
    SINGLE_BED: "Single Bed",
  };

  const amenityLabelMap = {
    FREE_WIFI: "Free Wifi",
    FREE_BREAKFAST: "Free Breakfast",
    ROOM_SERVICE: "Room Service",
    MOUNTAIN_VIEW: "Mountain View",
    POOL_ACCESS: "Pool Access",
  };

  // Fetch hotelId for this manager
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

  // Fetch rooms for this hotel
  useEffect(() => {
    const fetchRooms = async () => {
      if (!hotelId) return;
      try {
        const res = await axiosPrivate.get("/room/searchRooms", {
          params: { hotelId, page, size },
        });
        setRooms(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        toast.error("Failed to fetch rooms");
      }
    };
    fetchRooms();
  }, [axiosPrivate, hotelId, page, size]);

  const openDeleteModal = (roomId) => {
    setRoomToDelete(roomId);
    setShowDeleteModal(true);
  };

  const handleDeleteRoom = async () => {
    try {
      await axiosPrivate.delete("/room", { params: { roomId: roomToDelete } });
      setRooms((prev) => prev.filter((room) => room.roomId !== roomToDelete));
      setShowDeleteModal(false);
      toast.success("Room deleted successfully");
      setRoomToDelete(null);
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <>
      <div>
        <Title
          align="left"
          font="outfit"
          title="Room Listings"
          subtitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
        />
        <p className="text-gray-500 mt-8">All Rooms</p>

        <div className="w-full">
          <div className="text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                  <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                    Facility
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Price / night
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rooms.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      {roomTypeLabels[item.type] || item.type}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                      {(item.amenities || [])
                        .map((a) => amenityLabelMap[a] || a)
                        .join(", ")}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      {item.pricePerNight}
                    </td>
                    <td className="py-3 px-4 border-t border-gray-300 text-center">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        onClick={() => openDeleteModal(item.roomId)}
                      >
                        Delete Room
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Delete Room?</h2>
            <p className="mb-4">Are you sure you want to delete this room?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDeleteRoom}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
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

export default ListRooms;
