import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";
import EventArt from "./EventArt";

function ServiceCard({ service }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const wished = isWished(service.id);

  const requireCustomer = () => {
    if (user?.role === "customer") return true;
    if (!user) navigate("/login", { state: { from: location.pathname } });
    else setError("Cart and saved services are available to customer accounts.");
    return false;
  };
  const saveItem = async () => {
    setError("");
    if (!requireCustomer()) return;
    try { await toggleWishlist(service.id); } catch (requestError) { setError(requestError.message); }
  };
  const addItem = async () => {
    setError("");
    if (!requireCustomer()) return;
    try { await addToCart(service); } catch (requestError) { setError(requestError.message); }
  };

  return (
    <article className="service-card">
      <div className="card-media">
        <Link to={`/service/${service.id}`} aria-label={`View ${service.name}`}>
          <EventArt service={service} />
        </Link>
        {service.tag && <span className="badge">{service.tag}</span>}
        <button
          className={`heart ${wished ? "on" : ""}`}
          onClick={saveItem}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          title={wished ? "Remove from wishlist" : "Save to wishlist"}
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <p className="card-sub">{service.sub}</p>
        <Link to={`/service/${service.id}`}>
          <h3>{service.name}</h3>
        </Link>
        {service.rating > 0 && <p className="rating">★ {service.rating} <span>({service.reviews})</span></p>}
        <div className="card-bottom">
          <p className="price">
            {formatINR(service.price)} <small>{service.unit}</small>
          </p>
          <button className="btn btn-small" onClick={addItem}>
            Add to Cart
          </button>
        </div>
        {error && <p className="error card-error" role="alert">{error}</p>}
        {service.min > 1 && <p className="min-note">Minimum {service.min} {service.unit.replace("per ", "")}s</p>}
      </div>
    </article>
  );
}

export default ServiceCard;
