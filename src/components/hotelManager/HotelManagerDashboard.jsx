import { useState } from "react";
import AddRoom from "./AddRoom";
import ListRooms from "./ListRooms";
import { roomsDummyData } from "../../roomsDummyData";

const HotelManagerDashboard = () => {
  const [rooms, setRooms] = useState(roomsDummyData);

  const handleAddRoom = (roomData) => {
    console.log("Room to add:", roomData);
    setRooms(prev => {
      const updated = [roomData, ...prev];
      console.log("Updated rooms:", updated);
      return updated;
    });
  };

  return (
    <div>
      <AddRoom onAddRoom={handleAddRoom} />
      <ListRooms rooms={rooms} />
    </div>
  );
};


export default HotelManagerDashboard;
