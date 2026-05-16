import React, { useEffect, useState } from "react";
import api from "../../api/axios"; 
import OverviewCard from "../security/OverviewCards"; 
import ABTestingTab from "./ABTestingTab";
import FeedbackTab from "./FeedbackTab";

const ABTestingModule = () => {
  const [abTests, setABTests] = useState([]);      
  const [feedbacks, setFeedbacks] = useState([]);  
  const [campaigns, setCampaigns] = useState([]);
  const [subTab, setSubTab] = useState("ABTests");

  const fetchABData = async () => {
    try {
      
      const resTests = await api.get("/ab-tests"); 
      const resFeedback = await api.get("/ab-feedbacks"); 
      const resCampaigns = await api.get("/manager/campaigns");
      
      setABTests(Array.isArray(resTests.data) ? resTests.data : []);
      setFeedbacks(Array.isArray(resFeedback.data) ? resFeedback.data : []);
      setCampaigns(Array.isArray(resCampaigns.data) ? resCampaigns.data : []);
    } catch (err) {
      console.error("Failed to fetch separated A/B testing data", err);
    }
  };

  useEffect(() => {
    fetchABData();
  }, []);

  const totalTests = abTests.length;
  const activeTests = abTests.filter(f => f.statusi === "active").length;
  const totalClicks = abTests.reduce((acc, curr) => acc + (curr.metrika_klikimeve || 0), 0);

  const subMenus = [
    { id: "ABTests", label: "A/B Testing Experiments" },
    { id: "Feedback", label: "User Feedback & Notes" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OverviewCard title="Total A/B Experiments" value={totalTests.toString()} />
        <OverviewCard title="Active Experiments" value={activeTests.toString()} />
        <OverviewCard title="Total Clicks Tracked" value={totalClicks.toString()} />
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

      {subTab === "ABTests" && (
        <ABTestingTab
          feedbacks={abTests} 
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
  );
};

export default ABTestingModule;