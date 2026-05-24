import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChannelsTab = ({ channels, refreshChannels, userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);

  const cleanRole = userRole?.toUpperCase();
  const localRole = localStorage.getItem('userRole')?.toUpperCase();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const storedUserRole = storedUser?.userroles?.[0]?.role?.emertimi?.toUpperCase() || storedUser?.role?.toUpperCase();

  const isAuthorized = 
    cleanRole === 'ADMIN' || 
    cleanRole === 'MANAGER' || 
    cleanRole === 'DREJTOR' ||
    localRole === 'ADMIN' || 
    localRole === 'MANAGER' ||
    storedUserRole === 'ADMIN' ||
    storedUserRole === 'MANAGER';

  const [formData, setFormData] = useState({
    emertimi: '',
    lloji: 'Social',
    pershkrimi: '',
    url: '',
    statusi: 'aktiv',
    campaign_id: '',
    buxheti_alokuar: ''
  });

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3000/api/manager/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data);
    } catch (err) {
      console.error("Error fetching campaigns for select dropdown:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openModal = (channel = null) => {
    setErrorMessage("");
    if (channel) {
      setCurrentChannel(channel);
      const linkedCampaign = channel.campaignchannels?.[0];
      setFormData({
        emertimi: channel.emertimi || '',
        lloji: channel.lloji || 'Social',
        pershkrimi: channel.pershkrimi || '',
        url: channel.url || '',
        statusi: channel.statusi || 'aktiv',
        campaign_id: linkedCampaign?.campaign_id || '',
        buxheti_alokuar: linkedCampaign?.buxheti_alokuar || ''
      });
    } else {
      setCurrentChannel(null);
      setFormData({ emertimi: '', lloji: 'Social', pershkrimi: '', url: '', statusi: 'aktiv', campaign_id: '', buxheti_alokuar: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const dataToSend = {
      emertimi: formData.emertimi,
      lloji: formData.lloji,
      pershkrimi: formData.pershkrimi,
      url: formData.url,
      statusi: formData.statusi,
      campaign_id: formData.campaign_id ? Number(formData.campaign_id) : null,
      buxheti_alokuar: formData.buxheti_alokuar ? Number(formData.buxheti_alokuar) : 0
    };

    try {
      if (currentChannel) {
        await axios.put(`http://localhost:3000/api/channels/${currentChannel.id}`, dataToSend, config);
      } else {
        await axios.post("http://localhost:3000/api/channels", dataToSend, config);
      }
      setIsModalOpen(false);
      await refreshChannels();
    } catch (err) {
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Channels Management</h2>
        
        {isAuthorized ? (
          <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">+ Add Channel</button>
        ) : (
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl italic">Read-only mode</span>
        )}
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Channel Name & URL</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Campaign</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            {isAuthorized && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {channels.map((channel) => (
            <tr key={channel.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase">{channel.emertimi?.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{channel.emertimi}</div>
                    <div className="text-xs text-slate-400">{channel.url || 'No link provided'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                  {channel.lloji}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-700">
                  {channel.campaignchannels?.[0]?.campaign?.emertimi || 'Unassigned'}
                </span>
              </td>
              <td className="px-6 py-4">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
              channel.statusi?.toLowerCase() === 'aktiv' || channel.statusi?.toLowerCase() === 'active'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600'
              }`}>
            {channel.statusi?.toLowerCase() === 'aktiv' || channel.statusi?.toLowerCase() === 'active' 
              ? 'Active' 
              : 'Passive'}
             </span>
            </td>
              {isAuthorized && (
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(channel)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Edit</button>
                  <button onClick={() => { setChannelToDelete(channel); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{currentChannel ? 'Edit Channel' : 'Add New Channel'}</h3>
            
            {errorMessage && <div className="mb-4 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-2xl italic">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Channel Name</label>
                <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.emertimi} onChange={(e) => setFormData({...formData, emertimi: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">Type</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 appearance-none" value={formData.lloji} onChange={(e) => setFormData({...formData, lloji: e.target.value})} required>
                    <option value="Social">Social</option>
                    <option value="Email">Email</option>
                    <option value="Web">Web</option>
                    <option value="Organic">Organic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={formData.statusi}
                    onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                   >
                   <option value="aktiv">Active</option>
                   <option value="pasiv">Passive</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Channel Link / URL</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} />
              </div>

              <div className="border-t border-slate-100 my-2 pt-4">
                <label className="text-xs font-bold text-indigo-600 ml-1">Connect to Campaign</label>
                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 appearance-none" value={formData.campaign_id} onChange={(e) => setFormData({...formData, campaign_id: e.target.value})} required>
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Allocated Budget (€)</label>
                <input type="number" step="0.01" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500" value={formData.buxheti_alokuar} onChange={(e) => setFormData({...formData, buxheti_alokuar: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 ml-1">Description</label>
                <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mt-1 focus:ring-2 focus:ring-indigo-500 h-20 resize-none" value={formData.pershkrimi} onChange={(e) => setFormData({...formData, pershkrimi: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-base hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            Save Channel
          </button>
        </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">Are you sure?</h3>
            <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
              Channel <span className="font-bold text-[#475569]">{channelToDelete?.emertimi}</span> will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button type="button" onClick={() => { setIsDeleteModalOpen(false); setChannelToDelete(null); }} className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  axios.delete(`http://localhost:3000/api/channels/${channelToDelete.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                  })
                  .then(() => {
                    refreshChannels();
                    setIsDeleteModalOpen(false);
                    setChannelToDelete(null);
                  })
                  .catch(err => console.error("Error deleting channel:", err));
                }}
                className="flex-1 bg-[#e11d48] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#be123c] transition-colors shadow-md shadow-rose-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsTab;