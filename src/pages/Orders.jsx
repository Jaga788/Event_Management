import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatINR } from "../utils/format";

function Orders() {
  const { user } = useAuth();
  const { orders, cancelOrder, updateOrderStatus, error, loading } = useOrders();
  const [actionError, setActionError] = useState("");
  const title = user.role === "customer" ? "My Bookings" : "Bookings";

  if (loading) return <div className="page empty-text" role="status">Loading bookings…</div>;
  if (error || actionError) return <div className="page error" role="alert">Could not load bookings: {actionError || error}</div>;
  if (orders.length === 0) {
    return (
      <div className="page center empty-page">
        <h2>No bookings yet</h2>
        <p>Booking requests will appear here.</p>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  const cancel = async (id) => {
    setActionError("");
    try { await cancelOrder(id); } catch (requestError) { setActionError(requestError.message); }
  };
  const updateStatus = async (id, status) => {
    setActionError("");
    try { await updateOrderStatus(id, status); } catch (requestError) { setActionError(requestError.message); }
  };

  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <div className="orders">
        {orders.map((booking) => (
          <div key={booking.id} className="order-card">
            <div className="order-head">
              <div>
                <h3>{booking.item_title}</h3>
                <p className="muted">Booking #{booking.id} · Event #{booking.event_id} · {formatDate(booking.created_at)}</p>
              </div>
              <span className={`status ${booking.status}`}>{booking.status}</span>
            </div>
            <ul><li>{booking.quantity} × {booking.price_unit.replaceAll("_", " ")}<span>{formatINR(booking.total_price)}</span></li></ul>
            <div className="order-foot">
              <p className="muted">Organizer #{booking.organizer_id}</p>
              <p className="order-total">Total {formatINR(booking.total_price)}</p>
            </div>
            {user.role === "customer" && booking.status === "requested" && (
              <button className="link-btn danger" onClick={() => window.confirm("Cancel this booking request?") && cancel(booking.id)}>
                Cancel request
              </button>
            )}
            {user.role === "organizer" && booking.status === "requested" && (
              <div className="booking-actions">
                <button className="btn btn-small" onClick={() => updateStatus(booking.id, "confirmed")}>Confirm</button>
                <button className="btn btn-small btn-ghost" onClick={() => updateStatus(booking.id, "cancelled")}>Decline</button>
              </div>
            )}
            {user.role === "organizer" && booking.status === "confirmed" && (
              <div className="booking-actions">
                <button className="btn btn-small" onClick={() => updateStatus(booking.id, "completed")}>Mark completed</button>
                <button className="btn btn-small btn-ghost" onClick={() => updateStatus(booking.id, "cancelled")}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
