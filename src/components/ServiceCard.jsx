import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatINR } from "../utils/format";
import EventArt from "./EventArt";

function ServiceCard({ service }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const wished = isWished(service.id);

  return (
    <article className="service-card">
      <div className="card-media">
        <Link to={`/service/${service.id}`} aria-label={`View ${service.name}`}>
          <EventArt service={service} />
        </Link>
        {service.tag && <span className="badge">{service.tag}</span>}
        <button
          className={`heart ${wished ? "on" : ""}`}
          onClick={() => toggleWishlist(service.id)}
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
        <p className="rating">★ {service.rating} <span>({service.reviews})</span></p>
        <div className="card-bottom">
          <p className="price">
            {formatINR(service.price)} <small>{service.unit}</small>
          </p>
          <button className="btn btn-small" onClick={() => addToCart(service)}>
            Add to Cart
          </button>
        </div>
        {service.min > 1 && <p className="min-note">Minimum {service.min} {service.unit.replace("per ", "")}s</p>}
      </div>
    </article>
  );
}

export default ServiceCard;
