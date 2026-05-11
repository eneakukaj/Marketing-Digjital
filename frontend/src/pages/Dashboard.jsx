import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SecurityModule from "../components/security/SecurityModule";
import CampaignModule from "../components/campaigns/CampaignModule";
import ContentModule from "../components/content/ContentModule";
import SettingsModule from "../components/settings/SettingsModule";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const mainNav = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Campaigns", label: "Campaigns" },
    { id: "Content", label: "Content" },
    { id: "Audience", label: "Audience" },
    { id: "Analytics", label: "Analytics" },
    { id: "Budget", label: "Budget" },
  ];
    return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-[#1e293b]">
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full">
        <div className="p-8">
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

      <main className="flex-1 ml-64 min-h-screen">

        <header className="bg-white/80 backdrop-blur-md border-b px-10 py-6">
          <h1 className="text-2xl font-black uppercase">
            {activeTab}
          </h1>
        </header>

        <div className="p-10">

          {activeTab === "Dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Active Campaigns" value="12" />
              <StatCard title="Total Spend" value="$33,400" />
              <StatCard title="Leads" value="1,842" />
              <StatCard title="ROI" value="240%" />
            </div>
          )}

          {activeTab === "Campaigns" && <CampaignModule />}
          {activeTab === "Content" && <ContentModule />}
          {activeTab === "Security" && <SecurityModule />}
          {activeTab === "Settings" && <SettingsModule />}

          {!["Dashboard","Campaigns","Content","Security","Settings"].includes(activeTab) && (
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