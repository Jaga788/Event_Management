import { Link, useParams } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatINR } from "../utils/format";

function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="page center">
        <h2>Booking not found</h2>
        <Link to="/orders" className="btn">Go to My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="page center success-page">
      <div className="success-icon">🎉</div>
      <h1>Booking Confirmed!</h1>
      <p>Thank you, {order.details.name}. Our team will call you within 24 hours to finalise the details.</p>
      <div className="success-box">
        <p><b>Booking ID:</b> {order.id}</p>
        <p><b>Event date:</b> {formatDate(order.details.eventDate)}</p>
        <p><b>Venue:</b> {order.details.venue}, {order.details.city}</p>
        <p><b>Total paid / payable:</b> {formatINR(order.totals.total)}</p>
      </div>
      <div className="details-actions center-actions">
        <Link to="/orders" className="btn">View My Bookings</Link>
        <Link to="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
