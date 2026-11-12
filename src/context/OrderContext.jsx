import { createContext, useContext, useEffect, useState } from "react";
import { load, save } from "../utils/format";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => load("eventora_orders", []));
  const [enquiries, setEnquiries] = useState(() => load("eventora_enquiries", []));

  useEffect(() => save("eventora_orders", orders), [orders]);
  useEffect(() => save("eventora_enquiries", enquiries), [enquiries]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: "EVT" + Date.now().toString().slice(-7),
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = (id) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o)));

  const addEnquiry = (enquiry) => {
    setEnquiries((prev) => [{ ...enquiry, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder, enquiries, addEnquiry }}>
      {children}
    </OrderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
  return useContext(OrderContext);
}
