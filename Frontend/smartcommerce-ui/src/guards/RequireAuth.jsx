import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const isUserLoggedIn = isLoggedIn();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;