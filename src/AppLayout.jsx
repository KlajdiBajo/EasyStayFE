import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

const AppLayout = () => {
  const location = useLocation();
  const isHotelManager = location.pathname.includes("hotelManager");
  const isLoginPage = location.pathname === "/sign-in";
  const isSignUpPage = location.pathname === "/sign-up";
  const isForgotPassword = location.pathname === "/forgot-password";
  const isHome = location.pathname === "/";

  const hideNavbar = isHotelManager || isLoginPage || isSignUpPage || isForgotPassword;
  
  return (
    <div>
      {!hideNavbar && <Navbar isHome={isHome}/>}
      <div className='min-h-[70vh]'>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout
