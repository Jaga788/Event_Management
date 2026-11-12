import { useState } from "react";
import categories from "../data/categories";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { tomorrowISO } from "../utils/format";

function PlanEvent() {
  const { user } = useAuth();
  const { addEnquiry } = useOrders();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", phone: "", eventType: "wedding", date: "", budget: "", message: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    addEnquiry(form);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="page center success-page">
        <div className="success-icon">✅</div>
        <h1>Request received!</h1>
        <p>Thanks {form.name}. Our event planner will contact you on {form.phone} with a custom quote.</p>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1 className="page-title">Plan My Event</h1>
      <p className="section-sub left">Tell us what you need and get a custom quote within 24 hours.</p>
      <form className="checkout-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Your name
            <input name="name" value={form.name} onChange={update} required />
          </label>
          <label>Mobile number
            <input name="phone" value={form.phone} onChange={update} pattern="[6-9][0-9]{9}" maxLength={10} placeholder="9876543210" required />
          </label>
          <label>Event type
            <select name="eventType" value={form.eventType} onChange={update}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>Tentative date
            <input type="date" name="date" min={tomorrowISO()} value={form.date} onChange={update} required />
          </label>
          <label className="span2">Budget (₹, approx.)
            <input type="number" min="0" name="budget" value={form.budget} onChange={update} placeholder="e.g. 200000" />
          </label>
          <label className="span2">What do you need?
            <textarea name="message" rows="4" value={form.message} onChange={update} placeholder="Guests, venue, theme, services needed..." required />
          </label>
        </div>
        <button className="btn full" type="submit">Request a Quote</button>
      </form>
    </div>
  );
}

export default PlanEvent;
