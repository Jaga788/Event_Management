import { createContext, useContext, useEffect, useMemo, useState } from "react";
import coupons from "../data/coupons";
import { GST_RATE, load, save } from "../utils/format";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => load("eventora_cart", []));
  const [couponCode, setCouponCode] = useState(() => load("eventora_coupon", ""));

  useEffect(() => save("eventora_cart", cart), [cart]);
  useEffect(() => save("eventora_coupon", couponCode), [couponCode]);

  // Add a service. First add uses the service's minimum quantity (e.g. 50 plates).
  const addToCart = (service) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === service.id);
      if (exists) {
        return prev.map((i) => (i.id === service.id ? { ...i, quantity: i.quantity + i.step } : i));
      }
      return [
        ...prev,
        {
          id: service.id, name: service.name, price: service.price, unit: service.unit,
          emoji: service.emoji, category: service.category, image: service.image,
          step: service.step, min: service.min, quantity: service.min,
        },
      ];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const increaseQty = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + i.step } : i)));

  // Going below the minimum removes the item (like Glow Crush's cart).
  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - i.step } : i))
        .filter((i) => i.quantity >= i.min)
    );

  const clearCart = () => {
    setCart([]);
    setCouponCode("");
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (!coupons[clean]) return { success: false, message: "Invalid coupon code" };
    setCouponCode(clean);
    return { success: true, message: `Coupon applied: ${coupons[clean].label}` };
  };

  const removeCoupon = () => setCouponCode("");

  const cartCount = cart.length; // number of different services in the cart

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const coupon = coupons[couponCode];
    let discount = 0;
    if (coupon && subtotal > 0) {
      discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : Math.min(coupon.value, subtotal);
    }
    const taxable = subtotal - discount;
    const gst = taxable * GST_RATE;
    return { subtotal, discount, gst, total: taxable + gst };
  }, [cart, couponCode]);

  return (
    <CartContext.Provider
      value={{
        cart, cartCount, totals, couponCode,
        addToCart, removeFromCart, increaseQty, decreaseQty, clearCart,
        applyCoupon, removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
