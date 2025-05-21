export const dashboardDummyData = {
  totalBookings: 3, // You have 3 bookings in userBookingsDummyData
  totalRevenue: 320 + 540 + 700, // Sum of all totalPrice fields from userBookingsDummyData
  bookings: [
    {
      user: { username: "John Doe" },
      room: { roomType: "Luxury Suite" },
      totalPrice: 320,
      isPaid: true,
    },
    {
      user: { username: "Emily Smith" },
      room: { roomType: "Double Bed" },
      totalPrice: 540,
      isPaid: false,
    },
    {
      user: { username: "Luka Gjini" },
      room: { roomType: "Family Suite" },
      totalPrice: 700,
      isPaid: true,
    },
  ],
};
