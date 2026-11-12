import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import categories from "../data/categories";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { formatINR, tomorrowISO } from "../utils/format";

const payments = [
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Credit / Debit Card" },
  { value: "Pay Later", label: "Pay advance at venue visit" },
];

function Checkout() {
  const { user } = useAuth();
  const { cart, totals, couponCode, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    eventType: categories.find((c) => c.slug === cart[0]?.category)?.slug || "wedding",
    eventDate: "",
    city: "",
    venue: "",
    guests: "",
    notes: "",
    payment: "UPI",
  });
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  // Nothing to check out -> go to cart (unless we just placed the order)
  if (cart.length === 0) return placed ? null : <Navigate to="/cart" replace />;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return setError("Enter a valid 10-digit Indian mobile number");
    }
    if (!form.eventDate || form.eventDate < tomorrowISO()) {
      return setError("Please choose an event date from tomorrow onwards");
    }
    if (Number(form.guests) < 1) {
      return setError("Enter the approximate number of guests");
    }

    const order = addOrder({
      userEmail: user.email,
      items: cart,
      totals,
      coupon: couponCode,
      details: form,
    });
    // "placed" stops the empty-cart redirect above while we move to the success page
    setPlaced(true);
    navigate(`/order-success/${order.id}`, { replace: true });
    clearCart();
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Contact details</h3>
          <div className="form-grid">
            <label>Full name
              <input name="name" value={form.name} onChange={update} required />
            </label>
            <label>Mobile number
              <input name="phone" value={form.phone} onChange={update} inputMode="numeric" maxLength={10} placeholder="9876543210" required />
            </label>
            <label className="span2">Email
              <input type="email" name="email" value={form.email} onChange={update} required />
            </label>
          </div>

          <h3>Event details</h3>
          <div className="form-grid">
            <label>Event type
              <select name="eventType" value={form.eventType} onChange={update}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>Event date
              <input type="date" name="eventDate" min={tomorrowISO()} value={form.eventDate} onChange={update} required />
            </label>
            <label>City
              <input name="city" value={form.city} onChange={update} placeholder="Hyderabad" required />
            </label>
            <label>Approx. guests
              <input type="number" min="1" name="guests" value={form.guests} onChange={update} required />
            </label>
            <label className="span2">Venue / address
              <input name="venue" value={form.venue} onChange={update} placeholder="Function hall name or home address" required />
            </label>
            <label className="span2">Special requests (optional)
              <textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Theme, colours, rituals, dietary needs..." />
            </label>
          </div>

          <h3>Payment method</h3>
          <div className="radio-group">
            {payments.map((p) => (
              <label key={p.value} className={form.payment === p.value ? "selected" : ""}>
                <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={update} />
                {p.label}
              </label>
            ))}
          </div>
          <p className="hint">Demo only — no real payment is processed.</p>

          {error && <p className="error">{error}</p>}
          <button className="btn full" type="submit">Confirm Booking • {formatINR(totals.total)}</button>
        </form>

        <aside className="summary">
          <h3>Your items</h3>
          {cart.map((i) => (
            <div key={i.id} className="row small">
              <span>{i.emoji} {i.name} × {i.quantity}</span>
              <span>{formatINR(i.price * i.quantity)}</span>
            </div>
          ))}
          <hr />
          <div className="row"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          {totals.discount > 0 && (
            <div className="row green"><span>Discount {couponCode && `(${couponCode})`}</span><span>− {formatINR(totals.discount)}</span></div>
          )}
          <div className="row"><span>GST (18%)</span><span>{formatINR(totals.gst)}</span></div>
          <div className="row total"><span>Total</span><span>{formatINR(totals.total)}</span></div>
          <Link to="/cart" className="continue">← Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
