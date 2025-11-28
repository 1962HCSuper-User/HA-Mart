import React from "react";
import SectionCard from "./SectionCard";

const HistorySection = () => {
  const history = [
    { title: "Refund processed", detail: "₹1,499 credited to wallet", time: "Nov 20" },
    { title: "Order #8720 delivered", detail: "Signed by you", time: "Nov 17" },
    { title: "Password updated", detail: "Security action completed", time: "Nov 15" },
  ];

  return (
    <SectionCard
      label="History"
      title="Account Activity"
      description="A short audit trail from your recent actions."
    >
      <ul className="timeline">
        {history.map((entry) => (
          <li key={entry.title} className="timeline-item">
            <span className="timeline-dot" />
            <div className="timeline-content">
              <p className="timeline-title">{entry.title}</p>
              <p className="timeline-detail">{entry.detail}</p>
              <span className="timeline-time">{entry.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default HistorySection;