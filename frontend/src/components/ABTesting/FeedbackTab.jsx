import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const FeedbackTab = ({ feedbacks = [], abTests = [], refreshData }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const canEdit = (item) => {
    const roles = user?.roles || user?.role || user?.userroles || [];
    const userRoles = Array.isArray(roles) ? roles : [roles];
    const normalizedRoles = userRoles.map(r => 
      typeof r === 'string' ? r.toUpperCase() : (r?.role?.normalized_name || r?.normalized_name || '').toUpperCase()
    );
    const isAdminOrManager = normalizedRoles.includes("ADMIN") || normalizedRoles.includes("MANAGER");
    
    return isAdminOrManager || Number(item.user_id) === Number(user?.id);
  };

  const [formData, setFormData] = useState({
    ab_test_id: "",
    komenti: "", 
  });
  
  const filteredFeedbacks = feedbacks.filter((f) =>
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
        await api.put(`/ab-feedbacks/${currentFeedback.id}`, formData);
      } else {
        await api.post("/ab-feedbacks", formData);
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (currentFeedback) {
        await api.delete(`/ab-feedbacks/${currentFeedback.id}`);
        setIsDeleteModalOpen(false);
        setCurrentFeedback(null);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search by experiment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2.5 w-full sm:w-72 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          Add User Feedback
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Experiment Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Feedback Comment</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-sm text-gray-400">
                    No feedback found for this experiment.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {feedback.abtest?.variant_name || `ID: ${feedback.ab_test_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md break-words">
                      {feedback.comment}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      {canEdit(feedback) && (
                        <>
                      <button
                        onClick={() => openModal(feedback)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCurrentFeedback(feedback);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        Delete
                      </button>
                      </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {currentFeedback ? "Edit Feedback Entry" : "Create Feedback Entry"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Experiment Name
                </label>
                <select
                  value={formData.ab_test_id}
                  onChange={(e) => setFormData({ ...formData, ab_test_id: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                >
                  <option value="">Choose an experiment...</option>
                  {abTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.variant_name} (ID: {test.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Feedback Comment
                </label>
                <textarea
                  value={formData.komenti}
                  onChange={(e) => setFormData({ ...formData, komenti: e.target.value })}
                  required
                  rows="4"
                  placeholder="Enter user observations or notes..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md"
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

export default FeedbackTab;