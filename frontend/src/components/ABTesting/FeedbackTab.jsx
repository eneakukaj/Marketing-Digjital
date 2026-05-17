import React, { useState } from "react";
import api from "../../api/axios";

const FeedbackTab = ({ feedbacks = [], abTests = [], refreshData }) => {
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
    f.ab_tests?.variant_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (!currentFeedback) return;
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
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">User Feedback & Notes</h3>
          <p className="text-slate-400 text-sm">Review comments and user qualitative insights on variant performance</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-sm shadow-indigo-100"
        >
          + Add Feedback / Note
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search comments or variants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-4 pl-4">A/B Test Variant</th>
              <th className="pb-4">Feedback / Comment</th>
              <th className="pb-4 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-slate-400 font-medium text-sm">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((f) => (
                <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 pl-4 font-bold text-slate-700">
                   
                    {f.ab_tests?.variant_name || `Test ID: ${f.ab_test_id}`}
                  </td>
                  <td className="py-4 text-slate-600 max-w-md break-words">{f.komenti}</td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button onClick={() => openModal(f)} className="text-indigo-600 font-bold hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setCurrentFeedback(f);
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
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[500px] shadow-2xl border border-slate-100/50 mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-6">
              {currentFeedback ? "Edit Feedback Note" : "Create Feedback Note"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Select A/B Test Variant</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 mt-1 font-medium focus:outline-none"
                  value={formData.ab_test_id}
                  onChange={(e) => setFormData({ ...formData, ab_test_id: e.target.value })}
                >
                  <option value="">-- Choose Experiment --</option>
                  {abTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.variant_name || `Variant ${test.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Feedback Comment</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Enter user feedback or test notes here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 mt-1 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.komenti}
                  onChange={(e) => setFormData({ ...formData, komenti: e.target.value })}
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
                  Save Note
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
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-rose-700 transition-colors shadow-md shadow-rose-100"
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