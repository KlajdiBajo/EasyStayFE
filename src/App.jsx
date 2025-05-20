import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/sign-up" element={<RegisterPage />} />
      <Route path="/sign-in" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/rooms" element={<HotelRoomsPage />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/rooms/:hotelId/:roomId" element={<HotelDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
