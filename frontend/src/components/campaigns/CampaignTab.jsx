import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const CampaignTab = ({ campaigns, refreshCampaigns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channels, setChannels] = useState([]);

  const { user } = useContext(AuthContext);

const roles = user?.roles || user?.role || [];

const userRoles = Array.isArray(roles)
  ? roles
  : [roles];

const isAdminOrManager =
  userRoles.includes("ADMIN") ||
  userRoles.includes("MANAGER");

  const [formData, setFormData] = useState({
    emertimi: "",
    pershkrimi: "",
    buxheti: "",
    data_fillimit: "",
    data_perfundimit: "",
    statusi: "draft",
    objektivi: "",
    channel_id: "",
  });

  useEffect(() => {
  const fetchChannels = async () => {
    try {
      const res = await api.get("/channels");
      setChannels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  };

  fetchChannels();
}, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
  const matchesSearch =
    campaign.emertimi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.objektivi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.statusi?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    campaign.statusi?.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});

  const openModal = (campaign = null) => {
    if (campaign) {
      setCurrentCampaign(campaign);
      setFormData({
        emertimi: campaign.emertimi || "",
        pershkrimi: campaign.pershkrimi || "",
        buxheti: campaign.buxheti || "",
        data_fillimit: campaign.data_fillimit ? campaign.data_fillimit.split("T")[0] : "",
        data_perfundimit: campaign.data_perfundimit ? campaign.data_perfundimit.split("T")[0] : "",
        statusi: campaign.statusi || "draft",
        objektivi: campaign.objektivi || "",
        channel_id: campaign.campaignchannels?.[0]?.channel_id || "",
      });
    } else {
      setCurrentCampaign(null);
      setFormData({
        emertimi: "",
        pershkrimi: "",
        buxheti: "",
        data_fillimit: "",
        data_perfundimit: "",
        statusi: "draft",
        objektivi: "",
        channel_id: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        buxheti: formData.buxheti ? Number(formData.buxheti) : 0,
        data_fillimit: formData.data_fillimit
          ? new Date(formData.data_fillimit).toISOString()
          : null,
        data_perfundimit: formData.data_perfundimit
          ? new Date(formData.data_perfundimit).toISOString()
          : null,
      };

      if (currentCampaign) {
        await api.put(`/campaigns/${currentCampaign.id}`, payload);
      } else {
        await api.post("/campaigns", payload);
      }

      await refreshCampaigns();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Operation failed", err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
     await api.delete(`/campaigns/${currentCampaign.id}`);

      await refreshCampaigns();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">
            Campaign Management
          </h3>
          <p className="text-slate-400 text-sm">
            Manage marketing campaigns and performance goals
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          + Add Campaign
        </button>
      </div>

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label className="block text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
        Search Campaigns
      </label>

      <input
        type="text"
        placeholder="Search by name, objective or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-white border border-blue-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div className="md:w-56">
      <label className="block text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
        Filter Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-white border border-blue-100 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredCampaigns.map((campaign) => { 
    const canModify =
  isAdminOrManager ||
  Number(campaign.user_id) === Number(user?.id);
    return (
    <div
      key={campaign.id}
      className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              campaign.statusi === "aktiv" || campaign.statusi === "active"
                ? "bg-emerald-50 text-emerald-600"
                : campaign.statusi === "draft"
                ? "bg-slate-100 text-slate-500"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {campaign.statusi}
          </span>

          {canModify && (
  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <button
      onClick={() => openModal(campaign)}
      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
    >
      Edit
    </button>

    <button
      onClick={() => {
        setCurrentCampaign(campaign);
        setIsDeleteModalOpen(true);
      }}
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-all"
    >
      Delete
    </button>
  </div>
)}
        </div>

        <h4 className="text-lg font-bold text-slate-800 mb-1">
          {campaign.emertimi}
        </h4>

        <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">
          {campaign.objektivi || "No objective"}
        </p>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {campaign.pershkrimi || "No description provided."}
        </p>
      </div>

      <div className="border-t border-slate-50 pt-4 mt-auto flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Budget
          </p>
          <p className="text-base font-bold text-slate-700">
            ${Number(campaign.buxheti || 0).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Timeline
          </p>
          <p className="text-xs font-semibold text-slate-600">
            {campaign.data_fillimit
              ? new Date(campaign.data_fillimit).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
    );
})}

  {filteredCampaigns.length === 0 && (
    <div className="col-span-full py-10 text-center text-slate-400 text-sm">
      No campaigns found
    </div>
  )}
</div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              {currentCampaign ? "Edit Campaign" : "Create New Campaign"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Campaign Name" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.emertimi} onChange={(e) => setFormData({ ...formData, emertimi: e.target.value })} required />
              <input type="text" placeholder="Objective" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.objektivi} onChange={(e) => setFormData({ ...formData, objektivi: e.target.value })} />
              <select className="w-full bg-slate-50 rounded-2xl p-4" value={formData.channel_id}onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}>
              <option value="">Select Channel</option>{channels.map((channel) => (<option key={channel.id} value={channel.id}>
              {channel.emertimi} {channel.lloji ? `(${channel.lloji})` : ""}
              </option>
              ))}
              </select>
              <input type="number" step="0.01" placeholder="Budget" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.buxheti} onChange={(e) => setFormData({ ...formData, buxheti: e.target.value })} />
              <input type="date" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.data_fillimit} onChange={(e) => setFormData({ ...formData, data_fillimit: e.target.value })} />
              <input type="date" className="w-full bg-slate-50 rounded-2xl p-4" value={formData.data_perfundimit} onChange={(e) => setFormData({ ...formData, data_perfundimit: e.target.value })} />
              <textarea placeholder="Description" className="w-full bg-slate-50 rounded-2xl p-4 min-h-[90px]" value={formData.pershkrimi} onChange={(e) => setFormData({ ...formData, pershkrimi: e.target.value })} />

              <select className="w-full bg-slate-50 rounded-2xl p-4" value={formData.statusi} onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>

              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">
                {currentCampaign ? "Update Campaign" : "Create Campaign"}
              </button>

              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
      <h3 className="text-[26px] font-bold text-[#1e293b] mb-3 tracking-tight">
        Are you sure?
      </h3>

      <p className="text-[#64748b] text-base leading-relaxed mb-10 px-4">
        Campaign{" "}
        <span className="font-bold text-[#475569]">
          {currentCampaign?.emertimi}
        </span>{" "}
        will be deleted permanently.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setCurrentCampaign(null);
          }}
          className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
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

export default CampaignTab;