import React from 'react';
import { ArrowRight, Heart, LogOut, Menu, PartyPopper, ShoppingBag, Sparkles, X } from 'lucide-react';

function SiteHeader({
  page,
  go,
  wishlistCount,
  cartCount,
  setCartOpen,
  user,
  setUser,
  notify,
  setAuthMode,
  setAuthOpen,
  mobileOpen,
  setMobileOpen,
  setOrganizerOpen,
}) {
  return (
    <>
      <div className="announcement">
        <Sparkles size={14} /> Make room for memorable moments
        <span>Discover something new this week</span>
        <ArrowRight size={14} />
      </div>
      <header className="header">
        <button className="brand" onClick={() => go('home')} aria-label="Eventora home">
          <span className="brand-mark"><PartyPopper size={22} /></span>
          <span>eventora<span className="brand-dot">.</span><small>EXPERIENCES, MADE EASY</small></span>
        </button>
        <nav className={`nav ${mobileOpen ? 'nav-open' : ''}`}>
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => go('home')}>Home</button>
          <button className={page === 'bookings' ? 'nav-link active' : 'nav-link'} onClick={() => go('bookings')}>My bookings</button>
          <button className={page === 'saved' ? 'nav-link active' : 'nav-link'} onClick={() => go('saved')}>Saved events</button>
          <button className="nav-link organizer-link" onClick={() => setOrganizerOpen(true)}>
            Host an event <ArrowRight size={14} />
          </button>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Saved events" onClick={() => go('saved')}>
            <Heart size={19} />
            {wishlistCount > 0 && <i className="tiny-count">{wishlistCount}</i>}
          </button>
          <button className="bag-button" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} /><span>My bag</span><b>{cartCount}</b>
          </button>
          {user ? (
            <button
              className="profile-button"
              onClick={() => { setUser(null); notify('You have signed out'); }}
              title="Sign out"
            >
              <span className="avatar">{user.name[0]}</span><LogOut size={15} />
            </button>
          ) : (
            <button className="sign-in" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Sign in</button>
          )}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}

export default SiteHeader;
