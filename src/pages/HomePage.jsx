import React from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Heart,
  PartyPopper,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Ticket,
  Zap,
  ChevronDown,
  X,
} from 'lucide-react';
import { categories } from '../data/events.js';
import EventCard from '../components/EventCard.jsx';

function HomePage({
  events,
  filteredEvents,
  
  category,
  setCategory,
  query,
  setQuery,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  wishlist,
  toggleWish,
  setSelectedEvent,
  addToCart,
  setOrganizerOpen,
}) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT GREAT STORY STARTS HERE</div>
          <h1>Good things<br />happen <em>when</em><br />we get together<span className="headline-dot">.</span></h1>
          <p>From live music to new ideas, find the events that make your days a little more extraordinary.</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore events <ArrowRight size={17} />
            </button>
            <button className="text-button" onClick={() => setOrganizerOpen(true)}>
              I'm hosting an event <ArrowRight size={15} />
            </button>
          </div>
          <div className="social-proof">
            <div className="avatar-stack"><span>R</span><span>A</span><span>M</span><span>S</span></div>
            <div><div className="stars">★★★★★ <b>4.9/5</b></div><small>Loved by 12,000+ event seekers</small></div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85" alt="Crowd enjoying a live music event" />
          </div>
          <div className="photo-overlay" />
          <div className="floating-card event-float">
            <span className="float-icon"><CalendarCheck size={20} /></span>
            <div><b>Something exciting</b><small>is happening near you</small></div>
            <span className="live-dot" />
          </div>
          <div className="floating-card ticket-float">
            <div className="mini-ticket"><Ticket size={22} /></div>
            <div><b>Your next memory</b><small>is one ticket away</small></div>
          </div>
          <div className="hero-sticker"><Sparkles size={18} /><span>GO MAKE<br />A MEMORY</span></div>
          <div className="hero-image-label"><span>01 / 08</span><div className="label-line" /><span>LIVE A LITTLE</span></div>
        </div>
        <div className="hero-bottom-note"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
      </section>

      <section className="trust-strip">
        <div><ShieldCheck size={21} /><span><b>Secure checkout</b><small>Your details stay yours</small></span></div>
        <div><Zap size={21} /><span><b>Instant confirmation</b><small>Tickets in a few clicks</small></span></div>
        <div><Heart size={21} /><span><b>Experiences you'll love</b><small>Picked for curious people</small></span></div>
        <div><Star size={21} /><span><b>Real community</b><small>Meet your kind of people</small></span></div>
      </section>

      <section className="discover-section section-wrap" id="discover">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> FIND YOUR PEOPLE</div>
            <h2>What's your <em>kind</em> of fun?</h2>
            <p>Good plans are closer than you think.</p>
          </div>
          <div className="event-count">
            <b>{filteredEvents.length.toString().padStart(2, '0')}</b>
            <span>EVENTS TO EXPLORE</span>
          </div>
        </div>
        <div className="category-row">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`category-pill ${category === name ? 'selected' : ''}`}
              onClick={() => setCategory(name)}
            >
              <Icon size={17} />{name}
            </button>
          ))}
        </div>
        <div className="search-filter-row">
          <label className="search-box">
            <Search size={19} />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search events, places, or experiences..." />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <label className="filter-select">
            <SlidersHorizontal size={17} />
            <select value={maxPrice} onChange={event => setMaxPrice(event.target.value)}>
              <option value="all">Any price</option>
              <option value="500">Under ₹500</option>
              <option value="800">Under ₹800</option>
              <option value="1200">Under ₹1,200</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="filter-select sort-select">
            <select value={sort} onChange={event => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="date">Date: soonest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
        <div className="events-grid">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              wished={wishlist.includes(event.id)}
              onWish={() => toggleWish(event.id)}
              onDetails={() => setSelectedEvent(event)}
              onAdd={() => addToCart(event)}
            />
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <div className="empty-state">
            <Search size={30} />
            <h3>No events found</h3>
            <p>Try another search or remove a filter to see more experiences.</p>
            <button className="primary-button" onClick={() => { setQuery(''); setCategory('All Events'); setMaxPrice('all'); }}>
              Clear filters
            </button>
          </div>
        )}
        <div className="browse-footer">
          <span>SHOWING {filteredEvents.length} OF {events.length} EXPERIENCES</span>
          <span className="browse-line" />
          <span>YOUR NEXT STORY IS WAITING <Sparkles size={14} /></span>
        </div>
      </section>

      <section className="host-banner section-wrap">
        <div className="host-graphic">
          <div className="host-circle circle-one" />
          <div className="host-circle circle-two" />
          <PartyPopper size={64} />
          <span className="host-spark">✳</span>
        </div>
        <div className="host-copy">
          <div className="eyebrow light"><span className="eyebrow-dot" /> FOR THE PEOPLE WHO MAKE IT HAPPEN</div>
          <h2>Have a good thing<br />planned? <em>Let's share it.</em></h2>
          <p>Bring your community together. Create an event listing and let the right people find you.</p>
          <button className="cream-button" onClick={() => setOrganizerOpen(true)}>List your event <ArrowRight size={17} /></button>
        </div>
        <div className="host-number">02<span>/02</span></div>
      </section>
    </main>
  );
}

export default HomePage;
