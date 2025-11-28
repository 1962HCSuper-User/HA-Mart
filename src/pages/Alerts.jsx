import React from "react";
import SectionCard from "./SectionCard";

const AlertsSection = () => {
  const alerts = [
    { title: "Payment verification pending", detail: "Update payment method to avoid delays.", level: "warning" },
    { title: "Invoice ready", detail: "Your invoice for order #8821 is available.", level: "info" },
  ];

  return (
    <SectionCard
      label="Alerts"
      title="Critical Alerts"
      description="We’ll keep you posted about important account actions."
    >
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.title} className={`alert-item ${alert.level}`}>
            <div>
              <p className="alert-title">{alert.title}</p>
              <p className="alert-detail">{alert.detail}</p>
            </div>
            <span className="pill">{alert.level === "warning" ? "Action needed" : "Info"}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default AlertsSection;