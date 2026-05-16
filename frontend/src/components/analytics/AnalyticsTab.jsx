import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsTab = ({ analytics = [], refreshAnalytics }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [channels, setChannels] = useState([]);
  
  const [formData, setFormData] = useState({
    campaign_id: '', 
    channel_id: '', 
    klikime: 0, 
    shikime: 0, 
    konvertime: 0, 
    cmimi_per_klikim: 0
  });

  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        
        const [campRes1, campRes2, chanRes] = await Promise.all([
          axios.get('http://localhost:3000/api/campaigns', config).catch(() => null),
          axios.get('http://localhost:3000/api/manager/campaigns', config).catch(() => null),
          axios.get('http://localhost:3000/api/channels', config).catch(() => null)
        ]);

       
        if (campRes1 && Array.isArray(campRes1.data)) {
          setCampaigns(campRes1.data);
        } else if (campRes2 && Array.isArray(campRes2.data)) {
          setCampaigns(campRes2.data);
        }

        
        if (chanRes && Array.isArray(chanRes.data)) {
          setChannels(chanRes.data);
        }
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };
    fetchData();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setCurrentEntry(item);
      setFormData({
        campaign_id: item.campaign_id ? String(item.campaign_id) : '',
        channel_id: item.channel_id ? String(item.channel_id) : '',
        klikime: item.klikime ?? 0,
        shikime: item.shikime ?? 0,
        konvertime: item.konvertime ?? 0,
        cmimi_per_klikim: item.cmimi_per_klikim ?? 0
      });
    } else {
      setCurrentEntry(null);
      setFormData({ 
        campaign_id: '', 
        channel_id: '', 
        klikime: 0, 
        shikime: 0, 
        konvertime: 0, 
        cmimi_per_klikim: 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (currentEntry) {
        await axios.put(`http://localhost:3000/api/analytics/${currentEntry.id}`, formData, config);
      } else {
        await axios.post("http://localhost:3000/api/analytics", formData, config);
      }
      refreshAnalytics();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Error occurred while saving!");
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm mt-10">
      <div className="p-8 flex justify-between items-center border-b border-slate-100">
        <h3 className="text-slate-800 font-black text-xl">Detailed Metrics Report</h3>
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm"
        >
          + Add Analytics
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="px-8 py-4">Campaign</th>
              <th className="px-8 py-4">Channel</th>
              <th className="px-8 py-4 text-center">Clicks</th>
              <th className="px-8 py-4 text-center">Conversions</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.isArray(analytics) && analytics.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-5 text-slate-800 font-bold">
                  {item.campaign?.emertimi || `Campaign #${item.campaign_id}`}
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium">
                  {item.channel?.emertimi || `Channel #${item.channel_id}`}
                </td>
                <td className="px-8 py-5 text-center text-indigo-600 font-extrabold">{item.klikime}</td>
                <td className="px-8 py-5 text-center text-emerald-600 font-extrabold">{item.konvertime}</td>
                <td className="px-8 py-5 text-right space-x-4">
                  <button 
                    onClick={() => openModal(item)} 
                    className="text-slate-400 hover:text-slate-700 font-bold text-sm transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 shadow-xl">
            <h2 className="text-2xl font-black text-slate-800 mb-6">
              {currentEntry ? 'Update Analytics' : 'Add New Metrics'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Campaign</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500"
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                  required
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.emertimi}</option>
                  ))}
                </select>
              </div>

              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Channel</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1 focus:outline-none focus:border-indigo-500"
                  value={formData.channel_id}
                  onChange={(e) => setFormData({...formData, channel_id: e.target.value})}
                  required
                >
                  <option value="">Select Channel</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.emertimi}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Clicks</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1" 
                    value={formData.klikime} 
                    onChange={(e) => setFormData({...formData, klikime: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Conversions</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium mt-1" 
                    value={formData.konvertime} 
                    onChange={(e) => setFormData({...formData, konvertime: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  {currentEntry ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;