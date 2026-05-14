import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationsTab = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notifications/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnabled(res.data.notifications_enabled);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [token]);

  const handleToggle = async () => {
    try {
      const newValue = !enabled;
      const res = await axios.put(
        "http://localhost:3000/api/notifications/toggle",
        { enabled: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
      setEnabled(res.data.notifications_enabled);
    }
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    alert("Failed to update notification settings.");
  }
};

  if (loading) return <div className="text-sm text-slate-400">Loading settings...</div>;

  return (
    <div className="space-y-4 max-w-md animate-in fade-in duration-300">
      <div>
        <h3 className="text-base font-bold text-slate-800">In-App Notifications</h3>
        <p className="text-xs text-slate-400 mt-1">
          Manage your preferences for receiving system notifications.
        </p>
      </div>

      <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-4">
        <span className="text-sm font-bold text-slate-700">
          {enabled ? "Notifications Enabled" : "Notifications Disabled"}
        </span>
        
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
            enabled ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;