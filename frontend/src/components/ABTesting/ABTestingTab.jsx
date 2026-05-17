import React, { useState } from "react";
import api from "../../api/axios";

const ABTestingTab = ({ abTests = [], campaigns = [], refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    campaign_id: "", 
    variant_name: "", 
    metrics: ""
  });

  // Filtrimi i testetve sipas emrit të variantit
  const filteredTests = abTests.filter((test) =>
    test.variant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        campaign_id: item.campaign_id || "",
        variant_name: item.variant_name || "",
        metrics: item.metrics || ""
      });
    } else {
      setSelectedItem(null);
      setFormData({ campaign_id: "", variant_name: "", metrics: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        campaign_id: Number(formData.campaign_id),
        variant_name: formData.variant_name,
        metrics: formData.metrics
      };

      if (selectedItem) {
        await api.put(`/ab-tests/${selectedItem.id}`, payload);
      } else {
        await api.post("/ab-tests", payload);
      }
      refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving A/B Test:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await api.delete(`/ab-tests/${selectedItem.id}`);
      refreshData();
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting A/B Test:", err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">A/B Testing Experiments</h3>
          <p className="text-slate-400 text-sm">Manage campaign design variants and track performance split tests</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-sm shadow-indigo-100"
        >
          + Add Variant Test
        </button>
      </div>

      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search variants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-4 pl-4">Campaign ID</th>
              <th className="pb-4">Variant Name</th>
              <th className="pb-4">Metrics / Results</th>
              <th className="pb-4 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-400 font-medium text-sm">
                  No A/B tests found.
                </td>
              </tr>
            ) : (
              filteredTests.map((test) => (
                <tr key={test.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 pl-4 font-bold text-slate-700">
                    {campaigns.find(c => c.id === test.campaign_id)?.emertimi || `Campaign #${test.campaign_id}`}
                  </td>
                  <td className="py-4 text-slate-600 font-semibold">{test.variant_name}</td>
                  <td className="py-4 text-slate-500 max-w-xs truncate">{test.metrics || "No metrics recorded"}</td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button onClick={() => openModal(test)} className="text-indigo-600 font-bold hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(test);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[500px] shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-2xl font-black text-slate-800 mb-6">
              {selectedItem ? "Edit Variant Test" : "Create Variant Test"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Select Campaign</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 mt-1 font-medium focus:outline-none"
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                >
                  <option value="">-- Choose Campaign --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Variant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Red Button Variant, Summer Banner"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 mt-1 font-medium focus:outline-none"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Metrics Info</label>
                <textarea
                  rows="3"
                  placeholder="Enter variant description, conversion goals or notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 mt-1 font-medium focus:outline-none"
                  value={formData.metrics}
                  onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 hover:bg-indigo-700 transition-all shadow-md"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[440px] text-center shadow-2xl border border-slate-100/50 mx-4">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-3">Are you sure?</h3>
            <p className="text-[#64748b] text-base mb-10">This experiment variant will be removed permanently.</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-md"
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

export default ABTestingTab;