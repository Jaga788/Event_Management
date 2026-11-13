import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

function itemKey(favorite) {
  return `${favorite.item_type}-${favorite.package_id || favorite.service_listing_id}`;
}

export function WishlistProvider({ children }) {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  const refreshFavorites = useCallback(async () => {
    if (!token || user?.role !== "customer") {
      setFavorites([]);
      return;
    }
    setFavorites(await api.favorites(token));
  }, [token, user]);

  useEffect(() => {
    let active = true;
    if (!user || user.role !== "customer") {
      setFavorites([]);
      setError("");
      return undefined;
    }
    api.favorites(token).then((result) => {
      if (active) {
        setFavorites(result);
        setError("");
      }
    }).catch((requestError) => {
      if (active) setError(requestError.message);
    });
    return () => { active = false; };
  }, [token, user]);

  const toggleWishlist = async (id) => {
    if (!user || user.role !== "customer") {
      throw new Error("Sign in with a customer account to save services.");
    }
    const favorite = favorites.find((item) => itemKey(item) === id);
    if (favorite) await api.deleteFavorite(token, favorite.id);
    else {
      const [type, rawId] = id.split("-");
      await api.addFavorite(token, type === "package"
        ? { package_id: Number(rawId) }
        : { service_listing_id: Number(rawId) });
    }
    await refreshFavorites();
  };

  const wishlistIds = favorites.map(itemKey);
  const isWished = (id) => wishlistIds.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWished, error }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext);
}
