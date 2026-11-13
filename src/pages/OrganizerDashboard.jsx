import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";

const initialProduct = {
  title: "", description: "", price: "", price_unit: "per_event",
  image_url: "", event_category_ids: [], included_items: "",
};

function OrganizerDashboard() {
  const { user, token } = useAuth();
  const [eventCategories, setEventCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [listings, setListings] = useState([]);
  const [packageForm, setPackageForm] = useState(initialProduct);
  const [serviceForm, setServiceForm] = useState({ ...initialProduct, category_id: "" });
  const [tab, setTab] = useState("packages");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [events, serviceTypes, allPackages, allListings] = await Promise.all([
        api.categories("?kind=event&limit=200"),
        api.categories("?kind=service&limit=200"),
        api.packages(),
        api.services(),
      ]);
      setEventCategories(events.filter((item) => item.is_active));
      setServiceCategories(serviceTypes.filter((item) => item.is_active));
      setPackages(allPackages.filter((item) => item.organizer_id === user.id));
      setListings(allListings.filter((item) => item.organizer_id === user.id));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, [user.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleEventCategory = (setter, form, id) => {
    const categoryIds = form.event_category_ids.includes(id)
      ? form.event_category_ids.filter((categoryId) => categoryId !== id)
      : [...form.event_category_ids, id];
    setter({ ...form, event_category_ids: categoryIds });
  };

  const submitPackage = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.createPackage(token, {
        title: packageForm.title.trim(),
        description: packageForm.description.trim(),
        organizer_id: user.id,
        event_category_ids: packageForm.event_category_ids,
        price: Number(packageForm.price),
        price_unit: packageForm.price_unit,
        image_url: packageForm.image_url.trim() || null,
        included_items: packageForm.included_items.split("\n").map((item) => item.trim()).filter(Boolean),
      });
      setPackageForm(initialProduct);
      setNotice("Package listed successfully.");
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const submitService = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.createService(token, {
        title: serviceForm.title.trim(),
        description: serviceForm.description.trim() || null,
        category_id: Number(serviceForm.category_id),
        event_category_ids: serviceForm.event_category_ids,
        organizer_id: user.id,
        price: Number(serviceForm.price),
        price_unit: serviceForm.price_unit,
        image_url: serviceForm.image_url.trim() || null,
      });
      setServiceForm({ ...initialProduct, category_id: "" });
      setNotice("Service listed successfully.");
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const renderEventCategories = (form, setter) => (
    <fieldset className="organizer-category-options">
      <legend>Available for event types</legend>
      {eventCategories.map((category) => (
        <label key={category.id}>
          <input type="checkbox" checked={form.event_category_ids.includes(category.id)}
            onChange={() => toggleEventCategory(setter, form, category.id)} />
          {category.name}
        </label>
      ))}
    </fieldset>
  );

  return (
    <div className="page admin-page">
      <div className="admin-heading">
        <div><p className="eyebrow">ORGANIZER WORKSPACE</p><h1 className="page-title">Your catalog</h1>
          <p className="section-sub left">Create packages and service listings tied to your organizer account.</p></div>
        <span className="admin-identity">{user.full_name}<small>Organizer</small></span>
      </div>
      {error && <p className="error admin-alert" role="alert">{error}</p>}
      {notice && <p className="ok-text admin-alert" role="status">{notice}</p>}
      <div className="admin-stats">
        <article className="admin-stat"><span>Your packages</span><strong>{packages.length}</strong></article>
        <article className="admin-stat"><span>Your service listings</span><strong>{listings.length}</strong></article>
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Catalog item type">
        <button type="button" className={tab === "packages" ? "active" : ""} onClick={() => setTab("packages")}>Packages</button>
        <button type="button" className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>Services</button>
      </div>

      {tab === "packages" ? (
        <section className="admin-panel">
          <h2>Create a package</h2>
          <form className="organizer-form" onSubmit={submitPackage}>
            <label>Package title<input value={packageForm.title} maxLength={150} onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })} required /></label>
            <label>Description<textarea value={packageForm.description} maxLength={5000} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })} required /></label>
            <div className="form-grid">
              <label>Price (₹)<input type="number" min="0" step="0.01" value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} required /></label>
              <label>Price unit<select value={packageForm.price_unit} onChange={(e) => setPackageForm({ ...packageForm, price_unit: e.target.value })}>
                <option value="per_event">Per event</option><option value="per_person">Per person</option><option value="per_plate">Per plate</option>
              </select></label>
              <label className="span2">Image URL (optional)<input type="url" maxLength={2048} value={packageForm.image_url} onChange={(e) => setPackageForm({ ...packageForm, image_url: e.target.value })} /></label>
              <label className="span2">Included items (one per line)<textarea value={packageForm.included_items} onChange={(e) => setPackageForm({ ...packageForm, included_items: e.target.value })} /></label>
            </div>
            {renderEventCategories(packageForm, setPackageForm)}
            <button className="btn" type="submit" disabled={busy}>{busy ? "Publishing…" : "Publish package"}</button>
          </form>
        </section>
      ) : (
        <section className="admin-panel">
          <h2>Create a service listing</h2>
          <form className="organizer-form" onSubmit={submitService}>
            <label>Service title<input value={serviceForm.title} maxLength={150} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required /></label>
            <label>Description<textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /></label>
            <div className="form-grid">
              <label>Service category<select value={serviceForm.category_id} onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })} required>
                <option value="">Choose a category</option>{serviceCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select></label>
              <label>Price (₹)<input type="number" min="0" step="0.01" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} required /></label>
              <label>Price unit<select value={serviceForm.price_unit} onChange={(e) => setServiceForm({ ...serviceForm, price_unit: e.target.value })}>
                <option value="per_event">Per event</option><option value="per_person">Per person</option><option value="per_plate">Per plate</option>
              </select></label>
              <label>Image URL (optional)<input type="url" maxLength={2048} value={serviceForm.image_url} onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })} /></label>
            </div>
            {renderEventCategories(serviceForm, setServiceForm)}
            <button className="btn" type="submit" disabled={busy}>{busy ? "Publishing…" : "Publish service"}</button>
          </form>
        </section>
      )}

      <section className="admin-panel organizer-list-panel">
        <h2>Your active listings</h2>
        {[...packages.map((item) => ({ ...item, kind: "Package" })), ...listings.map((item) => ({ ...item, kind: "Service" }))].map((item) => (
          <div className="admin-listing-row" key={`${item.kind}-${item.id}`}>
            <span><b>{item.title}</b><small>{item.kind} · {item.is_active ? "Active" : "Inactive"}</small></span>
            <strong>{formatINR(item.price)} <small>{item.price_unit.replaceAll("_", " ")}</small></strong>
          </div>
        ))}
        {!packages.length && !listings.length && <p className="empty-text">You have not published any listings yet.</p>}
      </section>
    </div>
  );
}

export default OrganizerDashboard;
