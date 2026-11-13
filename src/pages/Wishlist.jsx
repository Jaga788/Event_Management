import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ServiceGrid from "../components/ServiceGrid";
import useCatalog from "../hooks/useCatalog";

function Wishlist() {
  const { wishlistIds, error: wishlistError } = useWishlist();
  const { services, loading, error } = useCatalog();
  const saved = services.filter((s) => wishlistIds.includes(s.id));

  if (loading) return <div className="page empty-text" role="status">Loading your saved services…</div>;
  if (error || wishlistError) return <div className="page error" role="alert">Could not load saved services: {error || wishlistError}</div>;

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
