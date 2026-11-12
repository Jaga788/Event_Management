import { Link } from "react-router-dom";
import services from "../data/services";
import { useWishlist } from "../context/WishlistContext";
import ServiceGrid from "../components/ServiceGrid";

function Wishlist() {
  const { wishlistIds } = useWishlist();
  const saved = services.filter((s) => wishlistIds.includes(s.id));

  if (saved.length === 0) {
    return (
      <div className="page center empty-page">
        <h2>No saved services yet ♡</h2>
        <p>Tap the heart on any service to save it for later.</p>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Saved Services</h1>
      <ServiceGrid services={saved} />
    </div>
  );
}

export default Wishlist;
