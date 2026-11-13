import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import useCatalog from "../hooks/useCatalog";
import { tomorrowISO } from "../utils/format";

function PlanEvent() {
  const { user, token } = useAuth();
  const { categories, loading, error: catalogError } = useCatalog();
  const [form, setForm] = useState({
    categoryId: "", phone: "", date: "", budget: "", venue: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!form.categoryId && categories.length) {
      setForm((current) => ({ ...current, categoryId: String(categories[0].id) }));
    }
  }, [categories, form.categoryId]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Enter a valid 10-digit mobile number.");
    setBusy(true);
    const category = categories.find((item) => item.id === Number(form.categoryId));
    try {
      await api.createEvent(token, {
        title: `${category.name} event`,
        description: [`Contact: ${form.phone}`, form.message.trim()].filter(Boolean).join("\n"),
        category_id: Number(form.categoryId),
        event_date: new Date(`${form.date}T12:00:00`).toISOString(),
        venue: form.venue.trim(),
        budget: form.budget ? Number(form.budget) : null,
      });
      setSent(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="page center success-page">
        <div className="success-icon">✓</div>
        <h1>Event request created</h1>
        <p>Your event is now in planning. Browse packages and services, add them to your cart, and check out to create booking requests.</p>
        <Link className="btn" to="/services">Browse services</Link>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1 className="page-title">Plan My Event</h1>
      <p className="section-sub left">Create an event under your account using the event planning API.</p>
      {(error || catalogError) && <p className="error" role="alert">{error || catalogError}</p>}
      <form className="checkout-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Your name<input value={user.full_name} readOnly /></label>
          <label>Mobile number
            <input name="phone" value={form.phone} onChange={update} pattern="[6-9][0-9]{9}" maxLength={10} placeholder="9876543210" required />
          </label>
          <label>Event type
            <select name="categoryId" value={form.categoryId} onChange={update} required disabled={loading}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label>Tentative date
            <input type="date" name="date" min={tomorrowISO()} value={form.date} onChange={update} required />
          </label>
          <label className="span2">Venue / address
            <input name="venue" value={form.venue} onChange={update} required />
          </label>
          <label className="span2">Budget (₹, approx.)
            <input type="number" min="0" name="budget" value={form.budget} onChange={update} placeholder="e.g. 200000" />
          </label>
          <label className="span2">What do you need?
            <textarea name="message" rows="4" value={form.message} onChange={update} placeholder="Guests, theme, services needed…" />
          </label>
        </div>
        <button className="btn full" type="submit" disabled={busy || loading || categories.length === 0}>
          {busy ? "Creating event…" : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default PlanEvent;
