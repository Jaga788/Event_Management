import React from 'react';
import { ArrowRight, CalendarDays, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { money, prettyDate } from '../utils/formatters.js';

function CartDrawer({ cart, cartCount, cartTotal, setCart, setCartOpen, changeQty, checkout, go }) {
  return (
    <div className="drawer-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setCartOpen(false);
    }}>
      <aside className="cart-drawer">
        <div className="drawer-head">
          <div>
            <span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT PLANS</span>
            <h2>Your bag <span>({cartCount})</span></h2>
          </div>
          <button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button>
        </div>
        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=240&q=75`} alt="" />
                  <div className="cart-item-info">
                    <h3>{item.title}</h3>
                    <p><CalendarDays size={13} />{prettyDate(item.date)}</p>
                    <b>{money(item.price)}</b>
                    <div className="qty-control">
                      <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => setCart(previous => previous.filter(cartItem => cartItem.id !== item.id))}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><b>{money(cartTotal)}</b></div>
              <div><span>Service fee</span><b>{money(0)}</b></div>
              <div className="cart-grand-total"><span>Total</span><b>{money(cartTotal)}</b></div>
              <p><ShieldCheck size={15} /> Secure demo checkout · no payment taken</p>
              <button className="primary-button checkout-button" onClick={checkout}>
                Confirm booking <ArrowRight size={17} />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon"><ShoppingBag size={28} /></div>
            <h3>Your bag is taking a little break</h3>
            <p>Add a ticket for something you’re excited about.</p>
            <button className="primary-button" onClick={() => { setCartOpen(false); go('home'); }}>
              Explore events <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
