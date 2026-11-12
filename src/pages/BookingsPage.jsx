import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Ticket } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import { money, prettyDate } from '../utils/formatters.js';

function BookingsPage({ bookings, go }) {
  return (
    <main className="page-content section-wrap">
      <PageHeading
        eyebrow="YOUR PLANS, ALL IN ONE PLACE"
        title="My bookings"
        subtitle="The moments you've said yes to."
      />
      <div className="booking-list">
        {bookings.map(order => (
          <article className="booking-card" key={order.id}>
            <div className="booking-check"><CheckCircle2 size={25} /></div>
            <div className="booking-main">
              <div className="booking-meta">BOOKING #{order.id} · {new Date(order.date).toLocaleDateString('en-IN')}</div>
              <h3>{order.items.map(item => item.title).join(', ')}</h3>
              <p>{order.items.reduce((sum, item) => sum + item.qty, 0)} ticket(s) · {order.items.map(item => prettyDate(item.date)).join(', ')}</p>
              <div className="ticket-code"><Ticket size={15} /> DEMO TICKET CONFIRMED</div>
            </div>
            <div className="booking-total"><small>TOTAL PAID (DEMO)</small><b>{money(order.total)}</b></div>
          </article>
        ))}
        {!bookings.length && (
          <div className="empty-state">
            <CalendarDays size={32} />
            <h3>Your next adventure awaits</h3>
            <p>Your confirmed bookings will show up here after checkout.</p>
            <button className="primary-button" onClick={() => go('home')}>Find an event <ArrowRight size={16} /></button>
          </div>
        )}
      </div>
    </main>
  );
}

export default BookingsPage;
