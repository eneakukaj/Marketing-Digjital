import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MilestoneTab = ({ campaigns, user }) => {
  const [milestones, setMilestones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/manager/milestones", {
        user_id: user?.id,
        campaign_id: formData.campaign_id ? Number(formData.campaign_id) : null,
        description: formData.description,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        statusi: formData.statusi,
      });

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/manager/milestones/${id}`);
      fetchMilestones();
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
          onClick={() => setIsModalOpen(true)}
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
                  <button
                    onClick={() => handleDelete(milestone.id)}
                    className="text-rose-600 font-bold"
                  >
                    Delete
                  </button>
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
              Create New Milestone
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
                Create Milestone
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
    </div>
  );
};

export default MilestoneTab;