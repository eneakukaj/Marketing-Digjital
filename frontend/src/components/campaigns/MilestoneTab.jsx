import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MilestoneTab = ({ campaigns, user }) => {
  const [milestones, setMilestones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);

  const [formData, setFormData] = useState({
    campaign_id: "",
    description: "",
    due_date: "",
    statusi: "pending",
  });

  const fetchMilestones = async () => {
    try {
      const res = await api.get("/manager/milestones");
      setMilestones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch milestones", err);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const openModal = (milestone = null) => {
  if (milestone) {
    setCurrentMilestone(milestone);

    setFormData({
      campaign_id: milestone.campaign_id || "",
      description: milestone.description || "",
      due_date: milestone.due_date ? milestone.due_date.split("T")[0] : "",
      statusi: milestone.statusi || "pending",
    });
  } else {
    setCurrentMilestone(null);

    setFormData({
      campaign_id: "",
      description: "",
      due_date: "",
      statusi: "pending",
    });
  }

  setIsModalOpen(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
  user_id: user?.id,
  campaign_id: formData.campaign_id ? Number(formData.campaign_id) : null,
  description: formData.description,
  due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
  statusi: formData.statusi,
};

if (currentMilestone) {
  await api.put(`/manager/milestones/${currentMilestone.id}`, payload);
} else {
  await api.post("/manager/milestones", payload);
}

      setFormData({
        campaign_id: "",
        description: "",
        due_date: "",
        statusi: "pending",
      });

      setIsModalOpen(false);
      fetchMilestones();
    } catch (err) {
      console.error("Failed to create milestone", err);
      alert(err.response?.data?.message || "Failed to create milestone");
    }
  };

  const handleDelete = async () => {
  try {
    await api.delete(`/manager/milestones/${milestoneToDelete.id}`);
    fetchMilestones();
    setIsDeleteModalOpen(false);
    setMilestoneToDelete(null);
  } catch (err) {
    console.error("Delete failed", err);
    alert(err.response?.data?.message || "Failed to delete milestone");
  }
};

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">
            Milestone Management
          </h3>
          <p className="text-slate-400 text-sm">
            Manage campaign milestones and deadlines
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add New Milestone
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">Campaign ID</th>
              <th className="pb-4 font-semibold">Description</th>
              <th className="pb-4 font-semibold">Due Date</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {milestones.map((milestone) => (
              <tr key={milestone.id} className="group hover:bg-slate-50/50 transition-colors">
  <td className="py-4 text-slate-700">
    {milestone.campaign_id || "N/A"}
  </td>

  <td className="py-4 text-slate-500 text-sm">
    {milestone.description || "N/A"}
  </td>

  <td className="py-4 text-slate-500 text-sm">
    {milestone.due_date ? milestone.due_date.split("T")[0] : "N/A"}
  </td>

  <td className="py-4">
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
      {milestone.statusi || "pending"}
    </span>
  </td>

  <td className="py-4 text-right">
    <div className="flex justify-end gap-2">
      <button
        onClick={() => openModal(milestone)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        Edit
      </button>

      <button
        onClick={() => {
          setMilestoneToDelete(milestone);
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

            {milestones.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-slate-400 text-sm">
                  No milestones found
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
              {currentMilestone ? "Edit Milestone" : "Create New Milestone"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.campaign_id}
                onChange={(e) =>
                  setFormData({ ...formData, campaign_id: e.target.value })
                }
              >
                <option value="">Select Campaign</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.emertimi}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Description"
                className="w-full bg-slate-50 rounded-2xl p-4 min-h-[90px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />

              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.statusi}
                onChange={(e) =>
                  setFormData({ ...formData, statusi: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
              >
                {currentMilestone ? "Update Milestone" : "Create Milestone"}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold"
              >
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
        Milestone{" "}
        <span className="font-bold text-[#475569]">
          {milestoneToDelete?.description || `#${milestoneToDelete?.id}`}
        </span>{" "}
        will be deleted permanently.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setMilestoneToDelete(null);
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

export default MilestoneTab;