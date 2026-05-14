import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsTab = ({ analytics, refreshAnalytics }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [channels, setChannels] = useState([]);
 
  const [formData, setFormData] = useState({
    campaign_id: '', channel_id: '', klikime: 0, shikime: 0, konvertime: 0, cmimi_per_klikim: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const [campRes, chanRes] = await Promise.all([
          axios.get('http://localhost:3000/api/campaigns', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/api/channels', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCampaigns(campRes.data);
        setChannels(chanRes.data);
      } catch (err) {
        console.error("Gabim gjatë ngarkimit të opsioneve", err);
      }
    };
    fetchData();
  }, []);

  const openModal = (entry = null) => {
    if (entry) {
      setCurrentEntry(entry);
      setFormData({
        campaign_id: entry.campaign_id,
        channel_id: entry.channel_id,
        klikime: entry.klikime,
        shikime: entry.shikime,
        konvertime: entry.konvertime,
        cmimi_per_klikim: entry.cmimi_per_klikim
      });
    } else {
      setCurrentEntry(null);
      setFormData({ campaign_id: '', channel_id: '', klikime: 0, shikime: 0, konvertime: 0, cmimi_per_klikim: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      if (currentEntry) {
        await axios.put(`http://localhost:3000/api/analytics/${currentEntry.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3000/api/analytics", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      refreshAnalytics();
      setIsModalOpen(false);
    } catch (err) {
      alert("Gabim gjatë ruajtjes!");
    }
  };

  return (
    <div className="bg-[#161926] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl mt-10">
      <div className="p-8 flex justify-between items-center border-b border-slate-800 bg-[#1c2132]">
        <h3 className="text-white font-bold text-xl">Detailed Metrics Report</h3>
       
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
        >
          + Add Analytics
        </button>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black">
          <tr>
            <th className="px-8 py-4">Campaign</th>
            <th className="px-8 py-4">Channel</th>
            <th className="px-8 py-4 text-center">Clicks</th>
            <th className="px-8 py-4 text-center">Conversions</th>
            <th className="px-8 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {analytics.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-all group">
              <td className="px-8 py-5 text-white font-semibold">{item.campaign?.emertimi}</td>
              <td className="px-8 py-5 text-slate-400">{item.channel?.emertimi}</td>
              <td className="px-8 py-5 text-center text-indigo-400 font-bold">{item.klikime}</td>
              <td className="px-8 py-5 text-center text-emerald-400 font-bold">{item.konvertime}</td>
              <td className="px-8 py-5 text-right space-x-4">
                <button onClick={() => openModal(item)} className="text-slate-400 hover:text-white transition-colors">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#161926] w-full max-w-lg rounded-[3rem] p-10 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-8">
              {currentEntry ? 'Update Analytics' : 'Add New Metrics'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Campaign</label>
              <select
                className="w-full bg-slate-900 border-none rounded-2xl p-4 text-white focus:ring-2 ring-indigo-500"
                value={formData.campaign_id}
                onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                required
              >
                <option value="">Select Campaign</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
              </select>

              <label className="text-xs font-bold text-slate-500 uppercase ml-2">Channel</label>
              <select
                className="w-full bg-slate-900 border-none rounded-2xl p-4 text-white focus:ring-2 ring-indigo-500"
                value={formData.channel_id}
                onChange={(e) => setFormData({...formData, channel_id: e.target.value})}
                required
              >
                <option value="">Select Channel</option>
                {channels.map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-2">Clicks</label>
                  <input type="number" className="w-full bg-slate-900 rounded-2xl p-4 text-white mt-1" value={formData.klikime} onChange={(e) => setFormData({...formData, klikime: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-2">Conversions</label>
                  <input type="number" className="w-full bg-slate-900 rounded-2xl p-4 text-white mt-1" value={formData.konvertime} onChange={(e) => setFormData({...formData, konvertime: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
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