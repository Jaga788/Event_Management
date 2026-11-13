import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import ServiceBrowser from "../components/ServiceBrowser";

function Services() {
  const { categories, services, loading, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const cat = params.get("cat") || "all";

  const matches = useMemo(() => {
    const text = q.toLowerCase();
    return services.filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        (!text || `${s.name} ${s.sub} ${s.desc} ${s.category}`.toLowerCase().includes(text))
    );
  }, [q, cat]);

  const setCat = (value) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete("cat");
    else next.set("cat", value);
    setParams(next);
  };

  return (
    <div className="page">
      <h1 className="page-title">{q ? `Search results for “${q}”` : "All Services"}</h1>
      {loading && <p className="empty-text" role="status">Loading the latest packages and services…</p>}
      {error && <p className="error" role="alert">Could not load the catalog: {error}</p>}

      <div className="chips">
        <button className={cat === "all" ? "active" : ""} onClick={() => setCat("all")}>All events</button>
        {categories.map((c) => (
          <button key={c.slug} className={cat === c.slug ? "active" : ""} onClick={() => setCat(c.slug)}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* key resets the sub-category/sort filters when the event type or search changes */}
      {!loading && !error && <ServiceBrowser key={`${cat}-${q}`} services={matches} />}
    </div>
  );
}

export default Services;
