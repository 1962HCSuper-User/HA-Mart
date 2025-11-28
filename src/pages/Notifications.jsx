import React from "react";
import SectionCard from "./SectionCard";

const NotificationsSection = () => {
  const notifications = [
    { title: "Review request", detail: "Share feedback on Nervfit Orion S1.", time: "1h ago" },
    { title: "Price drop alert", detail: "Amazfit Bip 5 dropped ₹500.", time: "4h ago" },
    { title: "Security", detail: "New login from Chrome on Windows.", time: "Yesterday" },
  ];

  return (
    <SectionCard
      label="Notifications"
      title="Inbox"
      description="Stay on top of reminders and price alerts."
    >
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.title} className="notification-item">
            <div>
              <p className="list-title">{notification.title}</p>
              <p className="list-subtitle">{notification.detail}</p>
            </div>
            <span className="timeline-time">{notification.time}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

export default NotificationsSection;