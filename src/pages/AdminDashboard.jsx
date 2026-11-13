import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatINR } from "../utils/format";

const sections = ["Overview", "Users", "Events", "Bookings", "Catalog", "Categories"];
const bookingStatuses = ["requested", "confirmed", "cancelled", "completed"];

function AdminDashboard() {
  const { token, user } = useAuth();
  const [section, setSection] = useState("Overview");
  const [data, setData] = useState({
    users: [], events: [], bookings: [], categories: [], packages: [], services: [],
  });
  const [categoryForm, setCategoryForm] = useState({ name: "", kind: "event", description: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setError("");
    try {
      const [users, events, bookings, categories, packages, services] = await Promise.all([
        api.users(token),
        api.events(token),
        api.bookings(token),
        api.categories("?limit=200"),
        api.packages(),
        api.services(),
      ]);
      setData({ users, events, bookings, categories, packages, services });
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const runAction = async (action, message) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      await refresh();
      setNotice(message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const updateEventStatus = (event, status) => runAction(
    () => api.updateEvent(token, event.id, {
      title: event.title,
      description: event.description,
      category_id: event.category_id,
      customer_id: event.customer_id,
      organizer_id: event.organizer_id,
      event_date: event.event_date,
      venue: event.venue,
      budget: event.budget,
      status,
    }),
    "Event status updated.",
  );

  const createCategory = (event) => {
    event.preventDefault();
    runAction(async () => {
      await api.createCategory(token, {
        ...categoryForm,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || null,
      });
      setCategoryForm({ name: "", kind: "event", description: "" });
    }, "Category created.");
  };

  const countCards = [
    { label: "Registered users", value: data.users.length },
    { label: "Events", value: data.events.length },
    { label: "Bookings", value: data.bookings.length },
    { label: "Packages", value: data.packages.length },
    { label: "Service listings", value: data.services.length },
    { label: "Categories", value: data.categories.length },
  ];

  return (
    <div className="page admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">EVENTORA CONTROL ROOM</p>
          <h1 className="page-title">Admin dashboard</h1>
          <p className="section-sub left">Manage accounts, event activity, bookings and categories.</p>
        </div>
        <span className="admin-identity">{user.full_name}<small>Administrator</small></span>
      </div>

      {error && <p className="error admin-alert" role="alert">{error}</p>}
      {notice && <p className="ok-text admin-alert" role="status">{notice}</p>}

      <div className="admin-stats">
        {countCards.map((card) => (
          <article className="admin-stat" key={card.label}>
            <span>{card.label}</span><strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {sections.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={section === item}
            className={section === item ? "active" : ""} onClick={() => setSection(item)}>
            {item}
          </button>
        ))}
      </div>

      {section === "Overview" && (
        <section className="admin-panel">
          <h2>Recent activity</h2>
          <p className="muted">Bookings are requests until confirmed by an administrator. Customers can cancel only requested bookings.</p>
          <div className="admin-activity">
            {data.bookings.slice(0, 5).map((booking) => (
              <div key={booking.id}>
                <span>Booking #{booking.id} · {booking.item_title}</span>
                <b className={`status ${booking.status}`}>{booking.status}</b>
              </div>
            ))}
            {data.bookings.length === 0 && <p className="empty-text">No bookings to review yet.</p>}
          </div>
        </section>
      )}

      {section === "Users" && (
        <section className="admin-panel">
          <h2>User accounts</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>State</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>{data.users.map((account) => (
                <tr key={account.id}>
                  <td>{account.full_name}</td><td>{account.email}</td>
                  <td>
                    <select aria-label={`Role for ${account.full_name}`} value={account.role} disabled={busy || account.id === user.id}
                      onChange={(event) => runAction(
                        () => api.updateUserRole(token, account.id, event.target.value),
                        "User role updated.",
                      )}>
                      {["customer", "organizer", "admin"].map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td>{account.is_active ? "Active" : "Inactive"}</td>
                  <td>{formatDate(account.created_at)}</td>
                  <td>
                    {account.id !== user.id && <button className="link-btn danger" disabled={busy}
                      onClick={() => window.confirm(`Delete ${account.full_name}?`) && runAction(
                        () => api.deleteUser(token, account.id),
                        "User deleted.",
                      )}>Delete</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {section === "Events" && (
        <section className="admin-panel">
          <h2>Customer events</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Event</th><th>Customer</th><th>Date</th><th>Venue</th><th>Budget</th><th>Status</th></tr></thead>
              <tbody>{data.events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}<small>Event #{event.id}</small></td>
                  <td>#{event.customer_id}</td><td>{formatDate(event.event_date)}</td>
                  <td>{event.venue}</td><td>{event.budget == null ? "—" : formatINR(event.budget)}</td>
                  <td><select aria-label={`Status for ${event.title}`} value={event.status} disabled={busy}
                    onChange={(change) => updateEventStatus(event, change.target.value)}>
                    {["planning", "confirmed", "cancelled", "completed"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select></td>
                </tr>
              ))}</tbody>
            </table>
            {data.events.length === 0 && <p className="empty-text">No events found.</p>}
          </div>
        </section>
      )}

      {section === "Bookings" && (
        <section className="admin-panel">
          <h2>Bookings</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Booking</th><th>Event</th><th>Customer</th><th>Organizer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{data.bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}<small>{booking.item_title}</small></td>
                  <td>#{booking.event_id}</td><td>#{booking.customer_id}</td><td>#{booking.organizer_id}</td>
                  <td>{formatINR(booking.total_price)}</td>
                  <td><select aria-label={`Status for booking ${booking.id}`} value={booking.status} disabled={busy}
                    onChange={(event) => runAction(
                      () => api.updateBookingStatus(token, booking.id, event.target.value),
                      "Booking status updated.",
                    )}>
                    {bookingStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select></td>
                </tr>
              ))}</tbody>
            </table>
            {data.bookings.length === 0 && <p className="empty-text">No bookings found.</p>}
          </div>
        </section>
      )}

      {section === "Catalog" && (
        <section className="admin-panel">
          <h2>Packages and service listings</h2>
          <p className="muted">Deactivate listings to remove them from the customer catalog without deleting their history.</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Listing</th><th>Type</th><th>Organizer</th><th>Price</th><th>State</th><th>Actions</th></tr></thead>
              <tbody>
                {[
                  ...data.packages.map((item) => ({ ...item, itemType: "package" })),
                  ...data.services.map((item) => ({ ...item, itemType: "service" })),
                ].map((item) => (
                  <tr key={`${item.itemType}-${item.id}`}>
                    <td>{item.title}<small>#{item.id}</small></td>
                    <td>{item.itemType}</td><td>#{item.organizer_id}</td>
                    <td>{formatINR(item.price)}<small>{item.price_unit.replaceAll("_", " ")}</small></td>
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <button className="link-btn" disabled={busy} onClick={() => runAction(
                        () => item.itemType === "package"
                          ? api.updatePackage(token, item.id, {
                            title: item.title, description: item.description,
                            organizer_id: item.organizer_id, event_category_ids: item.event_category_ids,
                            price: item.price, price_unit: item.price_unit, image_url: item.image_url,
                            badge: item.badge, max_guests: item.max_guests, included_items: item.included_items,
                            average_rating: item.average_rating, review_count: item.review_count,
                            is_active: !item.is_active,
                          })
                          : api.updateServiceListing(token, item.id, {
                            title: item.title, description: item.description,
                            category_id: item.category_id, event_category_ids: item.event_category_ids,
                            organizer_id: item.organizer_id, price: item.price, price_unit: item.price_unit,
                            image_url: item.image_url, is_active: !item.is_active,
                          }),
                        `Listing ${item.is_active ? "deactivated" : "activated"}.`,
                      )}>{item.is_active ? "Deactivate" : "Activate"}</button>
                      {" · "}
                      <button className="link-btn danger" disabled={busy} onClick={() => window.confirm(`Delete "${item.title}"?`) && runAction(
                        () => item.itemType === "package"
                          ? api.deletePackage(token, item.id)
                          : api.deleteServiceListing(token, item.id),
                        "Listing deleted.",
                      )}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.packages.length && !data.services.length && <p className="empty-text">No catalog listings found.</p>}
          </div>
        </section>
      )}

      {section === "Categories" && (
        <section className="admin-panel">
          <h2>Catalog categories</h2>
          <form className="admin-category-form" onSubmit={createCategory}>
            <label>Category name<input value={categoryForm.name} maxLength={100} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required /></label>
            <label>Category type<select value={categoryForm.kind} onChange={(event) => setCategoryForm({ ...categoryForm, kind: event.target.value })}>
              <option value="event">Event</option><option value="service">Service</option>
            </select></label>
            <label>Description<input value={categoryForm.description} maxLength={500} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></label>
            <button className="btn" type="submit" disabled={busy}>Add category</button>
          </form>
          <div className="admin-category-list">
            {data.categories.map((category) => (
              <div key={category.id}><span>{category.name}<small>{category.kind} · {category.is_active ? "active" : "inactive"}</small></span>
                <button className="link-btn danger" disabled={busy}
                  onClick={() => window.confirm(`Delete category "${category.name}"?`) && runAction(
                    () => api.deleteCategory(token, category.id),
                    "Category deleted.",
                  )}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
