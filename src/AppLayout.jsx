import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HotelRegistration from "./components/HotelRegistration";
import AuthContext from "./context/AuthProvider";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [showHotelRegistration, setShowHotelRegistration] = useState(false);
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (
      auth?.role === "MANAGER" &&
      window.location.pathname.startsWith("/hotelManager") &&
      localStorage.getItem("showHotelRegistration") === "true"
    ) {
      setShowHotelRegistration(true);
    }
  }, [auth]);

  const handleCloseRegistration = () => {
    setShowHotelRegistration(false);
    localStorage.removeItem("showHotelRegistration");
  };

  const isHotelManager = location.pathname.startsWith("/hotelManager");
  const isLoginPage = location.pathname === "/sign-in";
  const isSignUpPage = location.pathname === "/sign-up";
  const isForgotPassword = location.pathname === "/forgot-password";
  const isHome = location.pathname === "/";

  const hideNavbar =
    isHotelManager || isLoginPage || isSignUpPage || isForgotPassword;

  return (
    <div>
      {!hideNavbar && !showHotelRegistration && <Navbar isHome={isHome} />}
      <div className="min-h-[70vh]">
        <Outlet />
      </div>
      {showHotelRegistration && (
        <HotelRegistration onClose={handleCloseRegistration} />
      )}
    </div>
  );
};

export default AppLayout;
