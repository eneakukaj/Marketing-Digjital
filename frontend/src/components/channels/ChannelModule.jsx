import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 
import OverviewCard from './OverviewCards';
import ChannelsTab from './ChannelsTab';

const ChannelModule = () => {
  const [channels, setChannels] = useState([]);
  const [stats, setStats] = useState({ totalChannels: 0, activeChannels: 0, totalBudget: 0, mostUsedType: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  const { user } = useContext(AuthContext);

  const fetchChannelsData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const channelsRes = await axios.get('http://localhost:3000/api/channels', config);
      const statsRes = await axios.get('http://localhost:3000/api/channels/stats', config);

      if (channelsRes.data && Array.isArray(channelsRes.data)) {
        setChannels(channelsRes.data);
      }
      
      if (statsRes.data) {
        setStats({
          totalChannels: statsRes.data.totalChannels ?? 0,
          activeChannels: statsRes.data.activeChannels ?? 0,
          totalBudget: statsRes.data.totalBudget ?? 0,
          mostUsedType: statsRes.data.mostUsedType ?? 'N/A'
        });
      }

      let detectedRole = '';
      if (user?.userroles?.[0]?.role?.emertimi) {
        detectedRole = user.userroles[0].role.emertimi.toUpperCase();
      } else if (user?.userroles?.[0]?.role?.emri) {
        detectedRole = user.userroles[0].role.emri.toUpperCase();
      } else if (user?.role) {
        detectedRole = user.role.toUpperCase();
      } else {
        detectedRole = localStorage.getItem('userRole')?.toUpperCase() || '';
      }

      setUserRole(detectedRole);
      setLoading(false);
    } catch (err) {
      console.error("API ERROR CHANNELS MODULE:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelsData();
  }, [user]); 

  const overviewItems = [
    { title: "Total Channels", value: stats.totalChannels.toString() },
    { title: "Active Channels", value: stats.activeChannels.toString() },
    { title: "Allocated Budget", value: `€${Number(stats.totalBudget).toLocaleString()}` },
    { title: "Most Used Type", value: stats.mostUsedType.toUpperCase() }
  ];

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Channels...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {overviewItems.map((item, i) => (
          <OverviewCard 
            key={i} 
            title={item.title} 
            value={item.value} 
          />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
        <ChannelsTab channels={channels} refreshChannels={fetchChannelsData} userRole={userRole} />
      </div>
    </div>
  );
};

export default ChannelModule;