import React, { useEffect, useState } from "react";
import axios from "axios"; 
import OverviewCard from "../security/OverviewCards"; 
import ABTestingTab from "./ABTestingTab";
import FeedbackTab from "./FeedbackTab";

const ABTestingModule = () => {
  const [abTests, setABTests] = useState([]);      
  const [feedbacks, setFeedbacks] = useState([]);  
  const [campaigns, setCampaigns] = useState([]);
  const [subTab, setSubTab] = useState("ABTests");
  const [loading, setLoading] = useState(true);

  const fetchABData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Thirrjet në API për të marrë të dhënat live nga databaza
      const [resTests, resFeedback, resCampaigns] = await Promise.all([
        axios.get("http://localhost:3000/api/ab-tests", config).catch(() => ({ data: [] })),
        axios.get("http://localhost:3000/api/ab-feedbacks", config).catch(() => ({ data: [] })),
        axios.get("http://localhost:3000/api/manager/campaigns", config).catch(() => ({ data: [] }))
      ]);
      
      setABTests(Array.isArray(resTests.data) ? resTests.data : []);
      setFeedbacks(Array.isArray(resFeedback.data) ? resFeedback.data : []);
      setCampaigns(Array.isArray(resCampaigns.data) ? resCampaigns.data : []);

    } catch (err) {
      console.error("Failed to fetch A/B Testing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchABData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-400">Loading Module Data...</div>;
  }

  const totalTests = abTests.length;

  const subMenus = [
    { id: "ABTests", label: "A/B Testing Experiments" },
    { id: "Feedback", label: "User Feedback & Notes" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OverviewCard title="Total A/B Experiments" value={totalTests.toString()} />
        <OverviewCard title="Active Variants" value={totalTests.toString()} />
        <OverviewCard title="Tests Managed" value={totalTests.toString()} />
      </div>

      <div className="flex border-b border-gray-200 gap-8 mb-6">
        {subMenus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setSubTab(menu.id)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              subTab === menu.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {menu.label}
            {subTab === menu.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {subTab === "ABTests" && (
          <ABTestingTab
            abTests={abTests} 
            campaigns={campaigns} 
            refreshData={fetchABData} 
          />
        )}

        {subTab === "Feedback" && (
          <FeedbackTab
            feedbacks={feedbacks}
            abTests={abTests}
            refreshData={fetchABData}
          />
        )}
      </div>
    </div>
  );
};

export default ABTestingModule;