import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ComposedChart, 
  Bar,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [leads, setLeads] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [channels, setChannels] = useState([]);
  const [abTests, setAbTests] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [
          campaignsRes,
          analyticsRes,
          leadsRes,
          budgetsRes,
          milestonesRes,
          schedulesRes,
          channelsRes,
          abTestsRes
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/manager/campaigns", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/analytics", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/analytics/leads", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/manager/budgets", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/manager/milestones", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/manager/scheduling", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/channels", config).catch(() => ({ data: [] })),
          axios.get("http://localhost:3000/api/ab-tests", config).catch(() => ({ data: [] }))
        ]);

        setCampaigns(Array.isArray(campaignsRes.data) ? campaignsRes.data : []);
        setAnalytics(Array.isArray(analyticsRes.data) ? analyticsRes.data : []);
        setLeads(Array.isArray(leadsRes.data) ? leadsRes.data : []);
        setBudgets(Array.isArray(budgetsRes.data) ? budgetsRes.data : []);
        setMilestones(Array.isArray(milestonesRes.data) ? milestonesRes.data : []);
        setSchedules(Array.isArray(schedulesRes.data) ? schedulesRes.data : []);
        setChannels(Array.isArray(channelsRes.data) ? channelsRes.data : []);
        setAbTests(Array.isArray(abTestsRes.data) ? abTestsRes.data : []);

      } catch (error) {
        console.error("Error fetching dynamic dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllDashboardData();
    }
  }, [token]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const totalCampaigns = campaigns.length;
  const activeCampaignsCount = campaigns.filter(c => c.statusi?.toLowerCase() === "aktiv" || c.statusi?.toLowerCase() === "active").length;
  
  const totalClicks = analytics.reduce((sum, item) => sum + (Number(item.klikime) || 0), 0);
  const totalConversions = analytics.reduce((sum, item) => sum + (Number(item.konvertime) || 0), 0);
  const totalViews = analytics.reduce((sum, item) => sum + (Number(item.shikime) || 0), 0);
  const totalLeads = leads.length;

  const totalAllocatedBudget = budgets.reduce((sum, item) => sum + (Number(item.shuma_totale) || 0), 0);
  const totalSpentBudget = budgets.reduce((sum, item) => sum + (Number(item.shuma_shpenzuar) || 0), 0);

  const performanceChartData = analytics.map((item) => ({
    name: item.campaign?.emertimi || `Campaign #${item.campaign_id}`,
    Clicks: Number(item.klikime) || 0,
    Conversions: Number(item.konvertime) || 0,
    Impressions: Number(item.shikime) || 0,
  }));

  const totalChannelsCount = channels.length;
  const channelTypeCounts = channels.reduce((acc, curr) => {
    const type = curr.lloji || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const channelDistributionMatrix = Object.keys(channelTypeCounts).map((key) => ({
    name: key,
    value: channelTypeCounts[key],
    percentage: totalChannelsCount > 0 ? Math.round((channelTypeCounts[key] / totalChannelsCount) * 100) : 0
  })).sort((a, b) => b.value - a.value);

  const dynamicBudgetTracker = budgets.map((b) => {
    const linkedCampaign = campaigns.find((c) => c.id === b.campaign_id);
    const total = Number(b.shuma_totale) || 0;
    const spent = Number(b.shuma_shpenzuar) || 0;
    const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;
    
    return {
      id: b.id,
      campaignName: linkedCampaign?.emertimi || `Campaign #${b.campaign_id}`,
      total,
      spent,
      remaining: Number(b.shuma_mbetur) || (total - spent),
      percentage: pct
    };
  });

  const liveMonitoringTimeline = [
    ...milestones.map((m) => ({
      id: `milestone-${m.id}`,
      type: "Milestone",
      title: m.description || "Unnamed Milestone",
      date: m.due_date ? new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No Date Provided",
      status: m.statusi || "pending",
      badgeColor: m.statusi === "kompletuar" || m.statusi === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200",
    })),
    ...schedules.map((s) => ({
      id: `schedule-${s.id}`,
      type: "Content Schedule",
      title: `Campaign Asset Deployment (Content ID: ${s.content_id})`,
      date: s.scheduled_time ? new Date(s.scheduled_time).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "No Date Provided",
      status: s.statusi || "pending",
      badgeColor: s.statusi === "sent" || s.statusi === "published" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-700 border-slate-200",
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const campaignEfficiencyLeaderboard = analytics.map((item) => {
    const linkedCampaign = campaigns.find((c) => c.id === item.campaign_id);
    const clicks = Number(item.klikime) || 0;
    const conversions = Number(item.konvertime) || 0;
    const views = Number(item.shikime) || 0;
    
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : "0.00";
    const cvr = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : "0.00";
    
    return {
      id: item.id,
      name: linkedCampaign?.emertimi || `Campaign #${item.campaign_id}`,
      ctr,
      cvr,
      clicks,
      conversions
    };
  }).sort((a, b) => parseFloat(b.cvr) - parseFloat(a.cvr));


  const processedAbData = abTests.map((test) => {
    const linkedCampaign = campaigns.find((c) => c.id === test.campaign_id);
    const clicksA = Number(test.variant_a_clicks) || 0;
    const convA = Number(test.variant_a_conversions) || 0;
    const clicksB = Number(test.variant_b_clicks) || 0;
    const convB = Number(test.variant_b_conversions) || 0;

    const cvrA = clicksA > 0 ? (convA / clicksA) * 100 : 0;
    const cvrB = clicksB > 0 ? (convB / clicksB) * 100 : 0;

    let winner = "Tie / Drawing";
    let lift = 0;
    let fallbackToVotes = false;

    if (cvrB > cvrA) {
      winner = test.variant_b_name || "Variant B";
      lift = cvrA > 0 ? ((cvrB - cvrA) / cvrA) * 100 : cvrB * 100;
    } else if (cvrA > cvrB) {
      winner = test.variant_a_name || "Variant A";
      lift = cvrB > 0 ? ((cvrA - cvrB) / cvrB) * 100 : cvrA * 100;
    } else {
      if (clicksB > clicksA) {
        winner = `${test.variant_b_name || "Variant B"} (By Clicks)`;
        lift = clicksA > 0 ? ((clicksB - clicksA) / clicksA) * 100 : clicksB * 100;
        fallbackToVotes = true;
      } else if (clicksA > clicksB) {
        winner = `${test.variant_a_name || "Variant A"} (By Clicks)`;
        lift = clicksB > 0 ? ((clicksA - clicksB) / clicksB) * 100 : clicksA * 100;
        fallbackToVotes = true;
      }
    }

    return {
      id: test.id,
      campaignName: linkedCampaign?.emertimi || `Campaign #${test.campaign_id}`,
      experimentName: test.variant_name || "Experiment Test",
      winner,
      lift: lift.toFixed(1),
      cvrA: cvrA.toFixed(2),
      cvrB: cvrB.toFixed(2),
      fallbackToVotes
    };
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold tracking-wide animate-pulse">Loading Live Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Performance Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time aggregate data systems metrics direct compilation.</p>
        </div>
        <div className="flex items-center space-x-3 self-start md:self-center">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">System Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Campaigns</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{formatNumber(totalCampaigns)}</span>
            <span className="text-xs font-bold text-slate-500">Registered</span>
          </div>
          <div className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-md inline-block">
            {activeCampaignsCount} Active Run
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Traffic Generation</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{formatNumber(totalClicks)}</span>
            <span className="text-xs font-bold text-slate-500">Clicks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Accumulated from {formatNumber(totalViews)} impressions</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Acquisition Growth</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{formatNumber(totalLeads)}</span>
            <span className="text-xs font-bold text-slate-500">Total Leads</span>
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block">
            Conversions: {formatNumber(totalConversions)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Financial Execution</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(totalSpentBudget)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-semibold">
            Out of {formatCurrency(totalAllocatedBudget)} Allocated
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Campaign Analytics Breakdown</h3>
            <p className="text-xs text-slate-400 font-medium">Hybrid tracking analysis mapping volume distribution vs conversion index</p>
          </div>
          <div className="h-72 w-full flex-grow">
            {performanceChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                No performance telemetry records found in system.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#000000', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Bar dataKey="Clicks" fill="#6366f1" radius={[5, 5, 0, 0]} barSize={18} />
                  <Line type="monotone" dataKey="Conversions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Channel Share Optimization</h3>
            <p className="text-xs text-slate-400 font-medium">Density mapping and total network distribution balance</p>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[290px] pr-1 pt-2">
            {channelDistributionMatrix.length === 0 ? (
              <div className="text-slate-400 font-medium text-sm text-center py-12">No channels connected to summarize.</div>
            ) : (
              channelDistributionMatrix.map((item, index) => (
                <div key={index} className="flex flex-col space-y-1.5 p-3 rounded-2xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2.5 font-bold text-slate-700">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span>{item.name} Media</span>
                    </div>
                    <div className="text-right font-black text-slate-900">
                      <span>{item.value} {item.value === 1 ? 'Unit' : 'Units'}</span>
                      <span className="text-slate-400 font-bold ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: COLORS[index % COLORS.length],
                        width: `${item.percentage}%` 
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Budget Resource Tracking</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time expenditure accounting indexes</p>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[320px] pr-1">
            {dynamicBudgetTracker.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium text-sm">
                No budget limits initialized in backend.
              </div>
            ) : (
              dynamicBudgetTracker.map((bgItem) => (
                <div key={bgItem.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-800 truncate max-w-[240px]">{bgItem.campaignName}</span>
                    <span className="text-xs font-black text-indigo-600">{bgItem.percentage}% Expended</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${bgItem.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                    <span>Spent: {formatCurrency(bgItem.spent)}</span>
                    <span>Remaining: {formatCurrency(bgItem.remaining)}</span>
                    <span>Total: {formatCurrency(bgItem.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Milestones & Content Deployment Monitor</h3>
            <p className="text-xs text-slate-400 font-medium">Synchronized agenda roadmap schedule sequence pipeline</p>
          </div>
          <div className="space-y-3 flex-grow overflow-y-auto max-h-[320px] pr-1">
            {liveMonitoringTimeline.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium text-sm">
                No active schedule arrangements or milestones posted.
              </div>
            ) : (
              liveMonitoringTimeline.map((event) => (
                <div key={event.id} className="flex items-start p-3 rounded-2xl border border-slate-100 bg-white shadow-xs space-x-3">
                  <div className="flex flex-col items-center">
                    <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md border ${event.badgeColor}`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{event.title}</h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{event.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Strategic Performance Efficiency Leaderboard</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time derived CVR and CTR live calculation matrix</p>
          </div>
          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">Campaign Identity</th>
                  <th className="pb-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Clicks</th>
                  <th className="pb-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Conversions</th>
                  <th className="pb-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">CTR %</th>
                  <th className="pb-3 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Conversion Rate (CVR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {campaignEfficiencyLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-slate-400 font-semibold">No operational performance arrays calculated.</td>
                  </tr>
                ) : (
                  campaignEfficiencyLeaderboard.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 text-xs font-bold text-slate-800 max-w-[180px] truncate">{row.name}</td>
                      <td className="py-3.5 text-center text-xs font-semibold text-slate-600">{formatNumber(row.clicks)}</td>
                      <td className="py-3.5 text-center text-xs font-semibold text-slate-600">{formatNumber(row.conversions)}</td>
                      <td className="py-3.5 text-center text-xs font-bold text-indigo-600/90">{row.ctr}%</td>
                      <td className="py-3.5 text-right text-xs font-black text-emerald-600">
                        <span className="bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">{row.cvr}%</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">A/B Testing Revenue & Lift Matrix</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time optimization engine calculating variants performance lift indexes</p>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[290px] pr-1 pt-1">
            {processedAbData.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium text-sm">
                No split A/B tests active to calculate.
              </div>
            ) : (
              processedAbData.map((test) => (
                <div key={test.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 truncate max-w-[150px]">{test.experimentName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold truncate max-w-[140px]">{test.campaignName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        test.winner === "Tie / Drawing" 
                          ? "bg-slate-100 border-slate-200 text-slate-600" 
                          : "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}>
                        {test.winner === "Tie / Drawing" ? "No Lift" : `+${test.lift}% Lift`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 border-t border-slate-100 pt-2 text-[11px] font-bold text-slate-500">
                    <div>
                      <span className="text-[10px] block font-medium text-slate-400">Variant A CVR</span>
                      <span className="text-slate-700">{test.cvrA}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] block font-medium text-slate-400">Variant B CVR</span>
                      <span className="text-slate-700">{test.cvrB}%</span>
                    </div>
                  </div>

                  <div className={`mt-3 rounded-xl p-2 text-center border ${
                    test.winner === "Tie / Drawing"
                      ? "bg-slate-100/70 border-slate-200/60 text-slate-600"
                      : "bg-indigo-50/50 border-indigo-100/50 text-indigo-700"
                  }`}>
                    <p className="text-[10px] font-black">
                      {test.winner === "Tie / Drawing" ? (
                        <span>🤝 Status: Absolute Tie</span>
                      ) : (
                        <span>
                          🏆 Winning Vector: <span className="underline font-extrabold">{test.winner}</span>
                          {test.fallbackToVotes && " *"}
                        </span>
                      )}
                    </p>
                    {test.fallbackToVotes && (
                      <span className="text-[9px] text-indigo-500 block font-semibold mt-0.5">* Determined by click volume tiebreaker</span>
                    )}
                  </div>
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