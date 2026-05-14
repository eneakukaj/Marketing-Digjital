import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AnalyticsTab from './AnalyticsTab';

const AnalyticsModule = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:3000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(res.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

 
  const totalClicks = analyticsData.reduce((acc, curr) => acc + curr.klikime, 0);
  const totalConversions = analyticsData.reduce((acc, curr) => acc + curr.konvertime, 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
     
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161926] p-8 rounded-[2rem] border border-slate-800 shadow-xl group hover:border-indigo-500/50 transition-all">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Clicks</p>
          <h3 className="text-4xl font-black text-white mt-2 group-hover:text-indigo-400 transition-colors">
            {totalClicks.toLocaleString()}
          </h3>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Conversions</p>
            <h3 className="text-4xl font-black mt-2">{totalConversions.toLocaleString()}</h3>
          </div>
         
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-[#161926] p-8 rounded-[2rem] border border-slate-800 shadow-xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Conversion Rate</p>
          <h3 className="text-4xl font-black text-emerald-400 mt-2">{conversionRate}%</h3>
        </div>
      </div>

      {/* 2. SEKSIONI I GRAFIKUT (VISUALIZATION) */}
      <div className="bg-[#161926] p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white">Performance Overview</h3>
          <p className="text-slate-500 text-sm">Visual representation of clicks vs conversions per campaign</p>
        </div>
       
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="campaign.emertimi"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{fill: '#94a3b8'}}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{fill: '#94a3b8'}}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161926',
                  borderRadius: '16px',
                  border: '1px solid #334155',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="klikime"
                name="Clicks"
                stroke="#6366f1"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
              <Area
                type="monotone"
                dataKey="konvertime"
                name="Conversions"
                stroke="#10b981"
                strokeWidth={4}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

   
      <AnalyticsTab
        analytics={analyticsData}
        refreshAnalytics={fetchAnalytics}
      />

    </div>
  );
};

export default AnalyticsModule;