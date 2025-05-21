import React, { createContext, useContext, useState } from "react";
import { userBookingsDummyData } from "../userBookingsDummyData";

// 1. Create the context
const BookingsContext = createContext();

// 2. Provider
export const BookingsProvider = ({ children }) => {
  // Initial state includes existing dummy data (simulates "backend" bookings)
  const [bookings, setBookings] = useState(
    userBookingsDummyData.map(b => ({ ...b, isCanceled: b.isCanceled || false }))
  );

  return (
    <BookingsContext.Provider value={{ bookings, setBookings }}>
      {children}
    </BookingsContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useBookings = () => useContext(BookingsContext);
