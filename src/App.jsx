import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./components/ForgotPassword";
import Unauthorized from "./components/Unauthorized";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ChangePassword from "./components/ChangePassword";
import HotelRoomsPage from "./pages/HotelRoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import Layout from "./pages/hotelManager/Layout";
import Dashboard from "./pages/hotelManager/Dashboard";
import AddRoom from "./pages/hotelManager/AddRoom";
import ListRooms from "./pages/hotelManager/ListRooms";
import RequireRole from "./components/RequireRole"; // <--- This is your role-based guard
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookingsProvider } from "./context/BookingContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/rooms"
        element={
          <BookingsProvider>
            <HotelRoomsPage />
          </BookingsProvider>
        }
      />
      <Route path="/rooms/:hotelId/:roomId" element={<HotelDetailsPage />} />
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Protected user-only route */}
      <Route
        path="/bookings"
        element={
          // <RequireRole role="USER">
          //   <MyBookingsPage />
          // </RequireRole>
          <BookingsProvider>
            <MyBookingsPage />
          </BookingsProvider>
        }
      />

      {/* Protected hotel-manager-only routes */}
      <Route
        path="/hotelManager"
        element={
          <RequireRole role="MANAGER">
            <Layout />
          </RequireRole>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="add-room" element={<AddRoom />} />
        <Route path="list-rooms" element={<ListRooms />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
