import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AudienceTab from './AudienceTab';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const AudienceOverviewCard = ({ title, value, percentage, isPositive }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</span>
    <div className="flex items-end justify-between">
      <h2 className="text-3xl font-black text-slate-800">{value}</h2>
      {percentage && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? '↑' : '↓'} {percentage}
        </span>
      )}
    </div>
  </div>
);

const AudienceModule = () => {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAudiencesData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:3000/api/audiences', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAudiences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("ERROR WHILE FETCHING DATA:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAudiencesData(); }, []);


  const ageGroups = [
    { name: '18-24', count: audiences.filter(a => a.mosha_min >= 18 && a.mosha_min <= 24).length },
    { name: '25-34', count: audiences.filter(a => a.mosha_min >= 25 && a.mosha_min <= 34).length },
    { name: '35-44', count: audiences.filter(a => a.mosha_min >= 35 && a.mosha_min <= 44).length },
    { name: '45+',    count: audiences.filter(a => a.mosha_min >= 45).length },
];

    const genderDistribution = [
  { name: 'Male', value: audiences.filter(a => a.gjinia === 'Male').length },
  { name: 'Female', value: audiences.filter(a => a.gjinia === 'Female').length },
  { name: 'Other', value: audiences.filter(a => !['Male', 'Female'].includes(a.gjinia)).length },
];

  const topLocations = audiences.reduce((acc, curr) => {
    acc[curr.lokacioni] = (acc[curr.lokacioni] || 0) + 1;
    return acc;
  }, {});

  const locationData = [...new Set(audiences.map(a => a.lokacioni))].map(loc => ({
  name: loc || "Unknown",
  reach: audiences.filter(a => a.lokacioni === loc).length
})).slice(0, 5);

  const COLORS = ['#6366f1', '#a5b4fc', '#cbd5e1', '#1e293b'];

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse">Syncing...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AudienceOverviewCard title="Total Segments" value={audiences.length} />
        <AudienceOverviewCard 
          title="Top Location" 
          value={locationData[0]?.name || "N/A"} 
          percentage={locationData.length > 0 ? "Kryesor" : null} 
          isPositive={true} 
        />
        <AudienceOverviewCard 
          title="Dominant Gender" 
          value={genderDistribution.sort((a,b) => b.value - a.value)[0]?.name || "N/A"} 
        />
        <AudienceOverviewCard title="Interests Field" value={new Set(audiences.map(a => a.interesat)).size} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="font-black text-slate-800 text-2xl tracking-tighter">Audience Segments</h3>
          </div>
          <AudienceTab audiences={audiences} refreshAudiences={fetchAudiencesData} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white">
            <h4 className="font-bold text-indigo-400 mb-6">Gender Distribution</h4>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderDistribution} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                    {genderDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', color: '#000' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {genderDistribution.map((d, i) => (
                <div key={i} className="text-[10px] uppercase font-bold text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i]}}></span>
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 mb-6">Age Groups</h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGroups}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceModule;