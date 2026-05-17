import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 
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
import LeadsTab from './LeadsTab'; 

const AnalyticsModule = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubTab, setCurrentSubTab] = useState("All Analytics"); 
  const [userRole, setUserRole] = useState('');

  const { user } = useContext(AuthContext);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:3000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(res.data);

      let detectedRole = '';
      if (user?.role?.name) {
        detectedRole = user.role.name.toUpperCase();
      } else if (user?.role) {
        detectedRole = user.role.toUpperCase();
      } else {
        detectedRole = localStorage.getItem('userRole')?.toUpperCase() || '';
      }
      setUserRole(detectedRole);

    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const totalClicks = analyticsData.reduce((acc, curr) => acc + curr.klikime, 0);
  const totalConversions = analyticsData.reduce((acc, curr) => acc + curr.konvertime, 0);
  const totalViews = analyticsData.reduce((acc, curr) => acc + (curr.shikime || 0), 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0;

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

  
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    
    const tableRows = analyticsData.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-weight: bold; color: #1e293b;">${item.campaign?.emertimi || `Campaign #${item.campaign_id}`}</td>
        <td style="padding: 12px; color: #64748b;">${item.channel?.emertimi || `Channel #${item.channel_id}`}</td>
        <td style="padding: 12px; text-align: center; color: #4f46e5; font-weight: bold;">${item.klikime}</td>
        <td style="padding: 12px; text-align: center; color: #10b981; font-weight: bold;">${item.konvertime}</td>
        <td style="padding: 12px; text-align: center; color: #64748b;">${item.shikime || 0}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Marketing Report - ${user?.emri || 'User'}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #334155; }
            .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 900; color: #1e293b; margin: 0; }
            .meta { font-size: 13px; color: #94a3b8; margin-top: 5px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; margin-top: 20px; }
            .stat-card { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
            .stat-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
            .stat-value { font-size: 20px; font-weight: 900; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f8fafc; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Marketing Performance Report</h1>
            <p class="meta">Gjeneruar më: ${new Date().toLocaleDateString('sq-AL')} | Përdoruesi: ${user?.emri || 'User'} (${userRole})</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Views</div>
              <div class="stat-value">${totalViews.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Clicks</div>
              <div class="stat-value">${totalClicks.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Conversions</div>
              <div class="stat-value">${totalConversions.toLocaleString()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Conversion Rate</div>
              <div class="stat-value">${conversionRate}%</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th style="text-align: center;">Clicks</th>
                <th style="text-align: center;">Conversions</th>
                <th style="text-align: center;">Views</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
        <button
          onClick={() => setCurrentSubTab("Leads")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            currentSubTab === "Leads" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Leads
          {currentSubTab === "Leads" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
          )}
        </button>
      </div>

      {currentSubTab === "All Analytics" && (
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
                    <XAxis dataKey="campaign.emertimi" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{ backgroundColor: '#161926', borderRadius: '16px', border: '1px solid #334155' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="klikime" name="Clicks" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                    <Area type="monotone" dataKey="konvertime" name="Conversions" stroke="#10b981" strokeWidth={4} fill="none" />
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
                    <Tooltip contentStyle={{ backgroundColor: '#161926', borderRadius: '14px', border: '1px solid #334155' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[8, 8, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <AnalyticsTab analytics={analyticsData} refreshAnalytics={fetchAnalytics} userRole={userRole} />
        </>
      )}

      
      {currentSubTab === "Reports" && (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800">Generated User Reports</h3>
              <p className="text-slate-400 text-sm">Review your personalized performance metrics breakdown</p>
            </div>
            <button 
              onClick={handleDownloadPDF}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100"
            >
              Print PDF Report
            </button>
          </div>

          
          <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Views Compiled</p>
              <p className="text-lg font-black text-slate-700">{totalViews.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Clicks Compiled</p>
              <p className="text-lg font-black text-indigo-600">{totalClicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Conversions</p>
              <p className="text-lg font-black text-emerald-600">{totalConversions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avg. Conv Rate</p>
              <p className="text-lg font-black text-slate-800">{conversionRate}%</p>
            </div>
          </div>

          
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Campaign Name</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4 text-center">Clicks</th>
                  <th className="px-6 py-4 text-center">Conversions</th>
                  <th className="px-6 py-4 text-center">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyticsData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                      No analytics data available to display.
                    </td>
                  </tr>
                ) : (
                  analyticsData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 text-slate-800 font-bold">
                        {item.campaign?.emertimi || `Campaign #${item.campaign_id}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {item.channel?.emertimi || `Channel #${item.channel_id}`}
                      </td>
                      <td className="px-6 py-4 text-center text-indigo-600 font-extrabold">{item.klikime}</td>
                      <td className="px-6 py-4 text-center text-emerald-600 font-extrabold">{item.konvertime}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">{item.shikime || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentSubTab === "Leads" && (
        <LeadsTab />
      )}

    </div>
  );
};

export default AnalyticsModule;