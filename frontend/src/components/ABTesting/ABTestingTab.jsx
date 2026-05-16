import React, { useState } from "react";
import api from "../../api/axios";

const ABTestingTab = ({ feedbacks, campaigns, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    campaign_id: "", emri_testit: "", metrika_klikimeve: "", buxheti_shpenzuar: "", statusi: "active"
  });

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        campaign_id: item.campaign_id || "",
        emri_testit: item.emri_testit || "",
        metrika_klikimeve: item.metrika_klikimeve || "",
        buxheti_shpenzuar: item.buxheti_shpenzuar || "",
        statusi: item.statusi || "active",
        komenti: item.komenti || "" 
      });
    } else {
      setSelectedItem(null);
      setFormData({ campaign_id: "", emri_testit: "", metrika_klikimeve: "", buxheti_shpenzuar: "", statusi: "active", komenti: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.put(`/manager/feedbacks/${selectedItem.id}`, formData);
      } else {
        await api.post("/manager/feedbacks", formData);
      }
      refreshData();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <input
          type="text"
          placeholder="Search experiments..."
          className="w-1/3 px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          + Add Experiment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs uppercase bg-slate-50/50">
              <th className="p-4">Experiment/Variation Name</th>
              <th className="p-4">Clicks Metric</th>
              <th className="p-4">Budget Spent</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 text-sm">
            {feedbacks.filter(f => f.emri_testit?.toLowerCase().includes(searchTerm.toLowerCase())).map((f) => (
              <tr key={f.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-800">{f.emri_testit}</td>
                <td className="p-4">{f.metrika_klikimeve} clicks</td>
                <td className="p-4">${f.buxheti_shpenzuar}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${f.statusi === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {f.statusi}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => openModal(f)} className="text-slate-400 font-bold hover:text-indigo-600">Edit</button>
                  <button onClick={() => { setSelectedItem(f); setIsDeleteModalOpen(true); }} className="text-slate-400 font-bold hover:text-rose-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-8">{selectedItem ? "Edit Experiment" : "New Experiment"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full bg-slate-100 rounded-2xl p-4" value={formData.campaign_id} onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })} required>
                <option value="">Select Campaign</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.emertimi}</option>)}
              </select>
              <input className="w-full bg-slate-100 rounded-2xl p-4" placeholder="Experiment Name (e.g. Red CTA Button)" value={formData.emri_testit} onChange={(e) => setFormData({ ...formData, emri_testit: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full bg-slate-100 rounded-2xl p-4" placeholder="Clicks" value={formData.metrika_klikimeve} onChange={(e) => setFormData({ ...formData, metrika_klikimeve: e.target.value })} />
                <input type="number" className="w-full bg-slate-100 rounded-2xl p-4" placeholder="Budget Spent" value={formData.buxheti_shpenzuar} onChange={(e) => setFormData({ ...formData, buxheti_shpenzuar: e.target.value })} />
              </div>
              <select className="w-full bg-slate-100 rounded-2xl p-4" value={formData.statusi} onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3">Are you sure?</h3>
            <p className="text-[#64748b] mb-10">This experiment will be deleted permanently.</p>
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-[#f1f5f9] py-4 rounded-2xl font-bold">Cancel</button>
              <button type="button" onClick={async () => { await api.delete(`/manager/feedbacks/${selectedItem.id}`); refreshData(); setIsDeleteModalOpen(false); }} className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestingTab;