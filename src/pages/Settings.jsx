import React from "react";
import SectionCard from "./SectionCard";

const SettingsSection = () => {
  const settings = [
    {
      title: "Two-factor authentication",
      detail: "Protect your account with OTP verification.",
      enabled: true,
    },
    {
      title: "Marketing emails",
      detail: "Receive curated offers and updates.",
      enabled: false,
    },
    {
      title: "Push notifications",
      detail: "Mobile and browser notifications.",
      enabled: true,
    },
  ];

  return (
    <SectionCard
      label="Settings"
      title="Preferences"
      description="Control the experience to match your workflow."
    >
      <div className="toggle-list">
        {settings.map((pref) => (
          <label key={pref.title} className="toggle-row">
            <div>
              <p className="list-title">{pref.title}</p>
              <p className="list-subtitle">{pref.detail}</p>
            </div>
            <input type="checkbox" defaultChecked={pref.enabled} />
          </label>
        ))}
      </div>
    </SectionCard>
  );
};

export default SettingsSection;