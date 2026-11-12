import { useState } from "react";
import categories from "../data/categories";

// Shows a service-specific image when available, otherwise the category photo.
function EventArt({ service, className = "" }) {
  const [broken, setBroken] = useState(false);
  const category = categories.find((c) => c.slug === service.category);
  const [c1, c2] = category ? category.colors : ["#52656b", "#9d8064"];
  const image = service.image || category?.image;

  if (image && !broken) {
    return (
      <div className={`art ${className}`}>
        <img src={image} alt={`${service.name} event`} loading="lazy" onError={() => setBroken(true)} />
      </div>
    );
  }

  return (
    <div
      className={`art art-gradient ${className}`}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      role="img"
      aria-label={service.name}
    >
      <span className="art-dot art-dot-1" />
      <span className="art-dot art-dot-2" />
      <span className="art-fallback-label">{service.sub || "Event service"}</span>
    </div>
  );
}

export default EventArt;
