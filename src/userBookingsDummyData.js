export const userBookingsDummyData = [
  {
    _id: "bkg1",
    hotel: {
      name: "Grand Palace Hotel",
      address: "123 Main St, Tirane, Albania",
    },
    room: {
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
      ],
      roomtype: "Luxury Suite",
    },
    guests: 2,
    totalPrice: 320,
    checkInDate: "2025-06-01T15:00:00.000Z",
    checkOutDate: "2025-06-05T11:00:00.000Z",
    isCanceled: false,
  },
  {
    _id: "bkg2",
    hotel: {
      name: "Beachfront Resort",
      address: "456 Ocean Ave, Sarande, Albania",
    },
    room: {
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80"
      ],
      roomtype: "Double Bed",
    },
    guests: 3,
    totalPrice: 540,
    checkInDate: "2025-07-12T14:00:00.000Z",
    checkOutDate: "2025-07-16T11:00:00.000Z",
    isCanceled: false,
  },
  {
    _id: "bkg3",
    hotel: {
      name: "Mountain View Inn",
      address: "789 Lake Road, Shkoder, Albania",
    },
    room: {
      images: [
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
      ],
      roomtype: "Family Suite",
    },
    guests: 4,
    totalPrice: 700,
    checkInDate: "2025-08-21T16:00:00.000Z",
    checkOutDate: "2025-08-26T12:00:00.000Z",
    isCanceled: false,
  }
];
