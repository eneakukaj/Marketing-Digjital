import React, { useState } from "react";
import api from "../../api/axios";

const ABTestingTab = ({ abTests = [], campaigns = [], refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const [formData, setFormData] = useState({
    campaign_id: "",
    variant_name: "",
    variant_a_name: "",
    variant_a_clicks: "0",
    variant_a_conversions: "0",
    variant_b_name: "",
    variant_b_clicks: "0",
    variant_b_conversions: "0",
  });

  const showNotification = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 4000);
  };

  const filteredTests = abTests.filter((test) =>
    test.variant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      let m = { variant_a: {}, variant_b: {} };
      try { m = JSON.parse(item.metrics); } catch (e) {}
      setFormData({
        campaign_id: item.campaign_id || "",
        variant_name: item.variant_name || "",
        variant_a_name: m.variant_a?.name || "",
        variant_a_clicks: m.variant_a?.clicks || 0,
        variant_a_conversions: m.variant_a?.conversions || 0,
        variant_b_name: m.variant_b?.name || "",
        variant_b_clicks: m.variant_b?.clicks || 0,
        variant_b_conversions: m.variant_b?.conversions || 0,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        campaign_id: "",
        variant_name: "",
        variant_a_name: "",
        variant_a_clicks: "0",
        variant_a_conversions: "0",
        variant_b_name: "",
        variant_b_clicks: "0",
        variant_b_conversions: "0",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedItem) {
        let oldVotedUsers = [];

        try {
          const oldMetrics = JSON.parse(selectedItem.metrics);
          oldVotedUsers = oldMetrics.voted_users || [];
        } catch (err) {}

        const updatedMetrics = {
          variant_a: {
            name: formData.variant_a_name,
            clicks: Number(formData.variant_a_clicks),
            conversions: Number(formData.variant_a_conversions),
            votes: Number(
              JSON.parse(selectedItem.metrics)?.variant_a?.votes || 0
            ),
          },
          variant_b: {
            name: formData.variant_b_name,
            clicks: Number(formData.variant_b_clicks),
            conversions: Number(formData.variant_b_conversions),
            votes: Number(
              JSON.parse(selectedItem.metrics)?.variant_b?.votes || 0
            ),
          },
          voted_users: oldVotedUsers,
        };

        await api.put(`/ab-tests/${selectedItem.id}`, {
          campaign_id: formData.campaign_id,
          variant_name: formData.variant_name,
          metrics: JSON.stringify(updatedMetrics),
        });
      } else {
        await api.post("/ab-tests", formData);
      }

      refreshData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (id, variant) => {
    try {
      await api.post(`/ab-tests/${id}/vote`, { variant });
      showNotification("Your vote has been registered successfully!", "success");
      refreshData();
    } catch (error) {
      let errMsg = error.response?.data?.error || "An error occurred during voting";
      if (errMsg.includes("votuar")) {
        errMsg = "You have already voted for this test!";
      }
      showNotification(errMsg, "error");
      console.error(error);
    }
  };

   const handleDelete = async () => {
    try {
      await api.delete(`/ab-tests/${selectedItem.id}`);
      refreshData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateCR = (clicks, conversions) => {
    const clk = Number(clicks) || 0;
    const cnv = Number(conversions) || 0;
    return clk > 0 ? ((cnv / clk) * 100).toFixed(1) + "%" : "0%";
  };

  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 relative">
      {toast.show && (
        <div className="fixed top-6 right-6 z-[200]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-3 text-slate-400">✕</button>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search A/B experiments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white border border-slate-300 rounded-2xl px-5 py-3 text-sm w-full sm:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
        >
          + Add Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTests.map((test) => {
          let m = { variant_a: {}, variant_b: {} };
          try { m = JSON.parse(test.metrics); } catch (e) {}

          return (
            <div key={test.id} className="bg-slate-100 rounded-3xl p-6 shadow-md border border-slate-300 transition-all hover:shadow-lg">
              <div className="flex justify-between items-start border-b border-slate-300 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-3 py-1 rounded-full">
                    {test.campaign?.emertimi || test.campaign?.emri || test.campaign?.name || `Campaign #${test.campaign_id}`}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">{test.variant_name}</h3>
                </div>
                
                
                <div className="flex items-center gap-2 ml-auto bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                  <button
                    onClick={() => openModal(test)}
                    title="Edit"
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => { setSelectedItem(test); setIsDeleteModalOpen(true); }}
                    title="Delete"
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-800 text-sm">{m.variant_a?.name || "Variant A"}</h4>
                      <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">Votes: {m.variant_a?.votes || 0}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[11px] uppercase font-bold text-slate-400">Clicks</div>
                        <div className="text-sm font-bold text-slate-700">{m.variant_a?.clicks || 0}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-bold text-slate-400">Conversions</div>
                        <div className="text-sm font-bold text-slate-700">{m.variant_a?.conversions || 0}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-bold text-emerald-600">CR %</div>
                        <div className="text-sm font-extrabold text-emerald-600">{calculateCR(m.variant_a?.clicks, m.variant_a?.conversions)}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVote(test.id, "variant_a")}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2 rounded-xl text-xs transition-all shadow-sm"
                  >
                    Vote Variant A
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-slate-800 text-sm">{m.variant_b?.name || "Variant B"}</h4>
                      <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">Votes: {m.variant_b?.votes || 0}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[11px] uppercase font-bold text-slate-400">Clicks</div>
                        <div className="text-sm font-bold text-slate-700">{m.variant_b?.clicks || 0}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-bold text-slate-400">Conversions</div>
                        <div className="text-sm font-bold text-slate-700">{m.variant_b?.conversions || 0}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase font-bold text-emerald-600">CR %</div>
                        <div className="text-sm font-extrabold text-emerald-600">{calculateCR(m.variant_b?.clicks, m.variant_b?.conversions)}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVote(test.id, "variant_b")}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2 rounded-xl text-xs transition-all shadow-sm"
                  >
                    Vote Variant B
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {selectedItem ? "Modify Experiment" : "Create New Experiment"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Experiment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Button Color Test"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Campaign</label>
                <select
                  required
                  value={formData.campaign_id}
                  onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a campaign...</option>
                  {Array.isArray(campaigns) && campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emertimi || c.emri || c.name || `Campaign #${c.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-700 text-xs uppercase mb-1">Variant A</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Variant Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Red Button"
                      required
                      value={formData.variant_a_name}
                      onChange={(e) => setFormData({ ...formData, variant_a_name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Clicks</label>
                    <input
                      type="number"
                      value={formData.variant_a_clicks}
                      onChange={(e) => setFormData({ ...formData, variant_a_clicks: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Conversions</label>
                    <input
                      type="number"
                      value={formData.variant_a_conversions}
                      onChange={(e) => setFormData({ ...formData, variant_a_conversions: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-700 text-xs uppercase mb-1">Variant B</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Variant Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Blue Button"
                      required
                      value={formData.variant_b_name}
                      onChange={(e) => setFormData({ ...formData, variant_b_name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Clicks</label>
                    <input
                      type="number"
                      value={formData.variant_b_clicks}
                      onChange={(e) => setFormData({ ...formData, variant_b_clicks: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Conversions</label>
                    <input
                      type="number"
                      value={formData.variant_b_conversions}
                      onChange={(e) => setFormData({ ...formData, variant_b_conversions: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md"
                >
                  Save Experiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Experiment?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-rose-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-rose-700"
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