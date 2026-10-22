function StatCard({ className = "", label, icon: Icon, children }) {
  return (
    <article className={`stat-card ${className}`}>
      <h3 className="card-label">
        {Icon && <Icon size={15} strokeWidth={1.8} aria-hidden="true" />}
        {label}
      </h3>
      {children}
    </article>
  );
}

export default StatCard;
