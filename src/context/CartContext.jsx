import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function mapCartItem(item) {
  return {
    id: item.id,
    catalogKey: `${item.item_type}-${item.package_id || item.service_listing_id}`,
    packageId: item.package_id,
    serviceListingId: item.service_listing_id,
    name: item.item_title,
    price: Number(item.unit_price),
    unit: item.price_unit.replaceAll("_", " "),
    quantity: item.quantity,
    min: 1,
    step: 1,
    image: "",
    sub: item.item_type === "package" ? "Packages" : "Services",
  };
}

export function CartProvider({ children }) {
  const { user, token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!token || user?.role !== "customer") {
      setCart([]);
      setSubtotal(0);
      return;
    }
    const result = await api.cart(token);
    setCart(result.items.map(mapCartItem));
    setSubtotal(Number(result.subtotal));
  }, [token, user]);

  useEffect(() => {
    let active = true;
    if (authLoading) return undefined;
    if (!user || user.role !== "customer") {
      setCart([]);
      setSubtotal(0);
      setError("");
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    api.cart(token).then((result) => {
      if (active) {
        setCart(result.items.map(mapCartItem));
        setSubtotal(Number(result.subtotal));
        setError("");
      }
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, token, user]);

  const addToCart = async (product) => {
    if (!user || user.role !== "customer") {
      throw new Error("Sign in with a customer account to add items to your cart.");
    }
    const existing = cart.find((item) => item.catalogKey === product.id);
    if (existing) {
      if (product.unit === "per event") return;
      await api.updateCartItem(token, existing.id, existing.quantity + 1);
    } else {
      await api.addCartItem(token, {
        package_id: product.packageId,
        service_listing_id: product.serviceListingId,
        quantity: 1,
      });
    }
    try {
      setError("");
      await refreshCart();
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.deleteCartItem(token, id);
      await refreshCart();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    try {
      await api.updateCartItem(token, id, quantity);
      await refreshCart();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(token);
      setCart([]);
      setSubtotal(0);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const cartCount = cart.length;
  const totals = useMemo(() => ({
    subtotal,
    discount: 0,
    gst: 0,
    total: subtotal,
  }), [subtotal]);

  return (
    <CartContext.Provider value={{
      cart, cartCount, totals, couponCode: "", error, loading, addToCart,
      removeFromCart, increaseQty: (id) => {
        const item = cart.find((entry) => entry.id === id);
        if (item && item.unit !== "per event") return updateQuantity(id, item.quantity + 1);
        return Promise.resolve();
      },
      decreaseQty: (id) => {
        const item = cart.find((entry) => entry.id === id);
        return item ? updateQuantity(id, item.quantity - 1) : Promise.resolve();
      },
      updateQuantity, clearCart, refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
