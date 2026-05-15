import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const SchedulingTab = ({ campaigns }) => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [formData, setFormData] = useState({
    campaign_id: "",
    content_id: "",
    scheduled_time: "",
    statusi: "pending",
  });

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/manager/scheduling");
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openModal = (schedule = null) => {
  if (schedule) {
    setCurrentSchedule(schedule);

    setFormData({
      campaign_id: schedule.campaign_id || "",
      content_id: schedule.content_id || "",
      scheduled_time: schedule.scheduled_time
        ? schedule.scheduled_time.slice(0, 16)
        : "",
      statusi: schedule.statusi || "pending",
    });
  } else {
    setCurrentSchedule(null);

    setFormData({
      campaign_id: "",
      content_id: "",
      scheduled_time: "",
      statusi: "pending",
    });
  }

  setIsModalOpen(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
  campaign_id: Number(formData.campaign_id),
  content_id: formData.content_id
    ? Number(formData.content_id)
    : null,
  scheduled_time: formData.scheduled_time
    ? new Date(formData.scheduled_time).toISOString()
    : null,
  statusi: formData.statusi,
};

if (currentSchedule) {
  await api.put(
    `/manager/scheduling/${currentSchedule.id}`,
    payload
  );
} else {
  await api.post("/manager/scheduling", payload);
}

      setFormData({
        campaign_id: "",
        content_id: "",
        scheduled_time: "",
        statusi: "pending",
      });

      setIsModalOpen(false);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to create schedule", err);
      alert(
        err.response?.data?.message ||
          "Failed to create schedule"
      );
    }
  };

 const handleDelete = async () => {
  try {
    await api.delete(`/manager/scheduling/${scheduleToDelete.id}`);
    fetchSchedules();
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  } catch (err) {
    console.error("Delete failed", err);
    alert(err.response?.data?.message || "Failed to delete schedule");
  }
};

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-2xl text-slate-800">
            Scheduling Management
          </h3>

          <p className="text-slate-400 text-sm">
            Manage campaign scheduling and publishing
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add New Schedule
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="pb-4 font-semibold">
                Campaign ID
              </th>

              <th className="pb-4 font-semibold">
                Content ID
              </th>

              <th className="pb-4 font-semibold">
                Scheduled Time
              </th>

              <th className="pb-4 font-semibold">
                Status
              </th>

              <th className="pb-4 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {schedules.map((schedule) => (
              <tr
  key={schedule.id}
  className="group hover:bg-slate-50/50 transition-colors"
>
  <td className="py-4 text-slate-700">
    {schedule.campaign_id}
  </td>

  <td className="py-4 text-slate-500 text-sm">
    {schedule.content_id || "N/A"}
  </td>

  <td className="py-4 text-slate-500 text-sm">
    {schedule.scheduled_time
      ? schedule.scheduled_time
          .replace("T", " ")
          .slice(0, 16)
      : "N/A"}
  </td>

  <td className="py-4">
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
      {schedule.statusi}
    </span>
  </td>

  <td className="py-4 text-right">
    <div className="flex justify-end gap-2">
      <button
        onClick={() => openModal(schedule)}
        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        Edit
      </button>

      <button
        onClick={() => {
          setScheduleToDelete(schedule);
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

            {schedules.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  No schedules found
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
              {currentSchedule ? "Edit Schedule" : "Create New Schedule"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.campaign_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    campaign_id: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Campaign
                </option>

                {campaigns.map((campaign) => (
                  <option
                    key={campaign.id}
                    value={campaign.id}
                  >
                    {campaign.emertimi}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Content ID optional"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.content_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content_id: e.target.value,
                  })
                }
              />

              <input
                type="datetime-local"
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.scheduled_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduled_time:
                      e.target.value,
                  })
                }
              />

              <select
                className="w-full bg-slate-50 rounded-2xl p-4"
                value={formData.statusi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    statusi: e.target.value,
                  })
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold"
              >
                {currentSchedule ? "Update Schedule" : "Create Schedule"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(false)
                }
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
        Schedule{" "}
        <span className="font-bold text-[#475569]">
          #{scheduleToDelete?.id}
        </span>{" "}
        will be deleted permanently.
      </p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setIsDeleteModalOpen(false);
            setScheduleToDelete(null);
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

export default SchedulingTab;