import React from 'react';
import { CalendarDays, Heart, MapPin, ShoppingBag, Star } from 'lucide-react';
import { money, prettyDate } from '../utils/formatters.js';

function EventCard({ event, index, wished, onWish, onDetails, onAdd }) {
  return (
    <article className="event-card" style={{ '--card-index': index }}>
      <button className="event-image-button" onClick={onDetails} aria-label={`View ${event.title}`}>
        <img
          className="event-image"
          src={`https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=900&q=80`}
          alt={event.title}
          loading="lazy"
        />
        <span className={`event-tag tag-${event.color}`}>{event.tag}</span>
        <span className="image-date"><CalendarDays size={13} />{prettyDate(event.date)}</span>
      </button>
      <button
        className={`wish-button ${wished ? 'wished' : ''}`}
        onClick={onWish}
        aria-label={wished ? 'Remove saved event' : 'Save event'}
      >
        <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
      </button>
      <div className="event-card-content">
        <div className="event-card-meta">
          <span>{event.category}</span>
          <span className="rating"><Star size={13} fill="currentColor" />{event.rating}</span>
        </div>
        <button className="event-title-button" onClick={onDetails}><h3>{event.title}</h3></button>
        <div className="event-location"><MapPin size={14} /><span>{event.venue}, {event.city}</span></div>
        <div className="event-card-bottom">
          <div className="price-block">
            <small>STARTING AT</small>
            <b>{money(event.price)}<span> / person</span></b>
          </div>
          <button className="add-ticket-button" onClick={onAdd} aria-label={`Add ticket for ${event.title}`}>
            <ShoppingBag size={15} />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
