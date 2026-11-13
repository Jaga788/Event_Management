import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useCatalog from "../hooks/useCatalog";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";
import EventArt from "../components/EventArt";
import ServiceGrid from "../components/ServiceGrid";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const { categories, services, loading, error } = useCatalog();
  const [actionError, setActionError] = useState("");

  const service = services.find((s) => s.id === id);
  if (loading) return <div className="page empty-text" role="status">Loading service details…</div>;
  if (error) return <div className="page error" role="alert">Could not load the catalog: {error}</div>;
  if (!service) {
    return (
      <div className="page center">
        <h2>Service not found</h2>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === service.category);
  const related = services
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 4);
  const wished = isWished(service.id);
  const ensureCustomer = () => {
    if (user?.role === "customer") return true;
    if (!user) navigate("/login", { state: { from: location.pathname } });
    else setActionError("Booking and saved services are available to customer accounts.");
    return false;
  };
  const addItem = async (goToCart = false) => {
    setActionError("");
    if (!ensureCustomer()) return;
    try {
      await addToCart(service);
      if (goToCart) navigate("/cart");
    } catch (requestError) { setActionError(requestError.message); }
  };
  const saveItem = async () => {
    setActionError("");
    if (!ensureCustomer()) return;
    try { await toggleWishlist(service.id); } catch (requestError) { setActionError(requestError.message); }
  };

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / {category ? <Link to={`/events/${category.slug}`}>{category.name}</Link> : "Services"} / {service.name}
      </p>

      <div className="details">
        <EventArt service={service} className="details-art" />

        <div className="details-info">
          {service.tag && <span className="badge static">{service.tag}</span>}
          <h1>{service.name}</h1>
          {service.rating > 0 && <p className="rating">★ {service.rating} <span>({service.reviews} reviews)</span></p>}
          <p className="price big">
            {formatINR(service.price)} <small>{service.unit}</small>
          </p>
          <p className="desc">{service.desc}</p>

          <ul className="meta">
            {category && <li>🎊 {category.name}</li>}
            <li>🏷️ {service.sub}</li>
            {service.guests && <li>👥 {service.guests}</li>}
            {service.min > 1 && <li>📦 Minimum {service.min} {service.unit.replace("per ", "")}s</li>}
          </ul>

          <h3>What's included</h3>
          <ul className="includes">
            {service.includes.map((item) => (
              <li key={item}>✔ {item}</li>
            ))}
          </ul>

          <div className="details-actions">
            <button className="btn" onClick={() => addItem()}>Add to Cart</button>
            <button className="btn btn-outline" onClick={() => addItem(true)}>
              Book Now
            </button>
            <button className={`btn btn-ghost ${wished ? "on" : ""}`} onClick={saveItem}>
              {wished ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
          {actionError && <p className="error" role="alert">{actionError}</p>}
          <p className="note">Booking requests are sent to the organizer for confirmation; payment is handled separately.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">More {category ? `for your ${category.name.toLowerCase()}` : "services"}</h2>
          <ServiceGrid services={related} />
        </section>
      )}
    </div>
  );
}

export default ServiceDetails;
