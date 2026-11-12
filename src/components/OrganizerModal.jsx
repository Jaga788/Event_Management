import React from 'react';
import { ArrowRight, X } from 'lucide-react';

function OrganizerModal({ setOrganizerOpen, createEvent }) {
  return (
    <div className="modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setOrganizerOpen(false);
    }}>
      <div className="organizer-modal">
        <button className="close-button modal-close" onClick={() => setOrganizerOpen(false)} aria-label="Close organizer form"><X /></button>
        <div className="eyebrow"><span className="eyebrow-dot" /> GIVE YOUR IDEA A PLACE</div>
        <h2>Let's make it <em>happen.</em></h2>
        <p>List a demo event and let people discover it. All fields are stored in this browser.</p>
        <form className="organizer-form" onSubmit={createEvent}>
          <label className="wide-label">Event name<input name="title" placeholder="e.g. Weekend pottery club" required maxLength="70" /></label>
          <label>Category<select name="category"><option>Music</option><option>Business</option><option>Art</option><option>Food</option><option>Fitness</option></select></label>
          <label>Ticket price (₹)<input name="price" type="number" min="0" max="50000" defaultValue="499" required /></label>
          <label>Date<input name="date" type="date" min="2026-10-27" required /></label>
          <label>Start time<input name="time" type="text" placeholder="e.g. 6:00 PM" required /></label>
          <label>City<input name="city" placeholder="Hyderabad" required /></label>
          <label>Venue<input name="venue" placeholder="Venue name" required /></label>
          <label>Available spots<input name="seats" type="number" min="1" max="10000" defaultValue="50" required /></label>
          <label className="wide-label">Short description<textarea name="description" placeholder="What will guests experience?" rows="3" /></label>
          <button className="primary-button full-button" type="submit">Publish demo event <ArrowRight size={17} /></button>
        </form>
      </div>
    </div>
  );
}

export default OrganizerModal;
