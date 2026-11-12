import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import categories from "../data/categories";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>Eventora</h4>
          <p>Book decoration, catering, photography and full event packages for every family function — all in one place.</p>
        </div>
        <div>
          <h4>Events</h4>
          {categories.map((c) => (
            <Link key={c.slug} to={`/events/${c.slug}`}>{c.name}</Link>
          ))}
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/services">All Services</Link>
          <Link to="/plan">Plan My Event</Link>
          <Link to="/orders">My Bookings</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p className="footer-contact"><MapPin size={16} aria-hidden="true" /> Hyderabad, Telangana</p>
          <p className="footer-contact"><Phone size={16} aria-hidden="true" /> +91 98765 43210</p>
          <p className="footer-contact"><Mail size={16} aria-hidden="true" /> hello@eventora.example</p>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} Eventora. Demo project — no real payments are taken.</p>
    </footer>
  );
}

export default Footer;
