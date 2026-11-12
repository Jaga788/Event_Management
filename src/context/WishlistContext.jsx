import { createContext, useContext, useEffect, useState } from "react";
import { load, save } from "../utils/format";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => load("eventora_wishlist", []));

  useEffect(() => save("eventora_wishlist", ids), [ids]);

  const toggleWishlist = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isWished = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlistIds: ids, toggleWishlist, isWished }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext);
}
