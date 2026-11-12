import React from 'react';
import { ArrowRight, Mail, PartyPopper, ShieldCheck, X } from 'lucide-react';

function AuthModal({ authMode, setAuthMode, setAuthOpen, login }) {
  return (
    <div className="modal-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setAuthOpen(false);
    }}>
      <div className="auth-modal">
        <button className="close-button modal-close" onClick={() => setAuthOpen(false)} aria-label="Close sign in"><X /></button>
        <div className="auth-icon"><PartyPopper size={28} /></div>
        <div className="eyebrow centered"><span className="eyebrow-dot" /> YOU'RE ON THE LIST</div>
        <h2>{authMode === 'login' ? 'Welcome back.' : 'Come on in.'}</h2>
        <p>{authMode === 'login' ? 'Sign in to keep your plans in one place.' : 'Create a demo account and start collecting moments.'}</p>
        <form onSubmit={login} className="auth-form">
          <label>
            Email address
            <div className="input-with-icon">
              <Mail size={17} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                defaultValue={authMode === 'login' ? 'demo@eventora.com' : ''}
                required
              />
            </div>
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="At least 4 characters"
              defaultValue={authMode === 'login' ? 'event123' : ''}
              minLength="4"
              required
            />
          </label>
          <button className="primary-button full-button" type="submit">
            {authMode === 'login' ? 'Sign in' : 'Create demo account'} <ArrowRight size={16} />
          </button>
        </form>
        <div className="demo-login"><ShieldCheck size={15} /> Demo login: demo@eventora.com / event123</div>
        <p className="auth-switch">
          {authMode === 'login' ? 'New to Eventora?' : 'Already have an account?'}
          {' '}
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
        <small className="auth-disclaimer">Demo only — credentials are stored in this browser, not securely authenticated.</small>
      </div>
    </div>
  );
}

export default AuthModal;
