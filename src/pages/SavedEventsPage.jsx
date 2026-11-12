import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import PageHeading from '../components/PageHeading.jsx';

function SavedEventsPage({ events, wishlist, toggleWish, setSelectedEvent, addToCart, go }) {
  const savedEvents = events.filter(event => wishlist.includes(event.id));

  return (
    <main className="page-content section-wrap">
      <PageHeading
        eyebrow="YOUR LITTLE COLLECTION"
        title="Saved events"
        subtitle="All the things you might want to say yes to."
      />
      <div className="events-grid">
        {savedEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
            wished
            onWish={() => toggleWish(event.id)}
            onDetails={() => setSelectedEvent(event)}
            onAdd={() => addToCart(event)}
          />
        ))}
      </div>
      {!wishlist.length && (
        <div className="empty-state">
          <Heart size={30} />
          <h3>Keep the good ones close</h3>
          <p>Tap the heart on an event to save it here for later.</p>
          <button className="primary-button" onClick={() => go('home')}>Discover events <ArrowRight size={16} /></button>
        </div>
      )}
    </main>
  );
}

export default SavedEventsPage;
