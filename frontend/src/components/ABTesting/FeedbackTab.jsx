import React, { useState } from "react";
import api from "../../api/axios";

const FeedbackTab = ({ feedbacks, abTests, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    ab_test_id: "",
    komenti: "",
  });

  
  const filteredFeedbacks = feedbacks.filter((f) =>
    f.komenti?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.ab_tests?.emri_testit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (feedback = null) => {
    if (feedback) {
      setCurrentFeedback(feedback);
      setFormData({
        ab_test_id: feedback.ab_test_id || "",
        komenti: feedback.komenti || "",
      });
    } else {
      setCurrentFeedback(null);
      setFormData({
        ab_test_id: "",
        komenti: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFeedback) {
        await api.put(`/ab-feedbacks/${currentFeedback.id}`, formData);
      } else {
        await api.post("/ab-feedbacks", formData);
      }
      refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving feedback:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/ab-feedbacks/${currentFeedback.id}`);
      refreshData();
      setIsDeleteModalOpen(false);
      setCurrentFeedback(null);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search feedback notes..."
            className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          + Add User Feedback
        </button>
      </div>

      
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-widest bg-slate-50/50">
              <th className="p-4">Experiment Variation</th>
              <th className="p-4">Feedback Note / Observations</th>
              <th className="p-4">Date Added</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-600 text-sm">
            {filteredFeedbacks.map((f) => (
              <tr key={f.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-800">
                  {f.ab_tests?.emri_testit || `Experiment #${f.ab_test_id}`}
                </td>
                <td className="p-4 italic text-slate-600">"{f.komenti}"</td>
                <td className="p-4 text-slate-400 text-xs">
                  {f.data_krijimit ? new Date(f.data_krijimit).toLocaleDateString() : "-"}
                </td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => openModal(f)}
                    className="text-slate-400 font-bold hover:text-indigo-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentFeedback(f);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-slate-400 font-bold hover:text-rose-500 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-8">
              {currentFeedback ? "Edit Feedback Note" : "New Feedback Entry"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Select A/B Test</label>
                <select
                  className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.ab_test_id}
                  onChange={(e) => setFormData({ ...formData, ab_test_id: e.target.value })}
                  required
                  disabled={!!currentFeedback}
                >
                  <option value="">Choose an active experiment...</option>
                  {abTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.emri_testit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Observations & Feedback</label>
                <textarea
                  className="w-full bg-slate-100 border-none rounded-2xl p-4 h-36 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  placeholder="Write customer responses, heat-map results, or UI observations..."
                  value={formData.komenti}
                  onChange={(e) => setFormData({ ...formData, komenti: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
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
                  Save Feedback
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
              This feedback entry will be removed permanently from this experiment.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentFeedback(null);
                }}
                className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
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

export default FeedbackTab;