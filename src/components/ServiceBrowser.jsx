import { useMemo, useState } from "react";
import { subcategoryOrder } from "../data/services";
import ServiceGrid from "./ServiceGrid";

// Sub-category buttons + sort + price filter + the grid.
// Used by both the "All Services" page and each event category page.
function ServiceBrowser({ services }) {
  const [sub, setSub] = useState("All");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState("all");

  const subs = useMemo(
    () => ["All", ...subcategoryOrder.filter((s) => services.some((x) => x.sub === s))],
    [services]
  );

  const shown = useMemo(() => {
    let list = services.filter(
      (s) => (sub === "All" || s.sub === sub) && (maxPrice === "all" || s.price <= Number(maxPrice))
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [services, sub, sort, maxPrice]);

  return (
    <div>
      <div className="sub-buttons">
        {subs.map((s) => (
          <button key={s} className={s === sub ? "active" : ""} onClick={() => setSub(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <p>{shown.length} service{shown.length === 1 ? "" : "s"}</p>
        <div className="toolbar-controls">
          <label>
            Budget
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="all">Any</option>
              <option value="1000">Up to ₹1,000</option>
              <option value="10000">Up to ₹10,000</option>
              <option value="50000">Up to ₹50,000</option>
              <option value="150000">Up to ₹1,50,000</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>

      <ServiceGrid services={shown} />
    </div>
  );
}

export default ServiceBrowser;
