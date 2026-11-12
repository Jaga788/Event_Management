import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages like Checkout and My Bookings need a logged-in user.
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default ProtectedRoute;
