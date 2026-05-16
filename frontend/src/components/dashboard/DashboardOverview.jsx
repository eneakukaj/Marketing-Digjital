import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/overview", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading dashboard data...</div>;
  if (!data) return <div className="p-6 text-red-500 text-sm">Failed to load data.</div>;

  return (
    <div className="space-y-8">
      
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-h-[100px]">
      <div>
        <p className="text-[11px] font-medium text-slate-400">AdVantage</p>
        <p className="text-sm font-black text-slate-700 tracking-tight mt-0.5">Active Campaigns</p>
      </div>
      <div className="text-xl font-black bg-indigo-50 text-indigo-600 w-14 h-14 flex items-center justify-center rounded-2xl shrink-0 ml-4 shadow-sm border border-indigo-100/50">
        {formatNumber(data.cards.activeCampaigns)}
      </div>
    </div>

    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-h-[100px]">
      <div>
        <p className="text-[11px] font-medium text-slate-400">AdVantage</p>
        <p className="text-sm font-black text-slate-700 tracking-tight mt-0.5">Total Clicks</p>
      </div>
      <div className="text-xl font-black bg-indigo-50 text-indigo-600 px-3 h-14 flex items-center justify-center rounded-2xl shrink-0 ml-4 shadow-sm border border-indigo-100/50 min-w-[56px]">
        {formatNumber(data.cards.totalClicks)}
      </div>
    </div>

    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-h-[100px]">
      <div>
        <p className="text-[11px] font-medium text-slate-400">AdVantage</p>
        <p className="text-sm font-black text-slate-700 tracking-tight mt-0.5">Total Revenue</p>
      </div>
      <div className="text-lg font-black bg-indigo-50 text-indigo-600 px-3 h-14 flex items-center justify-center rounded-2xl shrink-0 ml-4 shadow-sm border border-indigo-100/50 min-w-[56px]">
        {formatCurrency(data.cards.totalRevenue)}
      </div>
    </div>

    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between min-h-[100px]">
      <div>
        <p className="text-[11px] font-medium text-slate-400">AdVantage</p>
        <p className="text-sm font-black text-slate-700 tracking-tight mt-0.5">Top Channel</p>
      </div>
      <div className="text-sm font-black bg-indigo-50 text-indigo-600 px-3 h-14 flex items-center justify-center rounded-2xl shrink-0 ml-4 shadow-sm border border-indigo-100/50 max-w-[120px] truncate">
        {data.cards.topChannel}
      </div>
    </div>
</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold">Channel Mix</h4>
            <p className="text-xs text-slate-400">Clicks distribution by channel</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.channelMix}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.channelMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 sm:ml-8 w-full space-y-2">
              {data.channelMix.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold">{formatNumber(item.value)} clicks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold">Active Campaigns</h4>
              <p className="text-xs text-slate-400">Budget utilization tracking</p>
            </div>
          </div>

          <div className="space-y-5">
            {data.activeCampaignsProgress.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No active campaigns running.</p>
            ) : (
              data.activeCampaignsProgress.map((camp) => (
                <div key={camp.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {camp.emertimi.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm truncate max-w-[180px] sm:max-w-xs">{camp.emertimi}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{camp.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${camp.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{formatCurrency(camp.spent)} spent</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;