import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import useCatalog from "../hooks/useCatalog";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { formatINR, tomorrowISO } from "../utils/format";

function Checkout() {
  const { user, token } = useAuth();
  const { cart, totals, refreshCart } = useCart();
  const { refreshOrders } = useOrders();
  const { categories, loading: catalogLoading, error: catalogError } = useCatalog();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventType: "", eventDate: "", city: "", venue: "", guests: "", notes: "", phone: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!form.eventType && categories.length) {
      const selectedId = cart.find((item) => item.eventCategoryId)?.eventCategoryId;
      setForm((current) => ({ ...current, eventType: String(selectedId || categories[0].id) }));
    }
  }, [categories, cart, form.eventType]);

  if (cart.length === 0) return <Navigate to="/cart" replace />;
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Enter a valid 10-digit Indian mobile number.");
    if (!form.eventDate || form.eventDate < tomorrowISO()) return setError("Choose an event date from tomorrow onwards.");
    if (Number(form.guests) < 1) return setError("Enter the approximate number of guests.");
    if (!form.eventType) return setError("Choose an event category.");

    setBusy(true);
    try {
      const selectedCategory = categories.find((category) => category.id === Number(form.eventType));
      const createdEvent = await api.createEvent(token, {
        title: `${selectedCategory.name} event`,
        description: [
          `Contact: ${form.phone}`,
          `City: ${form.city}`,
          `Approximate guests: ${form.guests}`,
          form.notes.trim(),
        ].filter(Boolean).join("\n"),
        category_id: Number(form.eventType),
        event_date: new Date(`${form.eventDate}T12:00:00`).toISOString(),
        venue: `${form.venue}, ${form.city}`,
        budget: null,
      });
      const bookings = await api.checkout(token, createdEvent.id);
      await Promise.all([refreshOrders(), refreshCart()]);
      navigate(`/order-success/${bookings[0].id}`, {
        replace: true,
        state: { bookingCount: bookings.length, eventDate: form.eventDate, venue: form.venue },
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to place this booking.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Plan your booking</h1>
      <p className="section-sub left">Your event will be created first, then each cart item will be sent as a booking request.</p>
      {(catalogError || error) && <p className="error" role="alert">{error || catalogError}</p>}
      <div className="cart-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h3>Event details</h3>
          <div className="form-grid">
            <label>Event type
              <select name="eventType" value={form.eventType} onChange={update} required disabled={catalogLoading}>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label>Event date
              <input type="date" name="eventDate" min={tomorrowISO()} value={form.eventDate} onChange={update} required />
            </label>
            <label>City
              <input name="city" value={form.city} onChange={update} required />
            </label>
            <label>Approx. guests
              <input type="number" min="1" name="guests" value={form.guests} onChange={update} required />
            </label>
            <label className="span2">Venue / address
              <input name="venue" value={form.venue} onChange={update} required />
            </label>
            <label className="span2">Contact mobile
              <input name="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={update} required />
            </label>
            <label className="span2">Special requests (optional)
              <textarea name="notes" rows="3" value={form.notes} onChange={update} />
            </label>
          </div>
          <p className="hint">Signed in as {user.full_name} ({user.email}). Payment is handled separately; the backend records booking requests and status.</p>
          <button className="btn full" type="submit" disabled={busy || catalogLoading || categories.length === 0}>
            {busy ? "Submitting…" : `Submit booking request · ${formatINR(totals.total)}`}
          </button>
        </form>

        <aside className="summary">
          <h3>Your items</h3>
          {cart.map((item) => (
            <div key={item.id} className="row small">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
          <hr />
          <div className="row total"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          <Link to="/cart" className="continue">← Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
