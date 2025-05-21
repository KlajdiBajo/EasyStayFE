import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const RequireRole = ({ role, children }) => {
  const { auth } = useContext(AuthContext);

  // If not logged in, send to home
  if (!auth?.role) {
    return <Navigate to="/" replace />;
  }

  // If not the required role, show Unauthorized
  if (auth.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireRole;
