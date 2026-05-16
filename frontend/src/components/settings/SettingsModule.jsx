import React, { useState, useEffect } from "react";
import ProfileTab from "./ProfileTab";
import PasswordTab from "./PasswordTab";
import LoginHistoryTab from "./LoginHistoryTab";
import NotificationsTab from "./NotificationsTab";
import SocialMediaTab from "./SocialMediaTab";
import axios from "axios";

const SettingsModule = () => {
  const [tab, setTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "history", label: "Login History" },
    { id: "notifications", label: "Notifications" },
    { id: "social", label: "Social Media" },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">

      <div className="flex gap-6 border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 font-bold text-sm ${
              tab === t.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab />}
      {tab === "password" && <PasswordTab />}
      {tab === "history" && <LoginHistoryTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "social" && <SocialMediaTab />}
    </div>
  );
};

export default SettingsModule;