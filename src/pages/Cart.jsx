import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/format";
import EventArt from "../components/EventArt";

function Cart() {
  const {
    cart, totals, removeFromCart, increaseQty, decreaseQty, error, loading,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState("");
  const runAction = async (action) => {
    setActionError("");
    try { await action(); } catch (requestError) { setActionError(requestError.message); }
  };
  if (loading) return <div className="page empty-text" role="status">Loading your cart…</div>;
  if (cart.length === 0) {
    return (
      <div className="page center empty-page">
        {(error || actionError) && <p className="error" role="alert">{actionError || error}</p>}
        <h2>Your cart is empty 🛒</h2>
        <p>Add decoration, catering or a full package to get started.</p>
        <Link to="/services" className="btn">Browse services</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      {(error || actionError) && <p className="error" role="alert">{actionError || error}</p>}
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <EventArt service={item} className="cart-art" />
              <div className="cart-info">
                <Link to={`/service/${item.catalogKey}`}><h4>{item.name}</h4></Link>
                <p>{formatINR(item.price)} {item.unit}</p>
              </div>
              <div className="qty">
                <button onClick={() => runAction(() => decreaseQty(item.id))} aria-label="Decrease" disabled={item.unit === "per event"}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => runAction(() => increaseQty(item.id))} aria-label="Increase" disabled={item.unit === "per event"}>+</button>
              </div>
              <p className="line-total">{formatINR(item.price * item.quantity)}</p>
              <button className="remove" onClick={() => runAction(() => removeFromCart(item.id))}>Remove</button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>
          <div className="row"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          <div className="row total"><span>Total</span><span>{formatINR(totals.total)}</span></div>
          <p className="hint">Final booking amounts are calculated from the selected services.</p>

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
