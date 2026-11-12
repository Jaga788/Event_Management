import React from 'react';
import { CalendarDays, Clock3, MapPin, ShoppingBag, Star, X } from 'lucide-react';
import { money, prettyDate } from '../utils/formatters.js';

function EventDetailsModal({ event, setSelectedEvent, addToCart, setCartOpen }) {
  return (
    <div className="modal-backdrop" onMouseDown={mouseEvent => {
      if (mouseEvent.target === mouseEvent.currentTarget) setSelectedEvent(null);
    }}>
      <div className="event-modal">
        <button className="close-button modal-close" onClick={() => setSelectedEvent(null)} aria-label="Close event"><X /></button>
        <div className="event-modal-image">
          <img src={`https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=1000&q=85`} alt={event.title} />
          <span className="event-tag">{event.tag}</span>
        </div>
        <div className="event-modal-content">
          <span className="eyebrow"><span className="eyebrow-dot" />{event.category.toUpperCase()} EXPERIENCE</span>
          <h2>{event.title}</h2>
          <p className="modal-description">{event.description}</p>
          <div className="modal-details">
            <span><CalendarDays size={17} />{prettyDate(event.date)}</span>
            <span><Clock3 size={17} />{event.time}</span>
            <span><MapPin size={17} />{event.venue}, {event.city}</span>
            <span><Star size={17} fill="currentColor" />{event.rating} guest rating</span>
          </div>
          <div className="modal-bottom">
            <div>
              <small>TICKETS FROM</small>
              <b>{money(event.price)}<small> / person</small></b>
              <span>{event.seats} spots left</span>
            </div>
            <button className="primary-button" onClick={() => {
              addToCart(event);
              setSelectedEvent(null);
              setCartOpen(true);
            }}>
              Add ticket <ShoppingBag size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;
