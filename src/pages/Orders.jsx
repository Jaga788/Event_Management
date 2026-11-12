import { Link } from "react-router-dom";
import categories from "../data/categories";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { formatDate, formatINR } from "../utils/format";

function Orders() {
  const { user } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const mine = orders.filter((o) => o.userEmail === user.email);

  if (mine.length === 0) {
    return (
      <div className="page center empty-page">
        <h2>No bookings yet</h2>
        <p>Your confirmed events will show up here.</p>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">My Bookings</h1>
      <div className="orders">
        {mine.map((o) => {
          const cat = categories.find((c) => c.slug === o.details.eventType);
          return (
            <div key={o.id} className="order-card">
              <div className="order-head">
                <div>
                  <h3>{cat?.emoji} {cat?.name} — {formatDate(o.details.eventDate)}</h3>
                  <p className="muted">Booking {o.id} • placed on {formatDate(o.createdAt)}</p>
                </div>
                <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
              <ul>
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.emoji} {i.name} × {i.quantity}
                    <span>{formatINR(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="order-foot">
                <p className="muted">
                  📍 {o.details.venue}, {o.details.city} • 👥 {o.details.guests} guests • 💳 {o.details.payment}
                </p>
                <p className="order-total">Total {formatINR(o.totals.total)}</p>
              </div>
              {o.status === "Confirmed" && (
                <button
                  className="link-btn danger"
                  onClick={() => window.confirm("Cancel this booking?") && cancelOrder(o.id)}
                >
                  Cancel booking
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
