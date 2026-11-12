import ServiceCard from "./ServiceCard";

function ServiceGrid({ services, emptyText = "No services found. Try a different search or filter." }) {
  if (services.length === 0) {
    return <p className="empty-text">{emptyText}</p>;
  }
  return (
    <div className="service-grid">
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} />
      ))}
    </div>
  );
}

export default ServiceGrid;
