import React from 'react';
import { PartyPopper } from 'lucide-react';

function SiteFooter({ go }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <button className="brand footer-brand" onClick={() => go('home')}>
          <span className="brand-mark"><PartyPopper size={22} /></span>
          <span>eventora<span className="brand-dot">.</span><small>EXPERIENCES, MADE EASY</small></span>
        </button>
        <p>Less scrolling. More living.</p>
        <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button>
      </div>
      <div className="footer-bottom">
        <span>© 2026 EVENTORA. MADE FOR MOMENTS.</span>
        <span>DISCOVER · CONNECT · EXPERIENCE</span>
        <span className="demo-note">DEMO PROJECT · NO REAL PAYMENTS</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
