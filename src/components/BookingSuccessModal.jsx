import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { money } from '../utils/formatters.js';

function BookingSuccessModal({ booking, setCheckoutDone }) {
  return (
    <div className="modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setCheckoutDone(null);
    }}>
      <div className="success-modal">
        <div className="success-icon"><CheckCircle2 size={38} /></div>
        <div className="eyebrow centered"><span className="eyebrow-dot" /> IT'S OFFICIALLY A PLAN</div>
        <h2>You're all booked<span>.</span></h2>
        <p>Your demo booking is confirmed. Your next memory is on the calendar.</p>
        <div className="success-order">
          <span>BOOKING REFERENCE</span>
          <b>{booking.id}</b>
          <div><span>Total</span><b>{money(booking.total)}</b></div>
        </div>
        <button className="primary-button full-button" onClick={() => setCheckoutDone(null)}>
          Lovely, thanks! <Sparkles size={16} />
        </button>
        <small>No real payment was processed.</small>
      </div>
    </div>
  );
}

export default BookingSuccessModal;
