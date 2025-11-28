import React from "react";

const SectionCard = ({
  label,
  title,
  description,
  stats = [],
  actions = [],
  children,
}) => (
  <section className="profile-panel">
    <header className="section-heading">
      <div>
        <p className="panel-label">{label}</p>
        <h2 className="panel-title">{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
    </header>
    {stats.length > 0 && (
      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <h3 className="stat-value">{stat.value}</h3>
            {stat.tag && <span className="stat-tag">{stat.tag}</span>}
          </div>
        ))}
      </div>
    )}
    {children && <div className="section-body">{children}</div>}
    {actions.length > 0 && (
      <div className="section-actions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={action.variant === "secondary" ? "btn-secondary" : "btn-primary"}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    )}
  </section>
);

export default SectionCard;