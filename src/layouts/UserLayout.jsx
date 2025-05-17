import { Outlet } from "react-router-dom";
import UserNavBar from "../components/UserNavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLayout = () => {
  return (
    <>
      <UserNavBar />
      <Outlet />
      <ToastContainer />
    </>
  );
};

export default UserLayout;
