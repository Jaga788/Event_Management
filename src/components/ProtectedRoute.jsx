import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages like Checkout and My Bookings need a logged-in user.
function ProtectedRoute({ children, role }) {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page center" role="status">Checking your session…</div>;
  if (error) return <div className="page center"><p className="error" role="alert">Could not verify your session: {error}. Reload the page or sign in again.</p></div>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;
