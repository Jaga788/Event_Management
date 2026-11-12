import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";
import EventArt from "../components/EventArt";

function Cart() {
  const {
    cart, totals, couponCode, removeFromCart, increaseQty, decreaseQty, applyCoupon, removeCoupon,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="page center empty-page">
        <h2>Your cart is empty 🛒</h2>
        <p>Add decoration, catering or a full package to get started.</p>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  const handleCoupon = (e) => {
    e.preventDefault();
    setMsg(applyCoupon(code));
    setCode("");
  };

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <EventArt service={item} className="cart-art" />
              <div className="cart-info">
                <Link to={`/service/${item.id}`}><h4>{item.name}</h4></Link>
                <p>{formatINR(item.price)} {item.unit}</p>
              </div>
              <div className="qty">
                <button onClick={() => decreaseQty(item.id)} aria-label="Decrease">−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)} aria-label="Increase">+</button>
              </div>
              <p className="line-total">{formatINR(item.price * item.quantity)}</p>
              <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>

          <form className="coupon" onSubmit={handleCoupon}>
            <input
              placeholder="Coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Coupon code"
            />
            <button className="btn btn-small" type="submit" disabled={!code.trim()}>Apply</button>
          </form>
          {msg && <p className={msg.success ? "ok-text" : "error"}>{msg.message}</p>}
          {couponCode && (
            <p className="coupon-applied">
              <b>{couponCode}</b> applied <button className="link-btn" onClick={removeCoupon}>remove</button>
            </p>
          )}
          <p className="hint">Try EVENT10 or WELCOME500</p>

          <div className="row"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          {totals.discount > 0 && (
            <div className="row green"><span>Discount</span><span>− {formatINR(totals.discount)}</span></div>
          )}
          <div className="row"><span>GST (18%)</span><span>{formatINR(totals.gst)}</span></div>
          <div className="row total"><span>Total</span><span>{formatINR(totals.total)}</span></div>

          <button
            className="btn full"
            onClick={() => navigate(user ? "/checkout" : "/login", { state: { from: "/checkout" } })}
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
          <Link to="/services" className="continue">← Continue browsing</Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
