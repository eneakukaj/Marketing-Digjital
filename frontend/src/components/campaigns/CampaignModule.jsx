import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import OverviewCard from "../security/OverviewCards";
import CampaignTab from "./CampaignTab";
import SchedulingTab from "./SchedulingTab";
import BudgetTab from "./BudgetTab";
import { AuthContext } from "../../context/AuthContext";
import MilestoneTab from "./MilestoneTab";

const CampaignModule = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [subTab, setSubTab] = useState("Overview");
  const { user } = useContext(AuthContext);

  const fetchCampaignsData = async () => {
    try {
      const res = await api.get("/manager/campaigns");

      if (Array.isArray(res.data)) {
        setCampaigns(res.data);
      } else {
        setCampaigns([]);
        console.error("API doesn't return array:", res.data);
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setCampaigns([]);
    }
  };

  useEffect(() => {
    fetchCampaignsData();
  }, []);

  const stats = [
    { title: "Total Campaigns", value: campaigns.length.toString() },

    {
      title: "Draft Campaigns",
      value: campaigns
        .filter((c) => c.statusi === "draft")
        .length.toString(),
    },

    {
      title: "Active Campaigns",
      value: campaigns
        .filter(
          (c) =>
            c.statusi === "active" || c.statusi === "aktiv"
        )
        .length.toString(),
    },

    {
      title: "Total Budget",
      value: campaigns
        .reduce((sum, c) => sum + Number(c.buxheti || 0), 0)
        .toString(),
    },
  ];

  const subMenus = [
    { id: "Overview", label: "All Campaigns" },
    { id: "Scheduling", label: "Scheduling" },
    { id: "Budgets", label: "Budgets" },
    { id: "Milestones", label: "Milestones" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <OverviewCard
            key={i}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <div className="flex border-b border-gray-200 gap-8 mb-6">
        {subMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setSubTab(menu.id)}
            className={`pb-4 text-sm font-bold transition-all ${
              subTab === menu.id
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {menu.label}
          </button>
        ))}
      </div>

      {subTab === "Overview" && (
        <CampaignTab
          campaigns={campaigns}
          refreshCampaigns={fetchCampaignsData}
        />
      )}

      {subTab === "Scheduling" && (
        <SchedulingTab campaigns={campaigns} />
      )}

      {subTab === "Budgets" && (
        <BudgetTab campaigns={campaigns} />
      )}

      {subTab === "Milestones" && (
        <MilestoneTab campaigns={campaigns} user={user} />
      )}
    </div>
  );
};

export default CampaignModule;