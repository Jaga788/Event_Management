import { Link, useParams } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import ServiceBrowser from "../components/ServiceBrowser";
import NotFound from "./NotFound";

function CategoryPage() {
  const { slug } = useParams();
  const { categories, services, loading, error } = useCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (loading) return <div className="page empty-text" role="status">Loading this occasion…</div>;
  if (error) return <div className="page error" role="alert">Could not load the catalog: {error}</div>;
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
