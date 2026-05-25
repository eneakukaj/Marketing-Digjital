import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import SecurityModule from "../components/security/SecurityModule";
import CampaignModule from "../components/campaigns/CampaignModule";
import ContentModule from "../components/content/ContentModule";
import ChannelModule from "../components/channels/ChannelModule";
import SettingsModule from "../components/settings/SettingsModule";
import AudienceModule from "../components/audience/AudienceModule";
import AnalyticsModule from "../components/analytics/AnalyticsModule";
import ABTestingModule from "../components/ABTesting/ABTestingModule";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import axios from "axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const userRolesList = user?.userroles || [];

  const isAdmin = userRolesList.some(item => 
    item?.role?.normalized_name === "ADMIN" || 
    item?.role?.emertimi?.toUpperCase() === "ADMIN"
  );

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem("accessToken");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read_status: true } : n)
      );
    } catch (err) {
      console.error("Error mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_status).length;

  const mainNav = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Campaigns", label: "Campaigns" },
    { id: "Content", label: "Content" },
    { id: "Channels", label: "Channels" },
    { id: "Audience", label: "Audience" },
    { id: "Analytics", label: "Analytics" },
    { id: "A/B Testing", label: "A/B Testing" },
  ];
    return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-50">
        <div className="p-6">
          <h2 className="text-2xl font-black tracking-tighter">
            AdVantage
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="mt-10 pt-4 border-t border-white/5 space-y-2">
          {isAdmin && (
            <button
              onClick={() => setActiveTab("Security")}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === "Security"
                  ? "bg-white text-indigo-900"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              Users & Auth
            </button>
          )}

            <button
              onClick={() => setActiveTab("Settings")}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold ${
                activeTab === "Settings"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              Settings
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold uppercase">
            {user?.emri?.[0] || "E"}
          </div>
          <div className="text-xs font-bold text-gray-400">
            {user?.emri || "User"}
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen relative z-10 pb-24">

        <header className="bg-white/80 backdrop-blur-md border-b px-10 py-6 flex justify-between items-center relative">
          <h1 className="text-2xl font-black uppercase">
            {activeTab}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
            >
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new notifications
                  </span>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.read_status && handleMarkAsRead(n.id)}
                        className={`p-3 rounded-xl text-xs transition-all cursor-pointer ${
                          n.read_status
                            ? "bg-slate-50 text-slate-400 opacity-85"
                            : "bg-indigo-50/60 text-slate-800 hover:bg-indigo-50 border-l-4 border-indigo-600 font-bold"
                        }`}
                      >
                        <p>{n.message}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-8">

          {activeTab === "Dashboard" && <DashboardOverview/>}
          {activeTab === "Campaigns" && <CampaignModule />}
          {activeTab === "Content" && <ContentModule />}
          {activeTab === "Channels" && <ChannelModule/>}
          {activeTab === "Audience" && <AudienceModule />}
          {activeTab === "Security" && isAdmin && <SecurityModule />}
          {activeTab === "Settings" && <SettingsModule />}
          {activeTab === "Analytics" && <AnalyticsModule />}
          {activeTab === "A/B Testing" && <ABTestingModule />}

          {!["Dashboard","Campaigns","Content","Channels", "Audience","Analytics","Security","Settings", "A/B Testing"].includes(activeTab) && (
            <div className="bg-white p-20 text-center rounded-2xl">
              Module {activeTab} coming soon
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-3xl border shadow-sm">
    <p className="text-xs font-bold text-gray-400">{title}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

export default Dashboard;