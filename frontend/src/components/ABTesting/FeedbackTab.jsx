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
    f.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.abtest?.variant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (feedback = null) => {
    if (feedback) {
      setCurrentFeedback(feedback);
      setFormData({
        ab_test_id: feedback.ab_test_id || "",
        komenti: feedback.comment || "", 
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
        await api.put(`/ab-feedbacks/${currentFeedback.id}`, {
          ab_test_id: Number(formData.ab_test_id),
          komenti: formData.komenti,
        });
      } else {
        await api.post("/ab-feedbacks", {
          ab_test_id: Number(formData.ab_test_id),
          komenti: formData.komenti,
        });
      }
      setIsModalOpen(false);
      setCurrentFeedback(null);
      refreshData(); 
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentFeedback) return;
    try {
      await api.delete(`/ab-feedbacks/${currentFeedback.id}`);
      setIsDeleteModalOpen(false);
      setCurrentFeedback(null);
      refreshData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Experiment Feedback</h2>
          <p className="text-sm text-slate-500 mt-1">Review qualitative notes and variant performance feedback</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 text-sm"
        >
          Add Feedback Note
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search feedback comments or variant names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 pl-4">Variant Tested</th>
              <th className="py-4">Qualitative Feedback</th>
              <th className="py-4 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((f) => (
                <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 pl-4 font-bold text-slate-700">
                    {/* PËRMIRËSUAR: Leximi nga f.abtest në vend të f.ab_tests */}
                    {f.abtest?.variant_name || `Test ID: ${f.ab_test_id}`}
                  </td>
                  {/* PËRMIRËSUAR: Leximi nga f.comment në vend të f.komenti */}
                  <td className="py-4 text-slate-600 max-w-md break-words">{f.comment}</td>
                  <td className="py-4 text-right pr-4 space-x-2">
                    <button onClick={() => openModal(f)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setCurrentFeedback(f);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-12 text-center text-sm text-slate-400 font-medium">
                  No feedback entries found matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal për Shtim / Editim */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[540px] shadow-2xl border border-slate-100/50 mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-[26px] font-bold text-[#1e293b] mb-2 tracking-tight">
              {currentFeedback ? "Edit Feedback Entry" : "Create New Feedback"}
            </h3>
            <p className="text-[#64748b] text-sm mb-8 leading-relaxed">
              Document detailed user or team feedback regarding a specific variant configuration.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Select Experiment Variant
                </label>
                <select
                  required
                  value={formData.ab_test_id}
                  onChange={(e) => setFormData({ ...formData, ab_test_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                >
                  <option value="">-- Choose a Variant --</option>
                  {abTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.variant_name || `Test #${test.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Feedback Notes & Commentary
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type qualitative review findings here..."
                  value={formData.komenti}
                  onChange={(e) => setFormData({ ...formData, komenti: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentFeedback(null);
                  }}
                  className="flex-1 bg-[#f1f5f9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#e2e8f0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal për Konfirmim Fshirjeje */}
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
                className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-rose-700 transition-all shadow-md shadow-rose-100"
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