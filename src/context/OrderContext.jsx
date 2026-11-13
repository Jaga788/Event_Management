import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(user));

  const refreshOrders = useCallback(async () => {
    if (!token || !user) {
      setOrders([]);
      return [];
    }
    const result = await api.bookings(token);
    setOrders(result);
    return result;
  }, [token, user]);

  useEffect(() => {
    let active = true;
    if (!user) {
      setOrders([]);
      setError("");
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    api.bookings(token).then((result) => {
      if (active) {
        setOrders(result);
        setError("");
      }
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [token, user]);

  const cancelOrder = async (id) => {
    await api.updateBookingStatus(token, id, "cancelled");
    await refreshOrders();
  };

  const updateOrderStatus = async (id, status) => {
    await api.updateBookingStatus(token, id, status);
    await refreshOrders();
  };

  return (
    <OrderContext.Provider value={{ orders, cancelOrder, updateOrderStatus, refreshOrders, error, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
  return useContext(OrderContext);
}
