import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import AnalyticsTab from './AnalyticsTab';

const AnalyticsModule = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubTab, setCurrentSubTab] = useState("All Analytics");

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
  const totalViews = analyticsData.reduce((acc, curr) => acc + (curr.shikime || 0), 0); 
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 105).toFixed(1) : 0;

  
  const getChannelData = () => {
    const channelMap = {};
    analyticsData.forEach(item => {
      const channelName = item.channel?.emertimi || "Unknown";
      if (!channelMap[channelName]) {
        channelMap[channelName] = { name: channelName, conversions: 0 };
      }
      channelMap[channelName].conversions += item.konvertime;
    });
    return Object.values(channelMap);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Views</p>
          </div>
          <div className="text-sm font-black bg-slate-100 text-slate-700 h-12 px-4 flex items-center justify-center rounded-xl shrink-0 ml-4 select-none min-w-[3.5rem] whitespace-nowrap">
            {totalViews.toLocaleString()}
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Clicks</p>
          </div>
          <div className="text-sm font-black bg-indigo-50 text-indigo-600 h-12 px-4 flex items-center justify-center rounded-xl shrink-0 ml-4 select-none min-w-[3.5rem] whitespace-nowrap">
            {totalClicks.toLocaleString()}
          </div>
        </div>

       
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversions</p>
          </div>
          <div className="text-sm font-black bg-indigo-50 text-indigo-600 h-12 px-4 flex items-center justify-center rounded-xl shrink-0 ml-4 select-none min-w-[3.5rem] whitespace-nowrap">
            {totalConversions.toLocaleString()}
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion Rate</p>
          </div>
          <div className="text-sm font-black bg-emerald-50 text-emerald-600 h-12 px-4 flex items-center justify-center rounded-xl shrink-0 ml-4 select-none min-w-[3.5rem] whitespace-nowrap">
            {conversionRate}%
          </div>
        </div>

      </div>

      
      <div className="flex border-b border-slate-200 space-x-6 pb-2 pt-2">
        <button
          onClick={() => setCurrentSubTab("All Analytics")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            currentSubTab === "All Analytics" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          All Analytics
          {currentSubTab === "All Analytics" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setCurrentSubTab("Reports")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            currentSubTab === "Reports" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Reports
          {currentSubTab === "Reports" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
          )}
        </button>
      </div>

     
      {currentSubTab === "All Analytics" ? (
        <>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
           
            <div className="bg-[#161926] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Campaign Performance</h3>
                <p className="text-slate-500 text-xs">Visual representation of clicks vs conversions per campaign</p>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="campaign.emertimi" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#161926', borderRadius: '14px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="klikime" name="Clicks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                    <Area type="monotone" dataKey="konvertime" name="Conversions" stroke="#10b981" strokeWidth={3} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            
            <div className="bg-[#161926] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Channel Efficiency</h3>
                <p className="text-slate-500 text-xs">Total conversions generated across different marketing channels</p>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChannelData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#161926', borderRadius: '14px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[8, 8, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          
          <AnalyticsTab analytics={analyticsData} refreshAnalytics={fetchAnalytics} />
        </>
      ) : (
       
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800">Generated Reports</h3>
              <p className="text-slate-400 text-sm">Export and review your marketing performance breakdowns</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all text-sm shadow-sm">
              Export New Report (PDF/CSV)
            </button>
          </div>
          
          <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center text-slate-400 font-medium">
            No custom reports generated yet. Click "Export New Report" to compile campaign data.
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalyticsModule;
