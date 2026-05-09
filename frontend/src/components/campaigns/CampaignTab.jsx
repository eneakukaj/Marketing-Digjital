import React, { useState } from "react";
import api from "../../api/axios";

const CampaignTab = ({ campaigns, refreshCampaigns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const [formData, setFormData] = useState({
    emertimi: "",
    pershkrimi: "",
    buxheti: "",
    data_fillimit: "",
    data_perfundimit: "",
    statusi: "draft",
    objektivi: "",
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
        await api.put(`/manager/campaigns/${currentCampaign.id}`, payload);
      } else {
        await api.post("/manager/campaigns", payload);
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
      await api.delete(`/admin/campaigns/${currentCampaign.id}`);

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
          Add New Campaign
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">Name</th>
              <th className="pb-4 font-semibold">Budget</th>
              <th className="pb-4 font-semibold">Start Date</th>
              <th className="pb-4 font-semibold">End Date</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-medium text-slate-700">{campaign.emertimi}</td>
                <td className="py-4 text-slate-500 text-sm">{campaign.buxheti || "0.00"}</td>
                <td className="py-4 text-slate-500 text-sm">
                  {campaign.data_fillimit ? campaign.data_fillimit.split("T")[0] : "N/A"}
                </td>
                <td className="py-4 text-slate-500 text-sm">
                  {campaign.data_perfundimit ? campaign.data_perfundimit.split("T")[0] : "N/A"}
                </td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      campaign.statusi === "active" || campaign.statusi === "aktiv"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {campaign.statusi || "draft"}
                  </span>
                </td>

                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(campaign)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setCurrentCampaign(campaign);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {campaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400 text-sm">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl border border-slate-100">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-slate-500 text-sm mb-8">
              Campaign <b>{currentCampaign?.emertimi}</b> will be deleted permanently.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold">
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