import Login from "../components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function LoginPage() {
  return (
    <main className="login-page">
      <Login />
      <ToastContainer />
    </main>
  );
}

export default LoginPage;
