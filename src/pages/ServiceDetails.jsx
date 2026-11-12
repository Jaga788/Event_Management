import { Link, useNavigate, useParams } from "react-router-dom";
import categories from "../data/categories";
import services from "../data/services";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatINR } from "../utils/format";
import EventArt from "../components/EventArt";
import ServiceGrid from "../components/ServiceGrid";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  const service = services.find((s) => s.id === Number(id));
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

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/events/${category.slug}`}>{category.name}</Link> / {service.name}
      </p>

      <div className="details">
        <EventArt service={service} className="details-art" />

        <div className="details-info">
          {service.tag && <span className="badge static">{service.tag}</span>}
          <h1>{service.name}</h1>
          <p className="rating">★ {service.rating} <span>({service.reviews} reviews)</span></p>
          <p className="price big">
            {formatINR(service.price)} <small>{service.unit}</small>
          </p>
          <p className="desc">{service.desc}</p>

          <ul className="meta">
            <li>🎊 {category.name}</li>
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
            <button className="btn" onClick={() => addToCart(service)}>Add to Cart</button>
            <button
              className="btn btn-outline"
              onClick={() => {
                addToCart(service);
                navigate("/cart");
              }}
            >
              Book Now
            </button>
            <button className={`btn btn-ghost ${wished ? "on" : ""}`} onClick={() => toggleWishlist(service.id)}>
              {wished ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
          <p className="note">GST (18%) is added at checkout. Event date is chosen during booking.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">More for your {category.name.toLowerCase()}</h2>
          <ServiceGrid services={related} />
        </section>
      )}
    </div>
  );
}

export default ServiceDetails;
