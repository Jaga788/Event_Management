import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, Heart, Search, ShoppingBag } from "lucide-react";
import categories from "../data/categories";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function Header() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistIds } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/services?q=${encodeURIComponent(q)}` : "/services");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="top-bar">
        <Link to="/" className="brand" aria-label="Eventora home">
          <span className="brand-mark">E</span>
          <span className="brand-text">
            Eventora
            <small>Event Management</small>
          </span>
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search wedding decor, catering, photography..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Search services"
          />
          <button type="submit"><Search size={16} aria-hidden="true" /> Search</button>
        </form>

        <div className="header-actions">
          <NavLink to="/wishlist" className="action-link" title="Wishlist">
            <Heart size={17} aria-hidden="true" /> <span className="action-label">Saved</span>
            {wishlistIds.length > 0 && <b className="count">{wishlistIds.length}</b>}
          </NavLink>
          <NavLink to="/cart" className="action-link" title="Cart">
            <ShoppingBag size={17} aria-hidden="true" /> <span className="action-label">Cart</span>
            {cartCount > 0 && <b className="count">{cartCount}</b>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" className="action-link"><CalendarDays size={16} aria-hidden="true" /> My Bookings</NavLink>
              <span className="user-name">Hi, {user.name.split(" ")[0]}</span>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-small">Login</NavLink>
          )}
        </div>
      </div>

      <nav className="main-nav" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/services">All Services</NavLink>
        {categories.map((c) => (
          <NavLink key={c.slug} to={`/events/${c.slug}`}>{c.name}</NavLink>
        ))}
        <NavLink to="/plan" className="nav-cta">Plan My Event</NavLink>
      </nav>
    </header>
  );
}

export default Header;
