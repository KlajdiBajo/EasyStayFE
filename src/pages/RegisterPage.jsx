import Register from "../components/Register";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const RegisterPage = () => {
  return (
    <main className="register-page">
      <Register />
      <ToastContainer />
    </main>
  );
};

export default RegisterPage;
