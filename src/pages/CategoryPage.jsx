import { Link, useParams } from "react-router-dom";
import categories from "../data/categories";
import services from "../data/services";
import ServiceBrowser from "../components/ServiceBrowser";
import NotFound from "./NotFound";

function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return <NotFound />;

  const list = services.filter((s) => s.category === slug);
  const [c1, c2] = category.colors;

  return (
    <div className="page">
      <div className="category-banner" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <span className="banner-emoji">{category.emoji}</span>
        <div>
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </div>
      <p className="breadcrumb"><Link to="/">Home</Link> / {category.name}</p>
      <ServiceBrowser key={slug} services={list} />
    </div>
  );
}

export default CategoryPage;
