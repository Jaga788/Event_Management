import { useState } from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [c1, c2] = category.colors;
  return (
    <Link to={`/events/${category.slug}`} className="category-card">
      <div className="category-art" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        {!imageFailed && category.image ? (
          <img
            src={category.image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{category.name}</span>
        )}
      </div>
      <h3>{category.name}</h3>
      <p>{category.tagline}</p>
    </Link>
  );
}

export default CategoryCard;
