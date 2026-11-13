import { Link, useLocation, useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatINR } from "../utils/format";

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const { orders, loading } = useOrders();
  const booking = orders.find((item) => String(item.id) === id);

  if (loading) return <div className="page center" role="status">Loading your booking…</div>;
  if (!booking) {
    return (
      <div className="page center">
        <h2>Booking not found</h2>
        <Link to="/orders" className="btn">Go to bookings</Link>
      </div>
    );
  }

  return (
    <div className="page center success-page">
      <div className="success-icon">✓</div>
      <h1>Booking request submitted</h1>
      <p>Your booking is awaiting organizer confirmation. No payment was taken by this API.</p>
      <div className="success-box">
        <p><b>Booking ID:</b> {booking.id}</p>
        <p><b>Items requested:</b> {location.state?.bookingCount || 1}</p>
        <p><b>Event date:</b> {location.state?.eventDate ? formatDate(location.state.eventDate) : "See event details"}</p>
        <p><b>Venue:</b> {location.state?.venue || `Event #${booking.event_id}`}</p>
        <p><b>Booking total:</b> {formatINR(booking.total_price)}</p>
        <p><b>Status:</b> {booking.status}</p>
      </div>
      <div className="details-actions center-actions">
        <Link to="/orders" className="btn">View My Bookings</Link>
        <Link to="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
